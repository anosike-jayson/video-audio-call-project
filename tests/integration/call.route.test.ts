import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import callRouter, { setIo } from "../../src/routes/call.route"; 
import UserModel, { UserDoc } from "../../src/models/user.model";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use("/call", callRouter);

const mockIo = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
} as unknown as Server;
setIo(mockIo); 

describe("Call Routes", () => {
  let token: string;

  beforeEach(async () => {
    const user: UserDoc = await UserModel.create({
      username: "z",
      email: "test@example.com",
      password: "hashedpassword",
    });
    token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET || "secret");
  });

  it("POST /call/start should start a call for the authenticated user", async () => {
    const response = await request(app)
      .post("/call/start")
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.participants).toEqual(["testuser"]);
    expect(mockIo.to).toHaveBeenCalledWith(response.body._id);
    expect(mockIo.emit).toHaveBeenCalledWith("call-started", response.body);
  });

  it("POST /call/start should return 401 without token", async () => {
    const response = await request(app).post("/call/start").expect(401);
    expect(response.body.error).toBe("No token provided");
  });
});