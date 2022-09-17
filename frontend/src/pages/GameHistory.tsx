import { useLocalStorage } from "../hooks";
import { useNavigate } from "react-router-dom";
import { boardInfo } from "../types";
import style from "./GameHistory.module.css";

export default function GameHistory() {
  const navigate = useNavigate();
  const [boards] = useLocalStorage<Record<string, boardInfo>>("boards", {});

  return (
    <div className={style.container}>
      {Object.keys(boards).map((key, arr) => {
        const { size, date, winner} = boards[key]
          const sessionId = key.split("-")[1];
          if (size === 0) return null;

          return (
            <div className={style.list} key={key}>
              <p className={style.title}>
                {`Game #${sessionId.replace(/\s/g, "")}
               @ ${date}  - Winner is ${winner}`}
              </p>
              <button
                className={style.button}
                onClick={() => navigate(`/game-log:${sessionId}`)}
              >
                View game log
              </button>
            </div>
          );
      }
      )}
    </div>
  );
}
