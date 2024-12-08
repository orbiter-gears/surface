import SurfaceNode from './surface-node';
import Archive from './archive';
import GeoBound from './geo-bound';

/**
 * Each list item is tree roots
 */
export default class Surface extends Array<SurfaceNode> {

  /**
   *
   * @param archive Surface archive
   */
  constructor(archive: Archive) {
    super(archive.header.roots.length);
    for (const [treeRootsIndex, treeNodeIndex] of archive.header.roots.entries()) {
      let node;
      switch (treeRootsIndex) {
        case 0:
        case 1:
        case 2:
          node = new SurfaceNode(archive, treeNodeIndex, treeRootsIndex + 1, undefined, GeoBound.createGlobal());
          break;
        case 3:
          node = new SurfaceNode(archive, treeNodeIndex, 4, undefined, GeoBound.createWestHemisphere());
          break;
        case 4:
          node = new SurfaceNode(archive, treeNodeIndex, 4, undefined, GeoBound.createEastHemisphere());
          break;
      }
      this[treeRootsIndex] = node;
    }
  }
}
