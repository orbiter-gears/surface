import Distance from './distance';
import { DegreeLength } from './consts';

/**
 * Class to operate degree values
 */
export default class Degree {

  /**
   * Creates and returns instance of Degree from value in meters
   * @param value
   */
  public static fromDistanceValue(value: number): Degree {
    return new this(value / DegreeLength.Earth);
  }

  /**
   * Creates and returns instance of Degree from Distance object
   * @param distance
   */
  public static fromDistance(distance: Distance): Degree {
    return this.fromDistanceValue(distance.valueOf())
  }

  /**
   * Half of value
   */
  public get half(): Degree {
    if (this._half === undefined) {
      this._half = new Degree(this.value / 2);
    }
    return this._half;
  }

  /**
   * Value as number
   */
  private readonly value: number;

  /**
   * Cache for half of the value
   * @private
   */
  private _half: Degree | undefined = undefined;

  /**
   *
   * @param value Degree value
   */
  constructor(value: number) {
    this.value = value;
  }

  /**
   * Returns degree value as number
   */
  public valueOf(): number {
    return this.value;
  }

  /**
   * Creates and returns instance of Distance contains same distance in meters
   */
  public toDistance(): Distance {
    return Distance.fromDegreeValue(this.value);
  }

  /**
   * Returns degree string representation
   * @param fraction
   * @param suffix
   */
  public toString(fraction: number = 5, suffix: string = '°'): string {
    return `${this.value.toFixed(fraction)}${suffix}`;
  }
}
