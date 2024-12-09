export type Degree = number;
export type Meters = number;

/**
 * Traditional longitude degree value in range from -180W to 180E
 */
export type CpLon = Degree;
/**
 * Traditional latitude degree value in range from 90N to -90S
 */
export type CpLat = Degree;
/**
 * Coordinate Point
 * Traditional coordinate -180W:180E/90N:-90S
 */
export type Cp = [CpLon, CpLat];

/**
 * Geo Point Left
 * Inner longitude degree value in range from 0W to 360E
 */
export type GpLon = Degree;
/**
 * Geo Point Top
 * Inner latitude degree value in range from 0N to 180S
 */
export type GpLat = Degree;
/**
 * Geo Point
 * Inner coordinate 0W:360E/0N:180S
 */
export type Gp = [GpLon, GpLat];

export default class Unit {
  public static convCpLon2GpLon(value: CpLon): GpLon {
    return value + 180;
  }

  public static convCpLat2GpLat(value: CpLat): GpLat {
    //  90  50  10  0 -10 -50 -90
    // -90 -50 -10  0  10  50  90
    //   0  40  80 90 100 140 180
    return -value + 90;
  }

  public static convGpLon2CpLon(value: GpLon): CpLon {
    return value - 180;
  }

  public static convGpLat2CpLat(value: GpLat): CpLat {
    //   0  10  50  90  100  140  180
    // -90 -80 -40   0   10   50   90
    //  90  80  40   0  -10  -50  -90
    return -(value - 90);
  }

  public static convCp2Gp([lon, lat]: Cp): Gp {
    return [this.convCpLon2GpLon(lon), this.convCpLat2GpLat(lat)];
  }

  public static convGp2Cp([lon, lat]: Gp): Cp {
    return [this.convGpLon2CpLon(lon), this.convGpLat2CpLat(lat)];
  }

  public static stringifyDegree(value: Degree, fraction: number = 5, suffix: string = '°'): string {
    return `${value.toFixed(fraction)}${suffix}`;
  }

  public static stringifyCpLon(value: CpLon, fraction?: number, suffix: string = 'WE'): string {
    return `${this.stringifyDegree(value)}${suffix[value > 0 ? 1 : 0]}`;
  }

  public static stringifyCpLat(value: CpLat, fraction?: number, suffix: string = 'NS'): string {
    return `${this.stringifyDegree(value)}${suffix[value > 0 ? 0 : 1]}`;
  }

  public static stringifyCp([lon, lat]: Cp, fraction?: number): string {
    return `${this.stringifyCpLon(lon, fraction)} ${this.stringifyCpLat(lat, fraction)}`;
  }

  public static stringifyGpLon(value: GpLon, fraction?: number): string {
    return this.stringifyDegree(value, fraction);
  }

  public static stringifyGpLat(value: GpLat, fraction?: number): string {
    return this.stringifyDegree(value, fraction);
  }

  public static stringifyGp([lon, lat]: Gp, fraction?: number): string {
    return `${this.stringifyGpLon(lon, fraction)} ${this.stringifyGpLat(lat, fraction)}`;
  }
}
