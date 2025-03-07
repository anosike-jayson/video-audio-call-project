import express, { Router, Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { RegisterRequestBody, User, LoginRequestBody, LoginResponse } from "../types/auth.types";


const router: Router = express.Router();

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    try {
      const user: User = await registerUser(
        req.body.username,
        req.body.email,
        req.body.password
      );
      res.status(201).json(user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occured during registration";
      res.status(400).json({ error: errorMessage });
    }
  }
);

router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
      const { user, token }: LoginResponse = await loginUser(
        req.body.email,
        req.body.password
      );
      res.json({ user, token });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occured during login";
      res.status(400).json({ error: errorMessage });
    }
  }
);

export default router;