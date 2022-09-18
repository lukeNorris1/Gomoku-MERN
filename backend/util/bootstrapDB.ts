import "dotenv/config";
import connect from "../config/db";

import MovieModel from "../models/user.model";
import movies from "../data/movies.json"

const run = async () => {
  try {
    await connect();

    await MovieModel.deleteMany();
    await MovieModel.insertMany(movies);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

run();
