import {
  useState,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BoardContext, UserContext } from "../context";
import { Tile } from "../components";
import { useLocalStorage } from "../hooks";
import { BoardActionType, TILE_STATUS } from "../constants";
import { boardInfo } from "../types";
import { post, put } from "../utils/http";
import style from "./Game.module.css";

type BoardAction = {
  type: BoardActionType;
  payload: any;
};

function boardReducer(state: boardInfo, action: BoardAction) {
  const { size, winner, moves, _id } = state;
  const { type, payload } = action;
  switch (type) {
    case BoardActionType.SELECT:
      return {
        size: size,
        winner: winner,
        moves: [...moves, payload],
        id: _id,
      };
    case BoardActionType.SIZE:
      return { size: payload, winner: winner, moves: moves, id: _id };
    case BoardActionType.WINNER:
      return { size: size, winner: payload, moves: moves, id: _id };
    case BoardActionType.EMPTY:
      return { size: size, winner: winner, moves: [], id: _id };
    case BoardActionType.ID:
      return { size: size, winner: winner, moves: moves, id: _id };
    default:
      return state;
  }
}

export default function Game() {
  const { board } = useContext(BoardContext);
  const [player, setPlayer] = useState("Black");
  const { user } = useContext(UserContext);
  const [gameEnd, setGameEnd] = useState(false);
  const [playerMessage, setPlayerMessage] = useState(
    `Current Player: ${player}`
  );
  const [gameDetails, setGameDetails] = useState<boardInfo>();
  const navigate = useNavigate();

  const currentBoard = {
    size: board?.boardSize || 15,
    winner: " ",
    moves: [1, 3, 3, 4, 5, 6, 7, 8, 9, 9],
  };
  const [state, dispatch] = useReducer(boardReducer, currentBoard);

  const fetchGameDetails = useCallback(async () => {
    try {
      const fetchedMovie = await post<boardInfo, boardInfo>(
        "http://localhost:5000/api/games",
        state
      );

      console.log(fetchedMovie);
      console.log(`ID: ${fetchedMovie._id}`);
      setGameDetails(fetchedMovie);
      return fetchGameDetails;
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const date = fetchGameDetails();
  }, []);

  // const updateGameDetails = useCallback(async () => {
  //   try {
  //     const fetchedMovie = await put<boardInfo, boardInfo>(
  //       `http://localhost:5000/api/games/${state.}`,
  //       state
  //     );
  //     console.log(fetchedMovie);
  //     console.log(`ID: ${fetchedMovie._id}`);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);
  const handleConfirmClick = async (test: any) => {
    console.log(`State; ${state.moves}`);
    const putGame: boardInfo = await put(`http://localhost:5000/api/games/${gameDetails?._id}`, {
      state,
      winner: "me222",
      size: state.size,
      moves: state.moves,
    });
    console.log(`Return: ${putGame.moves}`)
  };

  useEffect(() => {
    console.log(state.moves);
    handleConfirmClick("test");
    //updateGameDetails()
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
      //saveBoards({ ...boards, [`board-${boardAddition}`]: state });
      navigate("/gameHistory");
    } else navigate("/");
  }

  function indexOfTile(value: number) {
    return state.moves.indexOf(value);
  }

  //! MOVE TO PUT REQUEST
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
  //!_-------------------------

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
          style={{ gridTemplateColumns: `repeat(${currentBoard.size}, 1fr)` }}
        >
          {[...Array(currentBoard.size * currentBoard.size)].map((_, index) => (
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
