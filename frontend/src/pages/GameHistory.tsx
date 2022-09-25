import { useLocalStorage } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { boardInfo } from "../types";
import { UserContext } from "../context";
import { get } from "../utils/http";
import style from "./GameHistory.module.css";

export default function GameHistory() {
  const navigate = useNavigate();

  const [games, setGames] = useState<boardInfo[]>();

  const fetchGameDetails = useCallback(async () => {
    try {
      const fetchedGame = await get<boardInfo[]>(
        "http://localhost:5000/api/games"
      );

      
      setGames(fetchedGame.filter(e => 
        e.winner === "Black" || 
        e.winner === "White" || 
        e.winner === "Draw"
        ));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchGameDetails();
  }, [fetchGameDetails]);

  return (
    <div className={style.container}>
      {games?.map((board, key) => {
        const { created, winner, _id } = board;
        return (
          <div className={style.list} key={key}>
            <p className={style.title}>
              {`Game #${key}
                   @ ${created?.substring(0, created.indexOf('T'))}  - Winner is ${winner}`}
            </p>
            <button
              className={style.button}
              onClick={() => navigate(`/game-log:${_id}`)}
            >
              View game log
            </button>
          </div>
        );
      })}
    </div>
  );
}
