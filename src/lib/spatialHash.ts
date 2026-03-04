/**
 * Spatial hash grid for efficient neighbor lookups in 3D space.
 * Used by HeroScene to find nearby particles for connection lines.
 */
export class SpatialHash {
  private cellSize: number;
  private invCellSize: number;
  private cells: Map<string, number[]>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.invCellSize = 1 / cellSize;
    this.cells = new Map();
  }

  clear(): void {
    this.cells.forEach((arr) => (arr.length = 0));
  }

  private key(cx: number, cy: number, cz: number): string {
    return `${cx},${cy},${cz}`;
  }

  insert(index: number, x: number, y: number, z: number): void {
    const cx = Math.floor(x * this.invCellSize);
    const cy = Math.floor(y * this.invCellSize);
    const cz = Math.floor(z * this.invCellSize);
    const k = this.key(cx, cy, cz);
    let bucket = this.cells.get(k);
    if (!bucket) {
      bucket = [];
      this.cells.set(k, bucket);
    }
    bucket.push(index);
  }

  queryRadius(x: number, y: number, z: number, radius: number): number[] {
    const result: number[] = [];
    const minCx = Math.floor((x - radius) * this.invCellSize);
    const maxCx = Math.floor((x + radius) * this.invCellSize);
    const minCy = Math.floor((y - radius) * this.invCellSize);
    const maxCy = Math.floor((y + radius) * this.invCellSize);
    const minCz = Math.floor((z - radius) * this.invCellSize);
    const maxCz = Math.floor((z + radius) * this.invCellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cz = minCz; cz <= maxCz; cz++) {
          const bucket = this.cells.get(this.key(cx, cy, cz));
          if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
              result.push(bucket[i]);
            }
          }
        }
      }
    }

    return result;
  }
}
