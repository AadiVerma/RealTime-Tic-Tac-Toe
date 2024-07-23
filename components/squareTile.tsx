"use client";
import { RxCross1 } from "react-icons/rx";
import GameStart from "@/backend/src/game";
import { FaRegCircle } from "react-icons/fa";
import { Dispatch, useState, SetStateAction, useEffect } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

interface TileProps {
  row: number;
  col: number;
  game: GameStart | null;
  setalternate: Dispatch<SetStateAction<number>>;
  setcount: Dispatch<SetStateAction<number>>;
  setallow: Dispatch<SetStateAction<boolean>>;
  alternate: number;
  id: string;
  count: number
  handleMove: (row: number, col: number) => void;
  socket: Socket | null;
  room:string;
  setcanmove:Dispatch<SetStateAction<boolean>>;
}

export default function Tile({ row, col, game, setalternate, alternate, id, setallow, setcount, count,handleMove,socket,room,setcanmove}: TileProps) {
  const [clicked, setClicked] = useState(false);
  const [Icon, setIcon] = useState<string | null>(null);
  const [Clicked1,setClicked1]=useState(false);
  useEffect(() => {
    if (game && game.Board(row,col,id) !== 0) {
      setClicked1(true);
      setIcon(game.Board(row,col,id) === 1 ? "RxCross1" : "FaRegCircle");
    }
  }, [game,row,col,id]);
  function clickHandler() {
    if (!game || clicked) return;
    setClicked(true);
    setcanmove(false);
    setcount((prev) => prev + 1);
    const ans = game.setGame(id, row, col, alternate);
    handleMove(row,col);
    if (ans) {
      setallow(true);
      setcanmove(false);
      toast(`${alternate == 1 ? "XMaster Won" : "OChampion Won"}`,
        {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      setcount(0);
      const winner=(alternate == 1) ? "XMaster Won" : "OChampion Won";
      socket?.emit("won",{winner,room});
    }
    else if (count == 8) {
      setallow(true);
      setcanmove(false);
      toast("Draw",
        {
          icon: '🤝',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      setcount(0);
      const winner="Draw";
      socket?.emit("won",{winner,room});
    }
    setIcon(alternate === 1 ? "RxCross1" : "FaRegCircle");
    setalternate(alternate === 1 ? 2 : 1);
  }

  return (
    <div
      className="h-40 w-full bg-[#121212] rounded-lg border-[#121212] flex justify-center place-content-center place-items-center cursor-pointer"
      onClick={clickHandler}
    >
      {((clicked || Clicked1) && (Icon!= null)) && (
        <div className="bg-black p-7 rounded-lg">
          {Icon == "RxCross1" ? <RxCross1 className={`text-[#0746e6] text-8xl font-extrabold`} /> :
            <FaRegCircle className="text-[#700d08] text-8xl font-extrabold" />}
        </div>
      )}
    </div>
  );
}
