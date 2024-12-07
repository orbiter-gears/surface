
/**
 * Surface archive meta information from file header
 */
type Header = {
  /**
   * file ID and version (‘T’, ‘X’, 1, 0)
   * @example
   * "TX10"
   */
  readonly magic: string;
  /**
   * Header size in bytes
   * @example
   * 48
   */
  readonly size: number;
  /**
   * Bit flags (currently ignored)
   * @example
   * 1
   */
  readonly flags: number;
  /**
   * Data block information
   */
  readonly data: {
    /**
     * Data block offset in file
     */
    readonly offset: number;
    /**
     * Total length of compressed data block
     */
    readonly length: bigint;
  };
  /**
   * Total number of tree nodes
   */
  readonly nodes: number;
  /**
   * Root nodes pointers
   */
  readonly roots: number[];
};

export default Header;
