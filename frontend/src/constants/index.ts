import dotenv from "dotenv";

export enum TILE_STATUS {
  AVAILABLE = "AVAILABLE",
  SELECTED = "SELECTED",
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export enum BoardActionType {
  SELECT = "SELECT",
  DESELECT = "DESELECT",
  SIZE = "SIZE",
  DATE = "DATE",
  WINNER = "WINNER",
  EMPTY = "EMPTY",
  ID = "ID",
}

dotenv.config();
export const API_HOST = process.env.PORT;
