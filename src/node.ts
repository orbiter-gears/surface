import TreeNode from './archive/reader/tree-node';

export default class SurfaceNode {

  public readonly index: number;

  public readonly origin: TreeNode;

  public readonly resolutionLevel: number;

  public readonly parent: SurfaceNode | undefined;

  public readonly children: SurfaceNode[];

  constructor(treeNodes: TreeNode[], index: number, resolutionLevel: number, parent?: SurfaceNode) {
    this.index = index;
    this.origin = treeNodes[index];
    this.resolutionLevel = resolutionLevel;
    this.parent = parent;
    this.children = this.origin.children
      .map(childIndex => new SurfaceNode(treeNodes, childIndex, this.resolutionLevel + 1, this));
  }
}
