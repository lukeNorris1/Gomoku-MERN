import { useState, useContext, useReducer, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BoardContext, UserContext } from "../context";
import { Tile } from "../components";
import { useLocalStorage } from "../hooks";
import { BoardActionType, TILE_STATUS } from "../constants";
import { boardInfo } from "../types";
import { post } from "../utils/http";
import style from "./Game.module.css";

type BoardAction = {
  type: BoardActionType;
  payload: any;
};



function boardReducer(state: boardInfo, action: BoardAction) {
  const { size, winner, moves } = state;
  const { type, payload } = action;
  switch (type) {
    case BoardActionType.SELECT:
      return {
        size: size,
        winner: winner,
        moves: [...moves, payload],
      };
    case BoardActionType.SIZE:
      return { size: payload, winner: winner, moves: moves };
    case BoardActionType.DATE:
      return { size: size, winner: winner, moves: moves };
    case BoardActionType.WINNER:
      return { size: size, winner: payload, moves: moves };
    case BoardActionType.EMPTY:
      return { size: size, winner: winner, moves: [] };
    default:
      return state;
  }
}

export default function Game() {
  const { board } = useContext(BoardContext);
  const [player, setPlayer] = useState("Black");
  const { user } = useContext(UserContext);
  const [boardAddition, setBoardAddition] = useState(1);
  const [gameEnd, setGameEnd] = useState(false);
  const [playerMessage, setPlayerMessage] = useState(
    `Current Player: ${player}`
  );
  const [localBoardSize, setLocalBoardSize] = useState(15);
  const navigate = useNavigate();

  const [boards, saveBoards] = useLocalStorage<Record<string, boardInfo>>(
    `boards`,
    {}
  );

  const currentBoard = { size: board?.boardSize || 15, winner: "", moves: [1,2,3,4] };

  const fetchGameDetails = useCallback(async () => {
    try {
      const fetchedMovie = await post<any, boardInfo>("http://localhost:5000/api/games", currentBoard);
      //console.log(fetchedMovie.map((e) => e));
    } catch (error) {
      console.log(error);
    }
  }, []);

  fetchGameDetails()
  

  const [state, dispatch] = useReducer(boardReducer, currentBoard);



  useEffect(() => {
    gameFinishCheck();
  }, [state.moves]);

  useEffect(() => {
    if (player !== "") setPlayerMessage(`Current Player: ${player}`);
    else {
      setPlayerMessage(`Winner: ${state.winner}`);
    }
  }, [player]);

  const restartClick = () => {
    dispatch({ type: BoardActionType.EMPTY, payload: "" });
    setPlayer("Black");
  };

  function leaveButton() {
    if (gameEnd) {
      saveBoards({ ...boards, [`board-${boardAddition}`]: state });
      navigate("/gameHistory");
    } else navigate("/");
  }

  function indexOfTile(value: number) {
    return state.moves.indexOf(value);
  }

  function gameFinishCheck() {
    if (state.moves.length < 9) return;
    const base = state.moves[state.moves.length - 1];
    if (
      checkWinBlock(base, 1) ||
      checkWinBlock(base, state.size) ||
      checkWinBlock(base, state.size + 1) ||
      checkWinBlock(base, state.size - 1)
    ) {
      setGameEnd(true);
      if (player === "White") {
        dispatch({ type: BoardActionType.WINNER, payload: "Black" });
      } else {
        dispatch({ type: BoardActionType.WINNER, payload: "White" });
      }
      setPlayer("");
    }
    if (state.moves.length === state.size * state.size) {
      setGameEnd(true);
      setPlayerMessage("Draw");
      dispatch({ type: BoardActionType.WINNER, payload: "Draw" });
      setPlayer("");
    }
  }

  function checkWinBlock(baseCase: number, tileDiff: number) {
    if (!baseCase) return;
    var counter = 1;
    var iterator = tileDiff;
    for (var i: number = 1; i < 5; i++) {
      if (
        state.moves.includes(baseCase - iterator) &&
        baseCase - iterator >= 0
      ) {
        if (
          (indexOfTile(baseCase) % 2 === 0) ===
          (indexOfTile(baseCase - iterator) % 2 === 0)
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
          (indexOfTile(baseCase) % 2 === 0) ===
          (indexOfTile(baseCase + iterator) % 2 === 0)
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

  const togglePlayer = () => {
    if (!gameEnd) player === "Black" ? setPlayer("White") : setPlayer("Black");
  };

  function getStoneStatusAndMoveOrder(index: number) {
    const order = state.moves.findIndex((e) => e === index);
    const status =
      order === -1
        ? TILE_STATUS.AVAILABLE
        : order % 2
        ? TILE_STATUS.WHITE
        : TILE_STATUS.BLACK;
    return { order, status };
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={style.container}>
      <div className={style.turn}>{playerMessage}</div>
      <div className={style.board}>
        <div
          className={style.tiles}
          onClick={togglePlayer}
          style={{ gridTemplateColumns: `repeat(${localBoardSize}, 1fr)` }}
        >
          {[...Array(localBoardSize * localBoardSize)].map((_, index) => (
            <Tile
              key={`tile-${index}`}
              id={index}
              isSelected={state.moves.includes(index)}
              {...getStoneStatusAndMoveOrder(index)}
              dispatch={dispatch}
              player={player}
            />
          ))}
        </div>
      </div>
      <div className={style.navigation}>
        <button className={style.navText} onClick={restartClick}>
          Restart
        </button>
        <button className={style.navText} onClick={leaveButton}>
          Leave
        </button>
      </div>
    </div>
  );
}
