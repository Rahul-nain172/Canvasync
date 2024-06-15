import { createSlice } from '@reduxjs/toolkit'
export const optionSlice = createSlice({
  name: 'options',
  initialState: {
    lineColor: {r:0,g:0,b:0,a:1},
    fillColor:{r:0,g:0,b:0,a:0},
    fontColor:{r:0,g:0,b:0,a:1},
    lineWidth: 2,
    fontSize:16,
    mode:"draw",
    shape:"line",
    selection:null,
  },
  reducers: {
    changelineColor: (state, action) => {
      state.lineColor = action.payload;
    },
    changelineWidth: (state, action) => {
      state.lineWidth = action.payload;
    },
    changefillColor:(state,action)=>{
      state.fillColor=action.payload;
    },
    changefontColor:(state,action)=>{
      state.fontColor=action.payload;
    },
    changeShape:(state,action)=>{
      state.shape=action.payload;
    },
    changeSelection:(state,action)=>{
      state.selection=action.payload
    },
    changeMode:(state,action)=>{
      state.mode=action.payload
    },
    changefont:(state,action)=>{
      state.fontSize=action.payload
    },
    clearSelection:(state,action)=>{
      state.selection=null;
    }
  },
})

// Action creators are generated for each case reducer function
export const { changelineColor,changelineWidth,changefillColor,changeShape,changeSelection,changeMode,clearSelection,changefont,changefontColor} = optionSlice.actions
export default optionSlice.reducer