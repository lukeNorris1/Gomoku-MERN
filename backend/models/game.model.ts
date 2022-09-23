import mongoose, { Document } from "mongoose";
import { number } from "zod";

export interface GameDocument extends Document {
  size: number;
  winner: String;
  moves: [Number];
  createdAt: Date;
}

const gameSchema = new mongoose.Schema(
  {
    size: Number,
    winner: String,
    moves: [Number],
    createdAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<GameDocument>("Game", gameSchema);
