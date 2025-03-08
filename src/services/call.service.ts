import CallModel from "../models/call.model";
import { Call } from "../types/auth.types";
import User from "../models/user.model";

export const startCall = async (userId: string): Promise<Call> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const newCall = new CallModel({ participants: [user.username] });
    await newCall.save();

    return newCall.toCall();
  } catch (error) {
    throw new Error(`Call creation failed: ${error instanceof Error ? error.message : "Internal server error"}`);
  }
};

export const joinCall = async (callId: string, userId: string): Promise<Call> => {
  try {
    const call = await CallModel.findById(callId);
    if (!call) throw new Error("Call not found");

    if (call.endTime) throw new Error("Call has already ended");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!call.participants.some((id) => id.toString() === userId)) {
      call.participants.push(user.username);
      await call.save();
    }

    return call.toCall();
  } catch (error) {
    throw new Error(`Joining call failed: ${error instanceof Error ? error.message : "Internal server error"}`);
  }
};

export const endCall = async (callId: string, endTime: Date): Promise<Call> => {
  try {
    const call = await CallModel.findById(callId);
    if (!call) throw new Error("Call not found");
    call.endTime = endTime;
    call.duration = Math.round((endTime.getTime() - call.startTime.getTime()) / 1000);
    await call.save();
    return call.toCall();
  } catch (error) {
    throw new Error(`Call update failed: ${error instanceof Error ? error.message : "Internal server error"}`);
  }
};

export const getCallHistory = async (userId: string): Promise<Call[]> => {
  try {
    const calls = await CallModel.find({ participants: userId }).sort({ startTime: -1 });
    return calls.map((call) => call.toCall());
  } catch (error) {
    throw new Error(`Call history retrieval failed: ${error instanceof Error ? error.message : "Internal server error"}`);
  }
};