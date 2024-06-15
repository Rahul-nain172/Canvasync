import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { BiRectangle } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag } from "react-icons/cg";
import { useState,useRef } from 'react';
import {useClickAway} from 'react-use'
import { useSelector,useDispatch } from 'react-redux';
import { changeShape } from '../redux/options/optionSlice';
export default function SelectShape() {
    const [isOpen,setisOpen]=useState(false);
    const options=useSelector((state)=>state.options);
    const dispatch=useDispatch();
    const ref=useRef();
    useClickAway(ref, () => setisOpen(false));
  return (
    <div className="relative flex items-center cursorr" ref={ref}>
    <button
      className="btn-icon text-2xl cursorr"
      disabled={options.mode === "select"}
      onClick={() => setisOpen((prev) => !prev)}
    >
      {options.shape === "circle" && <BsCircle />}
      {options.shape === "rect" && <BiRectangle />}
      {options.shape === "line" && <CgShapeZigzag />}
    </button>

    {/* <AnimatePresence> */}
      {isOpen && (
        <div
          className="absolute left-14 z-10 flex gap-1 rounded-lg  border bg-zinc-900 p-2 md:border-0 "
        //  variants={EntryAnimation}
          initial="from"
          animate="to"
          exit="from"
        >
          <button
            className="btn-icon text-2xl cursorr" 
           onClick={() => dispatch(changeShape('line'))}
          >
            <CgShapeZigzag />
          </button>

          <button
            className="btn-icon text-2xl cursorr"
            onClick={() => dispatch(changeShape('rect'))}
          >
            <BiRectangle />
          </button>

          <button
            className="btn-icon text-2xl cursorr"
            onClick={() => dispatch(changeShape('circle'))}
          >
            <BsCircle />
          </button>
        </div>
      )}
    {/* </AnimatePresence> */}
  </div>
  )
}
