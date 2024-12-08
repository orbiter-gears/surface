import * as zlib from 'node:zlib';

import Reader from './reader';
import Header from './reader/header';
import TreeNode from './reader/tree-node';

/**
 * Read and provide surface archive information
 */
export default class Archive {

  /**
   * Archive filename
   */
  public readonly filename: string;

  /**
   * Archive reader
   */
  public readonly reader: Reader;

  /**
   * Archive header information
   */
  public readonly header: Header;

  /**
   * Nodes from Archive TOC
   */
  public readonly nodes: TreeNode[];

  /**
   *
   * @param filename Archive filename
   */
  constructor(filename: string) {
    this.filename = filename;
    this.reader = new Reader(filename);
    this.header = this.reader.readHeader();
    this.nodes = this.reader.readTableOfContent(this.header);
  }

  /**
   * Read and returns TreeNode data as inflated buffer
   * @param treeNode
   */
  public readTreeNodeDecompressedData(treeNode: TreeNode): Buffer {
    const buffer = this.reader.readTreeNodeData(treeNode, this.header);
    return zlib.inflateSync(buffer);
  }
}
