import ArchiveReader from './archive/reader';
import TreeNode from './archive/reader/tree-node';
import SurfaceNode from './node';

/**
 * Each list item is tree roots
 */
export default class Surface extends Array<SurfaceNode> {

  public static fromArchiveFile(filename: string): Surface {
    const ar = new ArchiveReader(filename);
    const header = ar.readHeader();
    const nodes = ar.readTableOfContent();
    return new this(nodes, header.roots);
  }

  constructor(treeNodes: TreeNode[], treeRootsIndices: number[]) {
    super(treeRootsIndices.length);
    for (const [treeRootsIndex, treeNodeIndex] of treeRootsIndices.entries()) {
      const resolutionLevel = treeRootsIndex > 3 ? 4 : treeRootsIndex + 1;
      this[treeRootsIndex] = new SurfaceNode(treeNodes, treeNodeIndex, resolutionLevel);
    }
  }
}
