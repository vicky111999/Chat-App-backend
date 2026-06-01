import Message from "../models/messages.js";

export const sockethandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`socket connected ${socket.id}`);

    socket.on("joinroom", ({ userid, targetid }) => {
      const roomid = [userid, targetid].sort().join("_");
      [...socket.rooms].forEach((room) => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });
      socket.join(roomid);
      socket.currentRoom = roomid
    });

    socket.on("chatmessage", async ({ receiverid, senderid, msg }) => {
      const savedmessage = await Message.create({
        senderId: senderid,
        receiverId: receiverid,
        message: msg,
      });

      const roomid = [senderid, receiverid].sort().join("_");
      io.to(roomid).emit("newmsg", savedmessage);
    });

    socket.on("typing",({senderid,receiverid})=>{
      io.to(receiverid).emit("usertyping",senderid)
    })
    socket.on("stoptyping",({receiverid})=>{
      io.to(receiverid).emit("userstoptyping")
    })
    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
  });
};
