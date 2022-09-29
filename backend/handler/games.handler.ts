import express, { Request, Response } from "express";
import mongoose from "mongoose";

import validateSchema from "../middlewares/validateSchema";
import { getGameByIdSchema, createGameSchema, deleteGameSchema } from "../schema/game.schema";
import {
  getAllGames,
  getGameById,
  getGamesByFilter,
  createGame,
  updateGame,
  deleteGame,
} from "../service/game.service";

const gameHandler = express.Router();

function indexOfTile(value: number, state: any) {
  return state.moves.indexOf(value);
}

function gameFinishCheck(state: any) {
  if (state.moves.length < 9) return;
  const base = state.moves[state.moves.length - 1];
  if (
    checkWinBlock(base, 1, state) ||
    checkWinBlock(base, state.size, state) ||
    checkWinBlock(base, state.size + 1, state) ||
    checkWinBlock(base, state.size - 1, state)
  ) {
    //if Winner is found choose black or white
    if (state.moves.length % 2 == 0){
      return "White"
    } else if (state.moves.length % 2 == 1){
      return "Black"
    }
  }
  if (state.moves.length === state.size * state.size) {
    //if game is full change to draw
    return "Draw"
  }
}

function checkWinBlock(baseCase: number, tileDiff: number, state: any) {
  if (!baseCase) return;
  var counter = 1;
  var iterator = tileDiff;
  for (var i: number = 1; i < 5; i++) {
    if (
      state.moves.includes(baseCase - iterator) &&
      baseCase - iterator >= 0
    ) {
      if (
        (indexOfTile(baseCase, state) % 2 === 0) ===
        (indexOfTile(baseCase - iterator, state) % 2 === 0)
      ) {
        counter += 1;
        iterator += tileDiff;
      }
    } else break;
  }
  iterator = tileDiff;
  for (i = 1; i < 5; i++) {
    if (
      state.moves.includes(baseCase + iterator) &&
      baseCase + iterator >= 0
    ) {
      if (
        (indexOfTile(baseCase, state) % 2 === 0) ===
        (indexOfTile(baseCase + iterator, state) % 2 === 0)
      ) {
        counter += 1;
        iterator += tileDiff;
      }
    } else break;
  }
  if (counter >= 5) {
    return true;
  }
}



// Get ALL movies
gameHandler.get("/", async (req: Request, res: Response) => {
  try {
    const result = await getAllGames();
    return res.status(200).send(
      result.map((m) => ({
        _id: m._id,
        size: m.size,
        winner: m.winner,
        moves: m.moves,
        created: m.createdAt,
      }))
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

// GET game by ID
gameHandler.get(
  "/:id",
  validateSchema(getGameByIdSchema),
  async (req: Request, res: Response) => {
    const gameId = req.params.id;

    const game = await getGameById(gameId);
    if (!game) return res.sendStatus(404);
    return res.status(200).json(game);
  }
);

// Create a game
gameHandler.post(
  "/",
  validateSchema(createGameSchema),
  async (req: Request, res: Response) => {
    const game = req.body;

    const newGame = await createGame({ ...game });
    return res.status(200).send(newGame);
  }
);

// Modify a game
gameHandler.put(
  "/:id",
  validateSchema(createGameSchema),
  async (req: Request, res: Response) => {
    let game = req.body;
    const gameId = req.params.id;

    game.winner = gameFinishCheck(game)

    const newGame = await updateGame(gameId, {
      ...game,
    });


    if (!newGame) return res.sendStatus(404);
    return res.status(200).json(newGame.winner);
  }
);

//Delete a game by Id
gameHandler.delete(
  '/:id',
  validateSchema(deleteGameSchema),
  async (req: Request, res: Response) => {
    const gameId = req.params.id
    const game = await getGamesByFilter({
      _id: new mongoose.Types.ObjectId(gameId),
    })
    if (!game) {
      return res.sendStatus(404)
    }
    await deleteGame(gameId)
    return res.sendStatus(200)
  }
)

export default gameHandler;
