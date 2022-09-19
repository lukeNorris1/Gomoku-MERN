import "dotenv/config";
import connect from "../config/db";

import UserModel from "../models/user.model";
import GameModel from "../models/game.model"
import movies from "../data/movies.json";
import games from "../data/games.json"

const run = async () => {
  try {
    await connect();

    await UserModel.deleteMany();
    await UserModel.insertMany(movies);

    await GameModel.deleteMany();
    await GameModel.insertMany(games)

    console.log(`Users: ${await UserModel.find()}`);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

run();
