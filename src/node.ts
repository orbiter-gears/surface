import TreeNode from '../archive/reader/tree-node';

export default class SurfaceNode {

  public readonly origin: TreeNode;

  public readonly parent: TreeNode | undefined;

  constructor(origin: TreeNode, parent?: TreeNode) {
    this.origin = origin;
    this.parent = parent;
  }
}
