import ArchiveReader from './archive/reader';
import TreeNode from './archive/reader/tree-node';

export default class Surface {

  public static fromArchiveFile(filename: string): Surface {
    const ar = new ArchiveReader(filename);
    const header = ar.readHeader();
    const nodes = ar.readTableOfContent();
  }

  constructor(nodes: TreeNode[], roots: number[]) {
  }
}
