import mongoose, { Document } from "mongoose";
import { number } from "zod";

export interface GameDocument extends Document {
  size: number;
  date: String;
  winner: String;
  moves: [Number];
}

const gameSchema = new mongoose.Schema({
  size: Number,
  date: String,
  winner: String,
  moves: [Number],
}, { timestamps: true });

export default mongoose.model<GameDocument>("Game", gameSchema);
