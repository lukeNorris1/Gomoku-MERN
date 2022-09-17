import { BoardActionType } from '../constants'

export type BoardAction = {
    type: BoardActionType
    payload: number
}