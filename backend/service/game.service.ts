import mongoose, { DocumentDefinition, FilterQuery } from 'mongoose'
import GameModel, { GameDocument } from '../models/game.model'

export async function getAllGames() {
  return await GameModel.find().lean()
}

export async function getGameById(id: string) {
  return await GameModel.findById(id).lean()
}

export async function createGame(
  input: DocumentDefinition<GameDocument>
) {
  return GameModel.create(input)
}

export async function getGamesByFilter(query: FilterQuery<GameDocument>) {
  return await GameModel.find(query).lean()
}

export async function updateGame(
  id: string,
  input: DocumentDefinition<GameDocument>
) {
  return GameModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id)
    },
    input,
    { new: true } // new option to true to return the document after update was applied.
  )
}

export async function deleteGame(id: string, ) {
  return GameModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id)
  })
}