import express, { Request, Response } from 'express'

import validateSchema from '../middlewares/validateSchema'

import { getGameByIdSchema } from '../schema/game.schema'

import { getAllGames, getGameById } from '../service/game.service'
import { getSessionsByGameId } from '../service/session.service'

const gameHandler = express.Router()

// Get ALL movies
gameHandler.get('/', async (req: Request, res: Response) => {
  try {
    const result = await getAllGames()
    return res.status(200).send(
      result.map((m) => ({
        _id: m._id,
        title: m.title,
        poster: m.moves
      }))
    )
  } catch (err) {
    return res.status(500).send(err)
  }
})

 // GET movie by ID, expecting movie + session info
gameHandler.get(
  '/:id',
  validateSchema(getGameByIdSchema),
  async (req: Request, res: Response) => {
    const gameId = req.params.id

    const game = await getGameById(gameId)
    if (!game) return res.sendStatus(404)
    const sessions = await getSessionsByGameId(gameId)
    return res.status(200).json({ ...game, sessions })
  }
)

export default gameHandler
