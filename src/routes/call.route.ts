import express, { Router, Request, Response } from "express";
import { protect } from "../middleware/auth.middleware";
import { startCall, endCall, getCallHistory, joinCall } from "../services/call.service";
import { Server } from "socket.io";

interface AuthRequest extends Request {
  user?: { id: string };
}

let io: Server;
export const setIo = (socketIo: Server) => {
  io = socketIo;
};

const router: Router = express.Router();

router.post("/start", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const call = await startCall(req.user!.id);
    io.to(call._id).emit("call started", call); 
    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

router.post("/join/:callId", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const call = await joinCall(req.params.callId, req.user!.id);
    io.to(call._id).emit("user-joined", req.user!.id);
    res.json(call);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

router.put("/end/:callId", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const call = await endCall(req.params.callId, new Date());
    io.to(call._id).emit("call ended", call);
    res.json(call);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

router.get("/history", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const calls = await getCallHistory(req.user!.id);
    res.json(calls);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

export default router;