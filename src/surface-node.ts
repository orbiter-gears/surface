import TreeNode from './archive/reader/tree-node';
import Archive from './archive';
import GeoBound from './geo-bound';
import GeoPoint from './geo-point';

type SurfaceNodeChild = SurfaceNode | undefined;

type Siblings = {
  readonly west: SurfaceNodeChild;
  readonly east: SurfaceNodeChild,
  readonly north: SurfaceNodeChild;
  readonly south: SurfaceNodeChild;
};

type Children = [
  SurfaceNodeChild,
  SurfaceNodeChild,
  SurfaceNodeChild,
  SurfaceNodeChild
];

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
  public readonly parent: SurfaceNodeChild;

  /**
   * Tail bounding box
   */
  public readonly bound: GeoBound;

  /**
   * Tail children
   */
  public readonly children: Readonly<Children>;

  // public readonly siblings: Siblings;

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
  constructor(archive: Archive, index: number, resolutionLevel: number, parent: SurfaceNodeChild, bound: GeoBound) {
    this.archive = archive;
    this.index = index;
    this.origin = archive.nodes[index];
    this.resolutionLevel = resolutionLevel;
    this.parent = parent;
    this.bound = bound;
    this.children = this.createChildren();
    // this.siblings = {};
  }

  /**
   * Define children as SurfaceNode's instances
   * @private
   */
  private createChildren(): Children {
    const children: Children = [undefined, undefined, undefined, undefined];
    const [nw, ne, sw, se] = this.origin.children;
    const rl = this.resolutionLevel + 1;
    if (nw !== -1) {
      children[0] = new SurfaceNode(this.archive, nw, rl, this, this.bound.createNorthWestQuad());
    }
    if (ne !== -1) {
      children[1] = new SurfaceNode(this.archive, ne, rl, this, this.bound.createNorthEastQuad());
    }
    if (sw !== -1) {
      children[2] = new SurfaceNode(this.archive, sw, rl, this, this.bound.createSouthWestQuad());
    }
    if (se !== -1) {
      children[3] = new SurfaceNode(this.archive, se, rl, this, this.bound.createSouthEastQuad());
    }
    return children;
  }

  /**
   * Check if node contains GeoPoint
   * @param geoPoint
   */
  public contains(geoPoint: GeoPoint): boolean {
    return this.bound.contains(geoPoint);
  }

  /**
   * Try to find children SurfaceNode by GeoPoint
   * @param geoPoint
   */
  public findChildByGeoPoint(geoPoint: GeoPoint): SurfaceNodeChild {
    for (const childNode of this.children) {
      if (childNode !== undefined && childNode.contains(geoPoint)) {
        return childNode;
      }
    }
  }

  /**
   *
   * @param geoPoint
   * @param maxResolutionLevel
   */
  public findByGeoPointRecursively(geoPoint: GeoPoint, maxResolutionLevel?: number): SurfaceNodeChild {
    if ((maxResolutionLevel !== undefined && this.resolutionLevel > maxResolutionLevel) || !this.contains(geoPoint)) {
      return undefined;
    }
    if (this.resolutionLevel === maxResolutionLevel) {
      return this;
    }
    for (const childNode of this.children) {
      if (childNode !== undefined) {
        const found = childNode.findByGeoPointRecursively(geoPoint, maxResolutionLevel);
        if (found !== undefined) {
          return found;
        }
      }
    }
  }

  /**
   * Read from archive and returns decompressed TreeNode data as content of .dds file
   * @private
   */
  public getData(): Buffer {
    return this.archive.readTreeNodeDecompressedData(this.origin);
  }
}
