
/**
 *
 */
type TreeNode = {
  /**
   * The node’s data position in the file
   */
  readonly position: bigint;
  /**
   * Additional property contains compressed data length
   */
  readonly length: number;
  /**
   * The node’s decompressed data size in bytes
   */
  readonly size: number;
  /**
   * Array index positions of the children
   */
  readonly children: Readonly<(number | undefined)[]>;
  /**
   * Reserved, may contain garbage data
   */
  readonly reserved: number;
};

export default TreeNode;
