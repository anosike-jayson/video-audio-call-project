import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";


export interface UserDoc extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  toUser(): { _id: string; username: string; email: string };
}

const UserSchema = new Schema<UserDoc>(
  {
    username: { 
      type: String,
      required: true,
      unique: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    
    password: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error("Password hashing failed"));
  }
});

UserSchema.methods.toUser = function () {
  const obj = this.toObject();
  return {
    _id: obj._id.toString(),
    username: obj.username,
    email: obj.email,
  };
};

const User = mongoose.model<UserDoc>("User", UserSchema);
export default User;