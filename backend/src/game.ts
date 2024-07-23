import Game from "./gamelogic";
const hm: Map<String, Game> = new Map();
class GameStart {
  constructor (id: string) {
    let game: Game = new Game();
    hm.set(id, game);
  }
  public GetGame(id: string) {
    if (hm.has(id)) {
      return hm.get(id)?.fullboard();
    } else return null;
  }
  public Board(row:number,col:number,id:string){
    if (hm.has(id)) {
      let game = hm.get(id);
      return game?.getBoard(row,col);
    } else return null;
  }
  public setGame(id:string,row: number, col: number,no:number){
    if (hm.has(id)) {
        let game = hm.get(id);
        game?.setValue(row,col,no);
        if(this.CheckGame(id,row,col,no)){
            return true;
        }
      } else return false;
  }
  public CheckGame(id: string, row: number, col: number,no:number) {
    if (hm.has(id)) {
      let game = hm.get(id);
      return game?.Check(no, row, col);
    } else return false;
  }
  public Restart(id:string){
    if(hm.has(id)){
      let game=hm.get(id);
      game?.resetBoard();
    } else console.log("No such game");
  }
  public EndGame(id:string){
    if(hm.has(id)){
      hm.delete(id);
    } else console.log("No such game");
  }
}

export default GameStart;