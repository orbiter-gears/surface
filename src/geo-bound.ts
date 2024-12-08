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
  public readonly west: number;

  /**
   * Degree in range from 0W to 360E
   */
  public readonly east: number;

  /**
   * Degree in range from 0N to 180S
   */
  public readonly north: number;

  /**
   * Degree in range from 0N to 180S
   */
  public readonly south: number;

  /**
   *
   * @param {number} west Degree in range from 0W to 360E
   * @param {number} east Degree in range from 0W to 360E
   * @param {number} north Degree in range from 0N to 180S
   * @param {number} south Degree in range from 0N to 180S
   */
  constructor(west: number, east: number, north: number, south: number) {
    this.west = west;
    this.east = east;
    this.north = north;
    this.south = south;
  }

  /**
   * Create and returns north-west sub-quad bound
   */
  public createNorthWestQuad(): GeoBound {
    return new GeoBound(
      this.west,
      this.west + ((this.east - this.west) / 2),
      this.north,
      this.north + ((this.south - this.north) / 2));
  }

  /**
   * Create and returns north-east sub-quad bound
   */
  public createNorthEastQuad(): GeoBound {
    return new GeoBound(
      this.west + ((this.east - this.west) / 2),
      this.east,
      this.north,
      this.north + ((this.south - this.north) / 2));
  }

  /**
   * Create and returns south-west sub-quad bound
   */
  public createSouthWestQuad(): GeoBound {
    return new GeoBound(
      this.west,
      this.west + ((this.east - this.west) / 2),
      this.north + ((this.south - this.north) / 2),
      this.south);
  }

  /**
   * Create and returns south-east sub-quad bound
   */
  public createSouthEastQuad(): GeoBound {
    return new GeoBound(
      this.west + ((this.east - this.west) / 2),
      this.east,
      this.north + ((this.south - this.north) / 2),
      this.south);
  }
}
