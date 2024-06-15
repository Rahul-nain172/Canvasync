import { createSlice } from "@reduxjs/toolkit";

const savedMovesSlice = createSlice({
  name: 'savedMoves',
  initialState: [],
  reducers: {
    addSavedMove: (state, action) => {
      const move = action.payload;
      if (move.options.mode !== 'select') {
        state.unshift(move);
      }
    },
    removeSavedMove: (state, action) => {
      state.shift();
    },
    clearSavedMoves: (state, action) => {
      return [];
    }
  }
});

export const { addSavedMove, removeSavedMove, clearSavedMoves } = savedMovesSlice.actions;
export default savedMovesSlice.reducer;
