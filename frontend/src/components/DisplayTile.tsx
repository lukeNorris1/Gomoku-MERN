import { useState, memo } from "react";
import { TILE_STATUS } from "../constants";

import style from "./DisplayTile.module.css";

type TileProps = {
  id: number;
  isSelected?: boolean;
  text: number;
  player?: string;
};



export default memo(function DisplayTile(props: TileProps) {
  const { isSelected = false, text, player  } = props;
  const [status] = useState(
    isSelected ? TILE_STATUS.SELECTED : TILE_STATUS.AVAILABLE
  );
  
  const getClassNames = (status: TILE_STATUS) => {
    const className = style.tile;
    if (isSelected) {
        if (status === TILE_STATUS.SELECTED && player === 'Black') {
            return `${className} ${style.black}`;
        } else if  (status === TILE_STATUS.SELECTED && player === 'White') {
            return `${className} ${style.white}`;
        }
      }
    else return `${className} ${style.available}`;
  };




  return (
    <div className={getClassNames(status)}>
      {text >= 0 ? text + 1 : ''}
    </div>
  );
});
