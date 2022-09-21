import express, { Request, Response } from "express";
import mongoose from "mongoose";

import validateSchema from "../middlewares/validateSchema";
import { getGameByIdSchema, createGameSchema } from "../schema/game.schema";
import {
  getAllGames,
  getGameById,
  getGamesByFilter,
  createGame,
  updateGame,
} from "../service/game.service";
import { getSessionsByGameId } from "../service/session.service";

const gameHandler = express.Router();

//! Calculate game win here
function winConditionCheck(moves: number[]) {
  return;
}

// Get ALL movies
gameHandler.get("/", async (req: Request, res: Response) => {
  try {
    const result = await getAllGames();
    return res.status(200).send(
      result.map((m) => ({
        _id: m._id,
        size: m.size,
        date: m.date,
        winner: m.winner,
        moves: m.moves,
      }))
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

// GET movie by ID, expecting movie + session info
gameHandler.get(
  "/:id",
  validateSchema(getGameByIdSchema),
  async (req: Request, res: Response) => {
    const gameId = req.params.id;

    const game = await getGameById(gameId);
    if (!game) return res.sendStatus(404);
    const sessions = await getSessionsByGameId(gameId);
    return res.status(200).json({ ...game, sessions });
  }
);

// Create a booking
gameHandler.post(
  "/",
  validateSchema(createGameSchema),
  async (req: Request, res: Response) => {
    // TODO: decode user id from token
    //const userId = req.userId
    const game = req.body;
    console.log(`Game Params: ${await req.params.size}`);
    const gamesForTheSession = await getGamesByFilter({
      sessionId: new mongoose.Types.ObjectId(game.sessionId),
    });
    // const allOccupiedSeats = gamesForTheSession.length
    //   ? gamesForTheSession.map((b) => b.seats).flat()
    //   : []
    // const overlappingSeats = !!intersection(allOccupiedSeats, game.seats)
    //   .length
    // if (overlappingSeats) return res.sendStatus(400)

    const newBooking = await createGame({ ...game });
    console.log(`New Booking: ${newBooking}`);
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(
    //       JSON.stringify({
    //         updateBy: userId,
    //         sessionId: game.sessionId,
    //       })
    //     )
    //   }
    // })
    return res.status(200).send(newBooking);
  }
);

// Modify a booking
gameHandler.put(
  "/:id",
  validateSchema(createGameSchema),
  async (req: Request, res: Response) => {
    // TODO: decode user id from token
    //const userId = req.userId
    const game = req.body;
    const gameId = req.params.id;
    console.log(`ID: ${gameId}`);

    const gamesForTheSession = await getGamesByFilter({
      _id: { $ne: new mongoose.Types.ObjectId(gameId) },
    });
    // const allOccupiedSeats = bookingsForTheSession.length
    //   ? bookingsForTheSession.map((b) => b.seats).flat()
    //   : []
    // const overlappingSeats = !!intersection(allOccupiedSeats, booking.seats)
    //   .length
    //if (overlappingSeats) return res.sendStatus(400)

    const newGame = await updateGame(gameId, {
      ...game,
    });

    console.log(`Moves: ${await newGame!.moves}`)
    //! CHECK GAME STATE AND RETURN WINNER/DRAW/NO-WINNER

    if (!newGame) return res.sendStatus(404);
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(
    //       JSON.stringify({
    //         updateBy: userId,
    //         sessionId: booking.sessionId,
    //         occupiedSeats: [...allOccupiedSeats, ...booking.seats],
    //       })
    //     )
    //   }
    // })
    return res.status(200).json(newGame);
  }
);

export default gameHandler;
