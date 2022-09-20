import { DocumentDefinition, FilterQuery } from 'mongoose'
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