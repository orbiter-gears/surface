import Degree from './degree';
import { DegreeLength } from './consts';

/**
 * Class to keep distance in meters
 */
export default class Distance {

  /**
   * Creates and returns instance of Distance from length
   * @param value Degree value as number
   */
  public static fromDegreeValue(value: number): Distance {
    return new this(value / DegreeLength.Earth);
  }

  /**
   * Creates and returns instance of Distance from Degree object
   * @param degree
   */
  public static fromDegree(degree: Degree): Distance {
    return this.fromDegreeValue(degree.valueOf());
  }

  /**
   * Half of value
   */
  public get half(): Distance {
    if (this._half === undefined) {
      this._half = new Distance(this.value / 2);
    }
    return this._half;
  }

  /**
   * Distance value in degree
   */
  private readonly value: number;

  /**
   * Cache for half of the value
   * @private
   */
  private _half: Distance | undefined = undefined;

  /**
   *
   * @param value Initial value in meters
   */
  constructor(value: number) {
    this.value = value;
  }

  /**
   * Returns distance value as number
   */
  public valueOf(): number {
    return this.value;
  }

  /**
   * Create and returns Degree object contains same distance in degree
   */
  public toDegree(): Degree {
    return Degree.fromDistanceValue(this.value);
  }

  /**
   * Returns distance string representation
   * @param fraction
   * @param suffix
   */
  public toString(fraction: number = 1, suffix = 'm'): string {
    return `${this.value.toFixed(fraction)}${suffix}`;
  }
}
