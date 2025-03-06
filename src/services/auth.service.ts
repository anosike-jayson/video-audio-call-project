import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { User } from "../types/auth.types";
import bcrypt from "bcryptjs";


const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const newUser = new UserModel({ username, email, password }); 
    await newUser.save();
    return newUser.toUser(); 
  } catch (error) {
    throw new Error(`Registration failed: ${error instanceof Error ? error.message : "Internal server error"}`);
  }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: User; token: string }> => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const userJson = user.toUser();
        const token = generateToken(userJson._id);
        return { user: userJson, token };
    } catch (error) {
        throw new Error(`Login failed: ${error instanceof Error ? error.message : "Internal server error"}`);
    }
};