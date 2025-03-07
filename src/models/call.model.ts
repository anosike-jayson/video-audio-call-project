import mongoose, { Schema, Document } from "mongoose";

interface CallDoc extends Document {
  participants: mongoose.Types.ObjectId[];
  startTime: Date;
  endTime?: Date; 
  createdAt: Date;
  updatedAt: Date;
  toCall(): { _id: string; participants: string[]; startTime: Date; endTime?: Date; createdAt: Date; updatedAt: Date };
}

const CallSchema = new Schema<CallDoc>(
  {
    participants: [{ 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    }],

    startTime: { 
        type: Date, 
        default: Date.now 
    },

    endTime: { type: Date },
  },
  { timestamps: true }
);

CallSchema.methods.toCall = function () {
  const obj = this.toObject();
  return {
    _id: obj._id.toString(), 
    participants: obj.participants.map((id: mongoose.Types.ObjectId) => id.toString()), 
    startTime: obj.startTime,
    endTime: obj.endTime,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const Call = mongoose.model<CallDoc>("Call", CallSchema);
export default Call;