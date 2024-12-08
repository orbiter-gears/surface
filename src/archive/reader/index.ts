import * as fs from 'node:fs';

import Header from './header';
import TreeNode from './tree-node';

type TreeNodeMod = Omit<TreeNode, 'length'> & { length: number };
type Context = [offset: bigint];

/**
 * Read information from specified path to .tree file
 */
export default class Reader {

  /**
   * Archive filename
   */
  public readonly filename: string;

  /**
   * File descriptor
   * @private
   */
  private readonly fd: number;

  /**
   *
   * @param filename Path to archive file
   */
  constructor(filename: string) {
    this.filename = filename;
    this.fd = fs.openSync(this.filename, 'r');
  }

  private read(length: number, context: Context): Buffer {
    const buffer = Buffer.alloc(length);
    fs.readSync(this.fd, buffer, 0, buffer.length, context[0]);
    context[0] += BigInt(length);
    return buffer;
  }

  private readBytes(length: number, context: Context): Buffer {
    return this.read(length, context);
  }

  private readInt(context: Context): number {
    return this.read(4, context).readInt32LE();
  }

  private readInt64(context: Context): bigint {
    return this.read(8, context).readBigInt64LE();
  }

  private readTreeNode(context: Context): TreeNode {
    return {
      position: this.readInt64(context),
      length: Number.NaN, // filled in upper call
      size: this.readInt(context),
      children: [
        this.readInt(context),
        this.readInt(context),
        this.readInt(context),
        this.readInt(context)
      ],
      reserved: this.readInt(context)
    };
  }

  public readHeader(): Header {
    const context: Context = [BigInt(0)];

    // read magic
    const magicBuffer = this.readBytes(4, context);
    const magic = magicBuffer.toString('utf-8', 0, 2) + magicBuffer[2] + magicBuffer[3];

    // read fields
    const size = this.readInt(context);
    const flags = this.readInt(context);
    const data: Header['data'] = {
      offset: this.readInt(context),
      length: this.readInt64(context)
    };
    const nodes = this.readInt(context);
    const roots = [];
    for (let index = 0; index < 5; index++) {
      roots.push(this.readInt(context));
    }
    return { magic, size, flags, data, nodes, roots };
  }

  public readTableOfContent(header: Header = this.readHeader(), limit: number = header.nodes): TreeNode[] {
    const context: Context = [BigInt(header.size)];
    const nodes: TreeNodeMod[] = [];
    let previous: TreeNodeMod | undefined = undefined;
    while (limit-- > 0) {
      const node = this.readTreeNode(context);
      if (previous !== undefined) {
        previous.length = Number(node.position - previous.position);
      }
      nodes.push(previous = node);
    }
    return nodes;
  }

  public readTreeNodeData(treeNode: TreeNode, header = this.readHeader()): Buffer {
    return this.readBytes(treeNode.length, [BigInt(header.data.offset) + treeNode.position]);
  }

  public destroy(): void {
    fs.closeSync(this.fd);
  }
}


