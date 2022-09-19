import mongoose, { Document } from "mongoose"
import { GameDocument } from "./game.model";

export interface SessionDocument extends Document {
  gameId: GameDocument["_id"];
  time: string;
}

const sessionSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
  time: String
})

export default mongoose.model<SessionDocument>("Session", sessionSchema)
