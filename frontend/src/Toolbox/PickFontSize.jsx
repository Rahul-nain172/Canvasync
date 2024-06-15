import React from 'react'
import { useClickAway, useSetState } from "react-use";
import { useState,useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { changefont } from '../redux/options/optionSlice';
import { BiFontSize } from 'react-icons/bi';
export default function PickFontSize() {
    const options=useSelector((state)=>state.options);
    const dispatch=useDispatch();
    const ref = useRef(null);
    const [isOpen, setisOpen] = useState(false);
    useClickAway(ref, () => setisOpen(false));
    return (
        <div className='relative flex items-center cursorr' ref={ref}>
            <button
                className="btn-icon text-xl cursorr"
                onClick={() => setisOpen(!isOpen)}
               disabled={options.mode === "select"}
            >
                <BiFontSize/>
            </button>
            {isOpen && (
          <div
            className="absolute top-[6px] left-14 w-36"
          >
            <input
              type="range"
              min={8}
              max={100}
              value={options.fontSize}
              onChange={(e)=>dispatch(changefont(parseInt(e.target.value,10)))}
              className="h-4 w-full cursorr appearance-none rounded-lg bg-gray-200"
            />
          </div>)
            }
        </div>
    )
}
