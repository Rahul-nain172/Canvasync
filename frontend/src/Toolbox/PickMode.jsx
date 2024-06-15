import React from 'react'
import { AiOutlineSelect } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { FaEraser } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import { useSelector,useDispatch } from 'react-redux';
import { changeMode } from '../redux/options/optionSlice';

export default function PickMode() {
  const options=useSelector((state)=>state.options);
  const dispatch=useDispatch();
  return (
    <>
      <button
        className={`btn-icon text-2xl cursorr ${
          options.mode === "draw" && "bg-green-400 border border-white rounded-lg"
        }`}
        onClick={()=>dispatch(changeMode("draw"))}
      >
        <BsPencilFill />
      </button>
      <button className={`btn-icon text-2xl cursorr ${
          options.mode === "text" && "bg-green-400 border border-white rounded-lg"
        }`}
    onClick={()=>dispatch(changeMode("text"))}>
        <CiText/>
    </button>
      <button
        className={`btn-icon text-2xl cursorr ${
          options.mode === "eraser" && "bg-green-400 border border-white rounded-lg"
        }`}
        onClick={()=>dispatch(changeMode("eraser"))}
      >
        <FaEraser />
      </button>

      <button
        className={`btn-icon text-2xl cursorr  ${
          options.mode === "select" &&"bg-green-400 border border-white rounded-lg"
        }`}
        onClick={()=>dispatch(changeMode("select"))}
      >
        <AiOutlineSelect />
      </button>

    </>
  )
}
