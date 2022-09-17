import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks";
import { boardInfo } from "../types";
import {  Button, DisplayTile } from "../components";
import style from "./GameHistoryDetails.module.css";

export default function GameHistoryDetails() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [boards] = useLocalStorage<Record<string, boardInfo>>(`boards`, {});

  

  const boardIdentifier = boardId?.split(":")[1]
  
  const { size, winner, moves} = boards[`board-${boardIdentifier}`]

  const tempSize = size || 15

  function tileColor(index: number){
    const tileIndex = moves.indexOf(index)
    if (moves.includes(index) && tileIndex % 2 === 1) return 'White'
    else return 'Black' 
  }

  return (
    <div className={style.container}>
      <div className={style.turn}>{`Winner: ${winner}`}</div>
      <div className={style.board}>
        <div
          className={style.tiles}
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {[...Array(tempSize  * tempSize)].map((key, index) => (
            <DisplayTile
              key={`tile-${index}`}
              id={index}
              isSelected={moves.includes(index)}
              player={tileColor(index)}
              text={moves.indexOf(index)}
            />
          ))}
        </div>
      </div>
      <Button onClick={() => {navigate("/gameHistory")}}>Back</Button>
    </div>
  );
}
