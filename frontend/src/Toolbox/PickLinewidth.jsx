import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway, useSetState } from "react-use";
import { useState,useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { changelineWidth } from '../redux/options/optionSlice';
export default function PickLinewidth() {
    const options=useSelector((state)=>state.options);
    const dispatch=useDispatch();
    const ref = useRef(null);
    const [isOpen, setisOpen] = useState(false);
    useClickAway(ref, () => setisOpen(false));
    return (
        <div className='relative flex items-center cursorr' ref={ref}>
            <button
                className="btn-icon text-xl cursorr"
                onClick={() => {console.log('clicked line');setisOpen(!isOpen)}}
               disabled={options.mode === "select"}
            >
                <BsBorderWidth />
            </button>
            {isOpen && (
          <div
            className="absolute top-[6px] left-14 w-36"
          >
            <input
              type="range"
              min={1}
              max={20}
              value={options.lineWidth}
              onChange={(e)=>dispatch(changelineWidth(parseInt(e.target.value,10)))}
              className="h-4 w-full cursorr appearance-none rounded-lg bg-gray-200"
            />
          </div>)
            }
        </div>
    )
}
