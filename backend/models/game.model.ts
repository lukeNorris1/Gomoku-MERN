import mongoose, { Document } from "mongoose"

export interface GameDocument extends Document {
    title: String,
    moves: [Number]
}

const gameSchema = new mongoose.Schema({
    title: String,
    moves: [Number]
})

export default mongoose.model<GameDocument>("Game", gameSchema)
