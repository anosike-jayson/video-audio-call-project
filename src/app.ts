import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoute from "./routes/auth.route";
import callRoute from "./routes/call.route";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoute);
app.use("/api/call", callRoute);

export default app;
