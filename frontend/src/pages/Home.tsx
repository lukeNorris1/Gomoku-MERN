import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, BoardContext } from "../context";
import { Button, DisplayTile } from "../components";
import style from "./Home.module.css";

export default function Home() {
  const { user } = useContext(UserContext);
  const { changeBoard } = useContext(BoardContext);
  const [boardSize, setBoardSize] = useState(5);
  const navigate = useNavigate();
  


  function startPress() {
    if (!user) navigate("/login");
    else {
      changeBoard(boardSize);
      navigate(`/game`);
    }
  }

  const moves = [1,2,10,15,24,17,5,13,9,21]

  function findPlayer(index:number){
    if (moves.indexOf(index) % 2 === 1) return 'White'
    else return 'Black'
  
  }
  
  const boardDiv = 
  <>
    <div className={style.board}>
      <div
        className={style.tiles}
        style={{ gridTemplateColumns: `repeat(${5}, 1fr)` }}
      >
        {[...Array(5  * 5)].map((key, index) => (
          <DisplayTile
            key={`tile-${index}`}
            id={index}
            isSelected={moves.includes(index)}
            player={findPlayer(index) }
            text={moves.indexOf(index)}
          />
        ))}
      </div>
    </div>
  </>


  return (
    <div className={style.container}>
      <select
        className={style.dropdown}
        onChange={(e) => {
          setBoardSize(parseInt(e.currentTarget.value, 10))}
        }
      >
        {[...Array(15)].map((_, index) => (
          <option key={index + 5} value={index + 5}>{` ${index + 5} x ${
            index + 5
          }`}</option>
        ))}
      </select>
      <Button key={1} onClick={startPress}>
        Start
      </Button>

      {boardDiv}

      <div className={style.rules}>
        <h3> How to Play: </h3>
        <p>Click a tile on your turn to choose that tile. </p>
        <p>Each player takes their turn selecting a tile</p>
        <p>When there are five of the same coloured tiles in a row that player wins</p>
      </div>

    </div>
  );
}
