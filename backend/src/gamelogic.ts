class Game {
  private matrix: number[][];
  constructor() {
    this.matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
  public setValue(row: number, col: number, value: number): void {
    this.matrix[row][col] = value;
  }
  public getBoard(row:number,col:number){
    return this.matrix[row][col];
  }
  public Check(no: number, row: number, cols: number) {
    let ans = this.matrix[row].every((val) => val === no);
    if (ans) return this.matrix[row];
    ans = this.matrix.every((r) => r[cols] === no);
    if (ans) return true;
    ans = true;
    if (row === cols) {
      ans = this.matrix.every((r, i) => r[i] === no);
      if (ans) return true;
    }
    if (row + cols === this.matrix.length - 1) {
      ans = this.matrix.every((r, i) => r[this.matrix.length - 1 - i] === no);
      if (ans) return true;
    }

    return false;
  }
  public resetBoard() {
    this.matrix = Array.from({ length: this.matrix.length }, () => {
      return Array(this.matrix[0].length).fill(0);
    });
  }
  public fullboard() {
    return this.matrix;
  }
}

export default Game;