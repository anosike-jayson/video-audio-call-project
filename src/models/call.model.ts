import mongoose, { Schema, Document } from "mongoose";

interface CallDoc extends Document {
  participants: string[];
  startTime: Date;
  endTime?: Date; 
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  toCall(): { _id: string; participants: string[]; startTime: Date; endTime?: Date; duration?: number, createdAt: Date; updatedAt: Date };
}

const CallSchema = new Schema<CallDoc>(
  {
    participants: [{ type: String }],
    startTime: { 
        type: Date, 
        default: Date.now 
    },
    endTime: { type: Date },
    duration: { type: Number },
  },
  { timestamps: true }
);

CallSchema.methods.toCall = function () {
  const obj = this.toObject();
  return {
    _id: obj._id.toString(), 
    participants: obj.participants, 
    startTime: obj.startTime,
    endTime: obj.endTime,
    duration: obj.duration,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const Call = mongoose.model<CallDoc>("Call", CallSchema);
export default Call;