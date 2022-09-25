import "dotenv/config";
import connect from "../config/db";

import UserModel from "../models/user.model";
import GameModel from "../models/game.model";
import movies from "../data/movies.json";
import games from "../data/games.json";

const run = async () => {
  try {
    await connect();

    await GameModel.deleteMany();

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

run();
