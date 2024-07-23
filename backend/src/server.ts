import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
const app=express();
const server=createServer(app);
const io = new Server(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
io.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
        console.log('connection closed');
    })
    socket.on('join room', (joinid: string, callback?: (response: { status: string, message?: string }) => void) => {
        console.log("joined");
        try {
            socket.join(joinid);
            if (typeof callback === 'function') {
              callback({
                status: "ok"
              });
            }
          } catch (error) {
            if (typeof callback === 'function') {
              callback({
                status: "error",
                message: "Error joining room"
              });
            }
          }
    })
    socket.on('create room',()=>{
        socket.join(socket.id);
        console.log(socket.id);    
        socket.emit('room created', socket.id);
    })
    socket.on('make move',(data)=>{
        console.log("move added");
        io.to(data.room).emit("move made",data);
    })
    socket.on('won',(data)=>{
        io.to(data.room).emit('won',data);
    })
    socket.on('restart',(data)=>{
        io.to(data.room).emit('restart',data);
    })

})
server.listen(8080,()=>{
    console.log("server listening on port 8080");
});