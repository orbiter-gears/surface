import Distance from './distance';
import Coordinate from './coordinate';

/**
 * Point to geo position in ranges:
 * left (longitude) from 0W to 360E
 * top (latitude) from 0N to 180S
 */
export default class GeoPoint {

  /**
   * Creates and returns geo-point from coordinate
   * @param longitude
   * @param latitude
   */
  public static fromCoordinate({ longitude, latitude }: Coordinate): GeoPoint {
    return new this(new Distance(longitude.valueOf() + 180), new Distance(latitude.valueOf() + 90));
  }

  /**
   * Geo horizontal offset (longitude)
   * Range from 0W to 360E degree
   */
  public readonly left: Distance;

  /**
   * Geo vertical offset (latitude)
   * Range from 0N to 180S degree
   */
  public readonly top: Distance;

  /**
   *
   * @param left Geo horizontal offset (longitude)
   * @param top Geo vertical offset (latitude)
   */
  constructor(left: Distance, top: Distance) {
    this.left = left;
    this.top = top;
  }

  /**
   * Creates and returns coordinate from this point
   */
  public toCoordinate(): Coordinate {
    return Coordinate.fromGeoPoint(this);
  }

  /**
   * Returns string representation
   */
  public toString(): string {
    return `${this.left.toString()} ${this.top.toString()}`;
  }
}
