import TreeNode from './archive/reader/tree-node';
import GeoBound from './geo-bound';
import Surface from './surface';
import { Gp } from './unit';

type SurfaceNodeOpt = SurfaceNode | undefined;

/**
 * Node's siblings reference container
 */
type Siblings = {
  west: SurfaceNodeOpt;
  east: SurfaceNodeOpt,
  north: SurfaceNodeOpt;
  south: SurfaceNodeOpt;
};

/**
 * Node's children list
 */
type Children = [
  SurfaceNodeOpt,
  SurfaceNodeOpt,
  SurfaceNodeOpt,
  SurfaceNodeOpt
];

/**
 * Surface tail node
 */
export default class SurfaceNode {

  /**
   * Start recursive siblings definition phase on root node
   * @param west
   * @param east
   */
  public static defineSiblingsRecursively(west: SurfaceNode, east: SurfaceNode): void {
    west.siblings.east = east;
    east.siblings.west = west;

    west.defineChildrenSiblingsRecursively();
  }

  /**
   * Reference to surface
   */
  public readonly surface: Surface;

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
  public readonly parent: SurfaceNodeOpt;

  /**
   * Tail bounding box
   */
  public readonly bound: GeoBound;

  /**
   * Tail square size in pixels
   */
  public readonly size: number;

  /**
   * Tail children
   */
  public readonly children: Readonly<Children>;

  /**
   * West sibling node with resolution level (if exists)
   */
  public get westSiblingNode(): SurfaceNodeOpt {
    return this.siblings.west;
  }

  /**
   * East sibling node with resolution level (if exists)
   */
  public get eastSiblingNode(): SurfaceNodeOpt {
    return this.siblings.east;
  }

  /**
   * North sibling node with resolution level (if exists)
   */
  public get northSiblingNode(): SurfaceNodeOpt {
    return this.siblings.north;
  }

  /**
   * South sibling node with resolution level (if exists)
   */
  public get southSiblingNode(): SurfaceNodeOpt {
    return this.siblings.south;
  }

  /**
   * Reference to sibling nodes
   * @private
   */
  private readonly siblings: Siblings = {
    west: undefined,
    east: undefined,
    north: undefined,
    south: undefined
  };

  /**
   *
   * @param surface Surface reference
   * @param index Original TreeNode index
   * @param resolutionLevel Resolution level
   * @param parent Parent if exists
   * @param bound Tail surface bound
   * @param size Tail size in pixels
   */
  constructor(surface: Surface, index: number, resolutionLevel: number, parent: SurfaceNodeOpt, bound: GeoBound, size: number) {
    this.surface = surface;
    this.index = index;
    this.origin = surface.archive.nodes[index];
    this.resolutionLevel = resolutionLevel;
    this.parent = parent;
    this.bound = bound;
    this.size = size;
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
      children[0] = new SurfaceNode(this.surface, nw, rl, this, this.bound.createNorthWestQuad(), this.size);
    }
    if (ne !== -1) {
      children[1] = new SurfaceNode(this.surface, ne, rl, this, this.bound.createNorthEastQuad(), this.size);
    }
    if (sw !== -1) {
      children[2] = new SurfaceNode(this.surface, sw, rl, this, this.bound.createSouthWestQuad(), this.size);
    }
    if (se !== -1) {
      children[3] = new SurfaceNode(this.surface, se, rl, this, this.bound.createSouthEastQuad(), this.size);
    }
    return children;
  }

  /**
   * Define siblings for each children and recursively for each one
   * @private
   */
  private defineChildrenSiblingsRecursively(): void {
    const [n0, n1, n2, n3] = this.children;

    // define siblings for n0 (north-west)
    if (n0 !== undefined) {
      // west sibling
      n0.siblings.west = this.surface.findByGeoPoint(
        n0.bound.createWestSiblingCenterGp(), n0.resolutionLevel);

      // east sibling
      n0.siblings.east = n1;

      // north sibling
      n0.siblings.north = this.surface.findByGeoPoint(
        n0.bound.createNorthSiblingCenterGp(), n0.resolutionLevel);

      // south sibling
      n0.siblings.south = n2;

      // recursive-ness
      n0.defineChildrenSiblingsRecursively();
    }

    // define siblings for n1 (north-east)
    if (n1 !== undefined) {
      // west sibling
      n1.siblings.west = n0;

      // east sibling
      n1.siblings.east = this.surface.findByGeoPoint(
        n1.bound.createEastSiblingCenterGp(), n1.resolutionLevel);

      // north sibling
      n1.siblings.north = this.surface.findByGeoPoint(
        n1.bound.createNorthSiblingCenterGp(), n1.resolutionLevel);

      // south sibling
      n1.siblings.south = n3;

      // recursive-ness
      n1.defineChildrenSiblingsRecursively();
    }

    // define siblings for n2 (south-west)
    if (n2 !== undefined) {
      // west sibling
      n2.siblings.west = this.surface.findByGeoPoint(
        n2.bound.createWestSiblingCenterGp(), n2.resolutionLevel);

      // east sibling
      n2.siblings.east = n3;

      // north sibling
      n2.siblings.north = n0;

      // south sibling
      n2.siblings.south = this.surface.findByGeoPoint(
        n2.bound.createSouthSiblingCenterGp(), n2.resolutionLevel);

      // recursive-ness
      n2.defineChildrenSiblingsRecursively();
    }

    // define siblings for n3 (south-east)
    if (n3 !== undefined) {
      // west sibling
      n3.siblings.west = n0;

      // east sibling
      n3.siblings.east = this.surface.findByGeoPoint(
        n3.bound.createEastSiblingCenterGp(), n3.resolutionLevel);

      // north sibling
      n3.siblings.north = n1;

      // south sibling
      n3.siblings.south = this.surface.findByGeoPoint(
        n3.bound.createSouthSiblingCenterGp(), n3.resolutionLevel);

      // recursive-ness
      n3.defineChildrenSiblingsRecursively();
    }
  }

  /**
   * Try to find children SurfaceNode by GeoPoint and limit by resolution level
   * If specified resolution level limit doesn't reach, undefined will return
   * @param gp
   * @param limitResolutionLevel
   */
  public findByGeoPointRecursively(gp: Gp, limitResolutionLevel?: number): SurfaceNodeOpt {
    // если MaxRL определён и он меньше NodeRL, или узел не содержит gp, то вернуть undefined
    if ((limitResolutionLevel !== undefined && this.resolutionLevel > limitResolutionLevel) || !this.bound.contains(gp)) {
      return undefined;
    }
    if (this.resolutionLevel === limitResolutionLevel) {
      return this;
    }
    for (const childNode of this.children) {
      if (childNode !== undefined) {
        const found = childNode.findByGeoPointRecursively(gp, limitResolutionLevel);
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
    return this.surface.archive.readTreeNodeDecompressedData(this.origin);
  }
}
