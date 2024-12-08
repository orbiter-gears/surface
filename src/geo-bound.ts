import Distance from './distance';
import Degree from './degree';
import GeoPoint from './geo-point';

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
    return new this(new Degree(0), new Degree(360), new Degree(0), new Degree(180));
  }

  /**
   * Create and returns west hemisphere bound
   */
  public static createWestHemisphere(): GeoBound {
    return new this(new Degree(0), new Degree(180), new Degree(0), new Degree(180));
  }

  /**
   * Create and returns east hemisphere bound
   */
  public static createEastHemisphere(): GeoBound {
    return new this(new Degree(180), new Degree(360), new Degree(0), new Degree(180));
  }

  /**
   * Degree in range from 0W to 360E
   */
  public readonly west: Degree;

  /**
   * Degree in range from 0W to 360E
   */
  public readonly east: Degree;

  /**
   * Degree in range from 0N to 180S
   */
  public readonly north: Degree;

  /**
   * Degree in range from 0N to 180S
   */
  public readonly south: Degree;

  /**
   * SurfaceNode's tile width
   */
  public readonly width: Degree;

  /**
   * SurfaceNode's tile height
   */
  public readonly height: Degree;

  /**
   *
   * @param {number} west Degree in range from 0W to 360E
   * @param {number} east Degree in range from 0W to 360E
   * @param {number} north Degree in range from 0N to 180S
   * @param {number} south Degree in range from 0N to 180S
   */
  constructor(west: Degree, east: Degree, north: Degree, south: Degree) {
    this.west = west;
    this.east = east;
    this.north = north;
    this.south = south;
    this.width = new Degree(east.valueOf() - west.valueOf());
    this.height = new Degree(south.valueOf() - north.valueOf());
  }

  /**
   * Create and returns north-west sub-quad bound
   */
  public createNorthWestQuad(): GeoBound {
    return new GeoBound(
      this.west,
      new Degree(this.west.valueOf() + this.width.half.valueOf()),
      this.north,
      new Degree(this.north.valueOf() + this.height.half.valueOf()));
  }

  /**
   * Create and returns north-east sub-quad bound
   */
  public createNorthEastQuad(): GeoBound {
    return new GeoBound(
      new Degree(this.west.valueOf() + this.width.half.valueOf()),
      this.east,
      this.north,
      new Degree(this.north.valueOf() + this.height.half.valueOf()));
  }

  /**
   * Create and returns south-west sub-quad bound
   */
  public createSouthWestQuad(): GeoBound {
    return new GeoBound(
      this.west,
      new Degree(this.west.valueOf() + this.width.half.valueOf()),
      new Degree(this.north.valueOf() + this.height.half.valueOf()),
      this.south);
  }

  /**
   * Create and returns south-east sub-quad bound
   */
  public createSouthEastQuad(): GeoBound {
    return new GeoBound(
      new Degree(this.west.valueOf() + ((this.east.valueOf() - this.west.valueOf()) / 2)),
      this.east,
      new Degree(this.north.valueOf() + ((this.south.valueOf() - this.north.valueOf()) / 2)),
      this.south);
  }

  /**
   * Check if bound contains GeoPoint
   * @param left
   * @param top
   */
  public contains({ left, top }: GeoPoint): boolean {
    return left.valueOf() >= this.west.valueOf()
      && this.east.valueOf() > left.valueOf()
      && top.valueOf() >= this.north.valueOf()
      && this.south.valueOf() > top.valueOf();
  }
}
