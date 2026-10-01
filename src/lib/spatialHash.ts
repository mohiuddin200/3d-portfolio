/**
 * Allocation-free uniform grid for neighbour lookups in a bounded 3D volume.
 *
 * Used by HeroScene every frame, so nothing here allocates after construction:
 * the grid is rebuilt with a counting sort into pre-sized typed arrays and
 * queries write their results into a caller-supplied buffer.
 */
export class SpatialHash {
  private readonly invCell: number;
  private readonly worldMin: number;
  private readonly dim: number;
  private readonly cellStart: Int32Array;
  private readonly cellFill: Int32Array;
  private readonly cellOf: Int32Array;
  private readonly items: Int32Array;

  /**
   * @param cellSize  Edge length of one grid cell. Should equal the largest
   *                  radius you expect to query with, or slightly less.
   * @param worldMin  Lowest coordinate on any axis that a point can have.
   * @param worldMax  Highest coordinate on any axis that a point can have.
   * @param capacity  Maximum number of points inserted per build.
   */
  constructor(cellSize: number, worldMin: number, worldMax: number, capacity: number) {
    this.invCell = 1 / cellSize;
    this.worldMin = worldMin;
    this.dim = Math.max(1, Math.ceil((worldMax - worldMin) * this.invCell));
    const cells = this.dim * this.dim * this.dim;
    this.cellStart = new Int32Array(cells + 1);
    this.cellFill = new Int32Array(cells);
    this.cellOf = new Int32Array(capacity);
    this.items = new Int32Array(capacity);
  }

  private cellCoord(v: number): number {
    const c = Math.floor((v - this.worldMin) * this.invCell);
    return c < 0 ? 0 : c >= this.dim ? this.dim - 1 : c;
  }

  /** Rebuild the grid from an interleaved xyz Float32Array. */
  build(positions: Float32Array, count: number): void {
    const { dim, cellStart, cellFill, cellOf, items } = this;
    const cells = dim * dim * dim;

    cellStart.fill(0);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const cell =
        this.cellCoord(positions[i3]) +
        this.cellCoord(positions[i3 + 1]) * dim +
        this.cellCoord(positions[i3 + 2]) * dim * dim;
      cellOf[i] = cell;
      cellStart[cell + 1]++;
    }
    for (let c = 0; c < cells; c++) {
      cellStart[c + 1] += cellStart[c];
      cellFill[c] = cellStart[c];
    }
    for (let i = 0; i < count; i++) {
      items[cellFill[cellOf[i]]++] = i;
    }
  }

  /**
   * Write the indices of every point whose cell overlaps the query sphere into
   * `out` and return how many were written. Callers still need to check the
   * real distance; this is a broad phase.
   */
  queryRadius(x: number, y: number, z: number, radius: number, out: Int32Array): number {
    const { dim, cellStart, items } = this;
    const minX = this.cellCoord(x - radius);
    const maxX = this.cellCoord(x + radius);
    const minY = this.cellCoord(y - radius);
    const maxY = this.cellCoord(y + radius);
    const minZ = this.cellCoord(z - radius);
    const maxZ = this.cellCoord(z + radius);

    let n = 0;
    for (let cz = minZ; cz <= maxZ; cz++) {
      for (let cy = minY; cy <= maxY; cy++) {
        const rowBase = cy * dim + cz * dim * dim;
        for (let cx = minX; cx <= maxX; cx++) {
          const cell = rowBase + cx;
          const end = cellStart[cell + 1];
          for (let k = cellStart[cell]; k < end && n < out.length; k++) {
            out[n++] = items[k];
          }
        }
      }
    }
    return n;
  }
}
