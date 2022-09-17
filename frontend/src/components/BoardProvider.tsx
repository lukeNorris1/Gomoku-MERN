import { useState } from 'react'
import { Board } from '../types'
import { BoardContext } from '../context'

type BoardProviderProps = {
  children: React.ReactNode
}

export default function BoardProvider({ children }: BoardProviderProps) {
  const [board, setBoard] = useState<Board | undefined>(undefined)

  const changeBoard = (boardSize: number) => setBoard({ boardSize })

  return (
    <BoardContext.Provider value={{ board, changeBoard }}>
      {children}
    </BoardContext.Provider>
  )
}