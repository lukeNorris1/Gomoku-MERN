import { useState, memo } from "react";
import { BoardActionType, TILE_STATUS } from "../constants";
import { BoardAction } from "../types";

import style from "./Tile.module.css";

type TileProps = {
  id: number;
  isSelected?: boolean
  dispatch: React.Dispatch<BoardAction>
  player?: string
  status: TILE_STATUS
  order: number
  text?: string
};

const getClassNames = (status: TILE_STATUS) => {
  const className = style.tile;
  switch (status) {
    case TILE_STATUS.BLACK:
      return `${className} ${style.black}`;
    case TILE_STATUS.WHITE:
      return `${className} ${style.white}`;
    default:
      return `${className} ${style.available}`;
  }
};

export default memo(function Tile({
  id,
  isSelected = false,
  player,
  dispatch,
  status,
  order,
}: TileProps) {
  if (status === TILE_STATUS.BLACK || status === TILE_STATUS.WHITE) isSelected = true


  const handleClick = () => {
    if (!isSelected) {
      if (status === TILE_STATUS.AVAILABLE && player === "Black") {
        status = TILE_STATUS.BLACK
        dispatch({ type: BoardActionType.SELECT, payload: id });
      } else if (status === TILE_STATUS.AVAILABLE && player === "White") {
        status = TILE_STATUS.WHITE
        dispatch({ type: BoardActionType.SELECT, payload: id });
      }
    } else dispatch({ type: BoardActionType.EMPTY, payload: id });
  };

  return (
    <div className={getClassNames(status)} onClick={handleClick}>
      {}
    </div>
  );
});
