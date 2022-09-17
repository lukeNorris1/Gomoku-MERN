import { createContext } from "react";
import { Board } from "../types";

type BoardContextType = {
  board?: Board;
  changeBoard: (boardSize: number) => void;
};

const BoardContext = createContext<BoardContextType>({} as BoardContextType);
export default BoardContext;
