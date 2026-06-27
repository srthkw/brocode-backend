import Message from "../models/Message.js";
import DMMessage from "../models/DMMessage.js";

const onlineUsers = new Map();

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_dm", (conversationId) => {   
        socket.join(conversationId);
      }
    );

    socket.on("send_dm", async (data) => {    
        try {    
          const savedMessage =
            await DMMessage.create({
              sender:
                data.sender,
    
              receiver:
                data.receiver,
    
              message:
                data.message,
            });
    
          io.to(data.conversationId).emit("receive_dm", savedMessage);
    
        } catch (error) {    
          console.log(error);    
        }
      }
    );
    
    socket.on("join_room", (room) => {

      const oldRoom = socket.data.room;

      if (oldRoom) {
        socket.leave(oldRoom);
      }

      socket.join(room);

      socket.data.room = room;

      const user = onlineUsers.get(socket.id);

      if (user) {
        user.room = room;
        onlineUsers.set(socket.id, user);
      }

      if (oldRoom) {
        const oldRoomUsers = Array.from(
          onlineUsers.values()
        )
          .filter((user) => user.room === oldRoom)
          .map((user) => user.username);
      
        io.to(oldRoom).emit(
          "online_users",
          oldRoomUsers
        );
      }

      const roomUsers = Array.from(
        onlineUsers.values()
      )
        .filter((user) => user.room === room)
        .map((user) => user.username);

      io.to(room).emit(
        "online_users",
        roomUsers
      );

      console.log(`${socket.id} joined ${room}`);
    });

    // User joins
    socket.on("join_chat", (username) => {
      if (!username?.trim()) return;

      onlineUsers.set(socket.id, {username, room: "General",});

      const roomUsers = Array.from(onlineUsers.values())
        .filter((user) => user.room === "General")
        .map((user) => user.username);

      io.to("General").emit("online_users", roomUsers );

      io.emit("user_joined", `${username} is online`);
    });

    socket.on("typing", ({ username, room }) => {
      socket.to(room).emit("user_typing", username);
    });

    socket.on("stop_typing", (data) => {
      socket.to(data.room).emit("user_stop_typing");
    });

    socket.on("send_message", async (data) => {
      try {
        const savedMessage = await Message.create(data);

        io.to(data.room).emit("receive_message", savedMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);

      const username = user?.username;
      const room = user?.room;

      if (username) {
        onlineUsers.delete(socket.id);

        const roomUsers = Array.from(onlineUsers.values())
          .filter((user) => user.room === room)
          .map((user) => user.username);

        io.to(room).emit("online_users", roomUsers);

        io.emit("user_left", `${username} left`);
      }

      console.log("User disconnected");
    });
  });
};

export default chatSocket;