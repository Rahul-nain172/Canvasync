import { createSlice } from "@reduxjs/toolkit";

const initialState={
    mode:"dark",
    lines:true,
}
export const backgroundSlice=createSlice({
    name:'bg',
    initialState,
    reducers:{
        setBg:(state,action)=>{
            state.mode=action.payload.mode;
            state.lines=action.payload.lines;
        }
    }
})
export const {setBg}=backgroundSlice.actions;

export default backgroundSlice.reducer;