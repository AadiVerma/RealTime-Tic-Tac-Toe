"use client";
import GameStart from "@/backend/src/game";
import Image from 'next/image';
import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Tile from "@/components/squareTile";
import { GiTicTacToe } from "react-icons/gi";
import image1 from "@/public/image1.jpg";
import image2 from '@/public/image2.jpg';
import { io, Socket } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";

export default function Home() {
  const [game, setGame] = useState<GameStart | null>(null);
  const [id, setId] = useState<string>("");
  const [alternate, setAlternate] = useState<number>(1);
  const [room, setRoom] = useState("");
  const [Key, setKey] = useState("");
  const [allow, setAllow] = useState(false);
  const [count, setCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [moveMade, setMoveMade] = useState(0);
  const [joined,setjoined]=useState(false);
  const [canmove,setcanmove]=useState(false);
  interface JoinRoomResponse {
    status: string;
    message?: string;
  }
  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);
    initializeGame();
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMoveMade = (data: any) => {
      if (data.id !== id && game) {
        game.setGame(id, data.row, data.col, data.alternate);
        setMoveMade(prev => prev + 1);
        setcanmove(true);
        setAlternate(data.alternate === 1 ? 2 : 1);
        setCount(prev => prev + 1);
        console.log(game.GetGame(id));
      }
    };

    const handleWon = (data: any) => {
      if (game) {
        const mess = data.winner === "Draw" ? "Draw" : data.winner;
        toast(mess, {
          icon: `${mess === "Draw" ? "🤝" : "🎉"}`,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    };

    socket.on('move made', handleMoveMade);
    socket.on('won', handleWon);
    socket.on('restart',initializeGame);
    return () => {
      socket.off('move made', handleMoveMade);
      socket.off('won', handleWon);
    };
  }, [socket, id, game]);

  const initializeGame = useCallback(() => {
    const newid = uuidv4();
    setId(newid);
    setGame(new GameStart(newid));
    setAllow(false);
    setAlternate(1);
    setCount(0);
  }, []);

  const handleRestart = () => {
    socket?.emit('restart',{room});
    initializeGame();
  };

  const handleCreate = () => {
    if (socket) {
      socket.emit('create room');
      socket.once('room created', (roomid: string) => {
        setRoom(roomid);
        setcanmove(true);
      });
      socket.on('room created',(data)=>{
        setKey(data);
      })
    }
  };

  const handleJoin = () => {
    if (socket && room && !joined) {
      socket.emit('join room', room, (response: JoinRoomResponse) => {
        if (response.status === "ok") {
          setjoined(true);
          setcanmove(true);
          toast("You Successfully Joined The Room", {
            icon: "🎯",
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        } else {
          toast.error(response.message || "Failed to join the room", {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }
      });
    }
  };
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(Key).then(() => {
      toast("Copied to clipboard!", {
        icon:"✅",
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    });
  };

  const handleMove = (row: number, col: number) => {
    if (!game || !socket) return;
    const moveData = {
      id,
      row,
      col,
      alternate,
      room
    };
    socket.emit('make move', moveData);
  };

  return (
    <div className="flex justify-center place-items-center place-content-center mt-20 gap-20">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="border-2 rounded-lg border-[#121212] p-3">
        <div className="flex gap-4 border-2 justify-center p-4 rounded-lg border-[#121212]">
          <div>
            <Image className="rounded-xl" src={image1} alt="Image1" width={150} height={150} />
            <h1 className="flex justify-center text-xl text-[#3b6ded] mt-2">XMaster</h1>
            <div className={`${alternate === 1 ? "bg-green-700" : "bg-gray-600"} h-1 w-1 border-2 rounded-full border-[#121212] p-2 flex justify-center ml-[40%]`}></div>
          </div>
          <div>
            <Image className="rounded-xl" src={image2} alt="Image2" width={150} height={150} />
            <h1 className="flex justify-center text-[#a41c15] text-xl mt-2">OChampion</h1>
            <div className={`${alternate === 1 ? "bg-gray-700" : "bg-green-700"} h-1 w-1 border-2 rounded-full border-[#121212] p-2 flex justify-center ml-[40%]`}></div>
          </div>
        </div>
        <div className="p-2 border-2 rounded-lg border-[#121212] mt-4">
          <input type="text" className="border-2 rounded-lg border-[#121212] bg-transparent text-lg outline-none p-4 mr-2" placeholder="Join Room" onChange={(e) => setRoom(e.target.value)} />
          <button className="text-xl font-bold bg-blue-400 hover:bg-blue-500 cursor-pointer rounded-lg p-3 pl-5 pr-5" onClick={handleJoin}>Join</button>
        </div>
        <button className="text-xl font-bold bg-blue-400 hover:bg-blue-500 cursor-pointer rounded-lg p-3 pl-5 pr-5 w-[100%] mt-4" onClick={handleCreate}>Create Room</button>
        {Key && <div className="flex justify-center mt-4">
          <h1 className="border-2 rounded-lg border-[#121212] bg-transparent text-lg outline-none p-4 mr-2 w-[80%] ">{Key}</h1>
          <IoCopyOutline className="border-2 text-white  bg-transparent  cursor-pointer rounded-lg text-4xl w-[10%] border-[#121212] pt-1 pb-1 mt-1" onClick={handleCopyToClipboard}/>
          </div>}
        <div className="flex justify-center mt-4 w-full bg-blue-400 hover:bg-blue-500 cursor-pointer rounded-lg p-2 gap-4 " onClick={handleRestart}>
          <button className="text-xl font-bold">New Game</button>
          <GiTicTacToe className="text-3xl font-bold" />
        </div>
      </div>
      <div className={`bg-black grid grid-cols-3 gap-4 place-items-center w-[40%] border-2 p-4 rounded-lg border-[#121212] ${!canmove && "pointer-events-none"} ${allow && "pointer-events-none" }` }>
        {Array.from({ length: 3 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <Tile
              key={`${row}-${col}-${id}-${moveMade}`}
              row={row}
              col={col}
              game={game}
              id={id}
              setalternate={setAlternate}
              alternate={alternate}
              setallow={setAllow}
              setcount={setCount}
              count={count}
              handleMove={handleMove}
              socket={socket}
              room={room}
              setcanmove={setcanmove}
            />
          ))
        )}
      </div>
    </div>
  );
}
