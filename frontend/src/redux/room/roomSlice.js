import { createSlice } from "@reduxjs/toolkit";
import { getNextColor } from "../../references/colors";

const initialState = {
  id: "",
  users: new Map(),
  usersMoves: new Map(),
  movesWithoutUser: [],
  myMoves: [],
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.id = action.payload;
    },
    addUser: (state, action) => {
      const { name,userId} = action.payload;
      const users=state.users;
      const color = getNextColor([...users.values()].pop()?.color); // Next color to last assigned color to a user
      users.set(userId, { name:name, color:color })
      const usersMoves=state.usersMoves;
      usersMoves.set(userId, []);
      state.users=users;
      state.usersMoves=usersMoves;
    },
    removeUser: (state, action) => {
      const userId = action.payload;
      const users=state.users;
      users.delete(userId);
      state.users=users;
    },
    addMoveToUser: (state, action) => {
      
      const { userId, move } = action.payload;
      const usersMoves = state.usersMoves;
      const userMoves = usersMoves.get(userId)||[];
      userMoves.push(move);
      usersMoves.set(userId,userMoves);
      state.usersMoves=usersMoves;
    },
    removeMoveFromUser: (state, action) => {
      const userId = action.payload;
      const usersMoves = state.usersMoves;
      const userMoves = usersMoves.get(userId);
      if (userMoves) {
        userMoves.pop();
        usersMoves.set(userId,userMoves);
        state.usersMoves=usersMoves;
      }
    },
    addMyMove: (state, action) => {
      const move = action.payload;
      if (state.myMoves[state.myMoves.length - 1]?.options.mode === "select") {
        state.myMoves.splice(state.myMoves.length - 1, 1, move);
      } else {
        state.myMoves.push(move);
      }
    },
    removeMyMove: (state) => {
      state.myMoves.pop();
    },
    addMoveWithoutUser:(state,action)=>{
      state.movesWithoutUser=action.payload;
    },
    setMovetoUser:(state,action)=>{
      state.usersMoves=action.payload;
      
    }
  },
});

export const {
  setRoomId,
  addUser,
  removeUser,
  addMoveToUser,
  removeMoveFromUser,
  addMyMove,
  removeMyMove,
  addMoveWithoutUser,
  setMovetoUser
} = roomSlice.actions;

export default roomSlice.reducer;
