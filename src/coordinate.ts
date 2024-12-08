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
    return new this(left - 180, -(top - 90));
  }

  /**
   * Longitude degree in range from -180W to 180E
   */
  public readonly longitude: number;

  /**
   * Latitude in degree range from 90N to -90S
   */
  public readonly latitude: number;

  /**
   *
   * @param longitude Longitude degree in range from -180W to 180E
   * @param latitude Latitude in degree range from 90N to -90S
   */
  constructor(longitude: number, latitude: number) {
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
  public toString(fraction: number = 5, [D, W, E, N, S]: string = '°WENS'): string {
    const lonSymbol = this.longitude > 0 ? E : W;
    const latSymbol = this.latitude > 0 ? N : S;
    const lon = `${this.longitude.toFixed(fraction)}${D}${lonSymbol}`;
    const lat = `${this.latitude.toFixed(fraction)}${D}${latSymbol}`
    return `${lon} ${lat}`;
  }
}
