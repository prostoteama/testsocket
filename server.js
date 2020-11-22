const express = require("express");
const socketIO = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");

class Server {
  constructor() {
    this.app;
    this.httpServer;
    this.io;
    this.DEFAULT_PORT = 5000;
    this.activeSockets = [];
    
    this.initialize();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  initialize() {
    this.app = express();
    if (process.env.NODE_ENV === "production") {
      // Set a static folder
      app.use(express.static("client/build"));
      app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
      );
    }

    this.httpServer = createServer(this.app);
    this.io = socketIO(this.httpServer, {
      cors: {
        origin: "*",
      },
    });
  }

  handleRoutes() {
    this.app.get("/some", (req, res) => {
      res.send({ msg: "This is CORS-enabled for all origins!" });
    });
  }

  handleSocketConnection() {
    this.io.on("connection", (socket) => {
      console.log('connected', socket.id )
      const existingSocket = this.activeSockets.find(
        (existingSocket) => existingSocket === socket.id
      );

      if (!existingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            (existingSocket) => existingSocket !== socket.id
          ),
        });

        socket.broadcast.emit("update-user-list", {
          users: [socket.id],
        });
      }

      socket.on("call-user", (data) => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on("make-answer", (data) => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer,
        });
      });

      socket.on("reject-call", (data) => {
        socket.to(data.from).emit("call-rejected", {
          socket: socket.id,
        });
      });

      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
          socketId: socket.id,
        });
      });
    });
  }

  listen(callback) {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}

module.exports = Server;
