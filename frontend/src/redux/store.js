import { configureStore } from '@reduxjs/toolkit'
import optionReducer from './options/optionSlice';
import roomReducer from './room/roomSlice'
import bgReducer from './background/backgroundSlice'
import savedMovesReducer from './savedMoves/savedMovesSlice';
import { enableMapSet } from 'immer';
enableMapSet();
export const store= configureStore({
  reducer: {
    options:optionReducer,
    room:roomReducer,
    bg:bgReducer,
    savedMoves:savedMovesReducer
  },
})