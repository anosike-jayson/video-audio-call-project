import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

interface AuthSocket extends Socket {
  user?: { id: string };
}

const initializeSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: { origin: "*" }, 
  });

  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error: No token"));

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET missing");

      const decoded = jwt.verify(token, secret) as { id: string };
      socket.user = { id: decoded.id };
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log(`User connected: ${socket.user?.id}`);

    socket.on("join-call", (callId: string) => {
      socket.join(callId);
      socket.to(callId).emit("user-joined", socket.user?.id);
      console.log(`${socket.user?.id} joined call ${callId}`);
    });

    socket.on("signal", (data: { callId: string; signal: any }) => {
      socket.to(data.callId).emit("signal", {
        signal: data.signal,
        userId: socket.user?.id,
      });
    });

    socket.on("leave-call", (callId: string) => {
      socket.to(callId).emit("user-left", socket.user?.id);
      socket.leave(callId);
      console.log(`${socket.user?.id} left call ${callId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user?.id}`);
    });
  });

  return io;
};

export default initializeSocket;