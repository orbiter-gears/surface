import Degree from './degree';
import GeoPoint from './geo-point';

/**
 * Coordinate in traditional range:
 * - Longitude from -180W to 180E
 * - Latitude from 90N to -90S
 */
export default class Coordinate {

  /**
   * Create and return coordinate from geo point
   */
  public static fromGeoPoint({ left, top }: GeoPoint): Coordinate {
    const longitude = new Degree(left.valueOf() - 180);
    const latitude = new Degree(-(top.valueOf() - 90));
    return new this(longitude, latitude);
  }

  /**
   * Longitude degree in range from -180W to 180E
   */
  public readonly longitude: Degree;

  /**
   * Latitude in degree range from 90N to -90S
   */
  public readonly latitude: Degree;

  /**
   *
   * @param longitude Longitude degree in range from -180W to 180E
   * @param latitude Latitude in degree range from 90N to -90S
   */
  constructor(longitude: Degree, latitude: Degree) {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  /**
   * Create and returns GeoPoint of this coordinate
   */
  public toGeoPoint(): GeoPoint {
    return GeoPoint.fromCoordinate(this);
  }

  /**
   * Returns coordinate string representation
   * @param {number} fraction Decimal places
   * @param {string} D Degree symbol
   * @param {string} W West side symbol
   * @param {string} E East side symbol
   * @param {string} N North side symbol
   * @param {string} S South side symbol
   */
  public toString(fraction: number = 5, [W, E, N, S]: string = 'WENS'): string {
    const lonSymbol = this.longitude.valueOf() > 0 ? E : W;
    const latSymbol = this.latitude.valueOf() > 0 ? N : S;
    const lon = `${this.longitude.toString(fraction)}${lonSymbol}`;
    const lat = `${this.latitude.toString(fraction)}${latSymbol}`
    return `${lon} ${lat}`;
  }
}
