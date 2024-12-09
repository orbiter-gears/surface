import { Gp, GpLon, GpLat } from './unit';

/**
 * Geo bounding box
 * Operates geo-points that is in range from 0W to 360E
 * and from 0N to 180S
 */
export default class GeoBound {

  /**
   * Creates and returns global bound
   */
  public static createGlobal(): GeoBound {
    return new this(0, 360, 0, 180);
  }

  /**
   * Create and returns west hemisphere bound
   */
  public static createWestHemisphere(): GeoBound {
    return new this(0, 180, 0, 180);
  }

  /**
   * Create and returns east hemisphere bound
   */
  public static createEastHemisphere(): GeoBound {
    return new this(180, 360, 0, 180);
  }

  /**
   * Degree in range from 0W to 360E
   */
  public readonly west: GpLon;

  /**
   * Degree in range from 0W to 360E
   */
  public readonly east: GpLon;

  /**
   * Degree in range from 0N to 180S
   */
  public readonly north: GpLat;

  /**
   * Degree in range from 0N to 180S
   */
  public readonly south: GpLat;

  /**
   * SurfaceNode's tile width
   */
  public readonly width: GpLon;

  /**
   * SurfaceNode's tile half width
   */
  public readonly halfWidth: GpLon;

  /**
   * SurfaceNode's tile height
   */
  public readonly height: GpLat;

  /**
   * SurfaceNode's tile half height
   */
  public readonly halfHeight: GpLat;

  /**
   *
   * @param west
   * @param east
   * @param north
   * @param south
   */
  constructor(west: GpLon, east: GpLon, north: GpLat, south: GpLat) {
    this.west = west;
    this.east = east;
    this.north = north;
    this.south = south;
    this.width = east - west;
    this.halfWidth = this.width / 2;
    this.height = south - north;
    this.halfHeight = this.height / 2;
  }

  /**
   * Create and returns north-west sub-quad bound
   */
  public createNorthWestQuad(): GeoBound {
    return new GeoBound(
      this.west, this.west + this.width,
      this.north, this.north + this.height);
  }

  /**
   * Create and returns north-east sub-quad bound
   */
  public createNorthEastQuad(): GeoBound {
    return new GeoBound(
      this.west + this.width, this.east,
      this.north, this.north + this.height);
  }

  /**
   * Create and returns south-west sub-quad bound
   */
  public createSouthWestQuad(): GeoBound {
    return new GeoBound(
      this.west, this.west + this.width,
      this.north + this.height, this.south);
  }

  /**
   * Create and returns south-east sub-quad bound
   */
  public createSouthEastQuad(): GeoBound {
    return new GeoBound(
      this.west + ((this.east - this.west) / 2), this.east,
      this.north + ((this.south - this.north) / 2), this.south);
  }

  /**
   * Creates and returns GeoPoint points to center of the bound
   */
  public createCenterGp(): Gp {
    return [this.west + this.halfWidth, this.north + this.halfHeight];
  }

  /**
   * Creates and returns GeoPoint points to center of western sibling node
   */
  public createWestSiblingCenterGp(): Gp {
    return [this.west - this.halfWidth, this.north + this.halfWidth];
  }

  /**
   * Creates and returns GeoPoint points to center of eastern sibling node
   */
  public createEastSiblingCenterGp(): Gp {
    return [this.east + this.halfWidth, this.north + this.halfHeight];
  }

  /**
   * Creates and returns GeoPoint points to center of southern sibling node
   */
  public createNorthSiblingCenterGp(): Gp {
    return [this.west + this.halfWidth, this.north - this.halfHeight];
  }

  /**
   * Creates and returns GeoPoint points to center of northern sibling node
   */
  public createSouthSiblingCenterGp(): Gp {
    return [this.west + this.halfWidth, this.south + this.halfHeight];
  }

  /**
   * Check if bound contains GeoPoint
   */
  public contains([lon, lat]: Gp): boolean {
    return lon >= this.west && this.east > lon
      && lat >= this.north && this.south > lat;
  }
}
