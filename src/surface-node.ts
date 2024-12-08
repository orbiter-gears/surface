import TreeNode from './archive/reader/tree-node';
import Archive from './archive';
import GeoBound from './geo-bound';

/**
 * Surface tail node
 */
export default class SurfaceNode {

  /**
   * TreeNode Archive index
   */
  public readonly index: number;

  /**
   * Original Archive TreeNode
   */
  public readonly origin: TreeNode;

  /**
   * Node resolution level
   */
  public readonly resolutionLevel: number;

  /**
   * Node parent if node is not global or hemisphere
   */
  public readonly parent: SurfaceNode | undefined;

  /**
   * Tail bounding box
   */
  public readonly bound: GeoBound;

  /**
   * Tail children
   */
  public readonly children: [
    SurfaceNode | undefined,
    SurfaceNode | undefined,
    SurfaceNode | undefined,
    SurfaceNode | undefined
  ] = [
    undefined,
    undefined,
    undefined,
    undefined
  ];

  /**
   * Archive reference
   * @private
   */
  private readonly archive: Archive;

  /**
   *
   * @param archive Archive reference
   * @param index Original TreeNode index
   * @param resolutionLevel Resolution level
   * @param parent Parent if exists
   * @param bound Tail surface bound
   */
  constructor(archive: Archive, index: number, resolutionLevel: number, parent: SurfaceNode | undefined, bound: GeoBound) {
    this.archive = archive;
    this.index = index;
    this.origin = archive.nodes[index];
    this.resolutionLevel = resolutionLevel;
    this.parent = parent;
    this.bound = bound;

    this.defineChildren();
  }

  /**
   * Define children as SurfaceNode's instances
   * @private
   */
  private defineChildren(): void {
    const [nw, ne, sw, se] = this.origin.children;
    const rl = this.resolutionLevel + 1;
    if (nw !== undefined) {
      this.children[0] = new SurfaceNode(this.archive, nw, rl, this, this.bound.createNorthWestQuad());
    }
    if (ne !== undefined) {
      this.children[0] = new SurfaceNode(this.archive, ne, rl, this, this.bound.createNorthEastQuad());
    }
    if (sw !== undefined) {
      this.children[0] = new SurfaceNode(this.archive, sw, rl, this, this.bound.createSouthWestQuad());
    }
    if (se !== undefined) {
      this.children[0] = new SurfaceNode(this.archive, se, rl, this, this.bound.createSouthEastQuad());
    }
  }
}
