export enum TILE_STATUS {
  AVAILABLE = "AVAILABLE",
  SELECTED = "SELECTED",
  WHITE = "WHITE",
  BLACK = "BLACK",
}


export enum BoardActionType {
  SELECT = "SELECT",
  DESELECT = "DESELECT",
  SIZE  = "SIZE",
  DATE = "DATE",
  WINNER = "WINNER",
  EMPTY = "EMPTY"
}

export const API_HOST = process.env.REACT_APP_API_HOST || ''