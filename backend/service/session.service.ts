import SessionModel from '../models/session.model'

export async function getAllSessions() {
  return await SessionModel.find().lean()
}

export async function getSessionsByGameId(gameId: string) {
  return await SessionModel.find({ gameId }).lean()
}

export async function getSessionById(id: string) {
  return await SessionModel.findById(id).lean()
}
