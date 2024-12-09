import SurfaceNode from './surface-node';
import Archive from './archive';
import GeoBound from './geo-bound';
import { Gp } from './unit';

/**
 * Each list item is tree roots
 */
export default class Surface {

  /**
   * Reference to Archive
   */
  public readonly archive: Archive;

  /**
   * Node contains small global tail 64x64 pixels
   */
  public readonly glob64: SurfaceNode;

  /**
   * Node contains mid global tail 128x128 pixels
   */
  public readonly glob128: SurfaceNode;

  /**
   * Node contains big global tail 256x256 pixels
   */
  public readonly glob256: SurfaceNode;

  /**
   * Node contains west hemisphere tail 512x512 pixels
   */
  public readonly westHemisphere: SurfaceNode;

  /**
   * Node contains east hemisphere tail 512x512 pixels
   */
  public readonly eastHemisphere: SurfaceNode;

  /**
   *
   * @param archive Surface archive
   */
  constructor(archive: Archive) {
    this.archive = archive;

    // phase: build trees
    for (const [index, ref] of this.archive.header.roots.entries()) {
      switch (index) {
        case 0:
          this.glob64 = new SurfaceNode(this, ref, index + 1, undefined, GeoBound.createGlobal(), 64);
          break;
        case 1:
          this.glob128 = new SurfaceNode(this, ref, index + 1, undefined, GeoBound.createGlobal(), 128);
          break;
        case 2:
          this.glob256 = new SurfaceNode(this, ref, index + 1, undefined, GeoBound.createGlobal(), 256);
          break;
        case 3:
          this.westHemisphere = new SurfaceNode(this, ref, 4, undefined, GeoBound.createWestHemisphere(), 512);
          break;
        case 4:
          this.eastHemisphere = new SurfaceNode(this, ref, 4, undefined, GeoBound.createEastHemisphere(), 512);
          break;
        default:
          throw new Error(`${this.constructor.name}: Unexpected archive root at ${index} (ref=${ref})`);
      }
    }

    // phase: define siblings
    SurfaceNode.defineSiblingsRecursively(this.westHemisphere, this.eastHemisphere);
  }

  /**
   * Try to find SurfaceNode by geoPoint with limit on resolutionLevel
   * @param gp
   * @param maxResolutionLevel Limit resolution level (no limit if undefined)
   */
  public findByGeoPoint(gp: Gp, maxResolutionLevel?: number): SurfaceNode | undefined {
    if (maxResolutionLevel !== undefined && 3 > maxResolutionLevel) {
      return this.glob256;
    }
    const root = gp[0] >= 180 ? this.eastHemisphere : this.westHemisphere;
    return root.findByGeoPointRecursively(gp, maxResolutionLevel);
  }
}
