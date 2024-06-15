import React from 'react'
import { useState, useRef } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { RgbaColorPicker } from "react-colorful";
import { BsPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";
import { useSelector,useDispatch } from 'react-redux';
import { changelineColor,changefillColor ,changefontColor} from '../redux/options/optionSlice';
export default function PickColor() {
  const [isOpen, setisOpen] = useState(false);
  const options=useSelector((state)=>state.options);
  const dispatch=useDispatch()
  const ref = useRef();
  useClickAway(ref, () => setisOpen(false));


  return (
    <div className='relative flex items-center cursorr' ref={ref}>
      <button className='btn-icon cursorr'
         onClick={() => setisOpen(!isOpen)}
      >
        <BsPaletteFill />
      </button>
      {isOpen &&
        <div className="absolute left-10 mt-24 sm:left-14" >
          <h2 className="ml-3 font-semibold text-black">
                Line color
          </h2>
          <RgbaColorPicker className='mb-5'
          color={options.lineColor}
          onChange={(e)=>dispatch(changelineColor(e))}
          />
          <h2 className="ml-3 font-semibold text-black">
                Fill color
          </h2>
          <RgbaColorPicker className='mb-5' 
          color={options.fillColor}
          onChange={(e)=>{dispatch(changefillColor(e))}}
          />
          <h2 className="ml-3 font-semibold text-black">
                Font color
          </h2>
          <RgbaColorPicker className='mb-5' 
          color={options.fontColor}
          onChange={(e)=>{dispatch(changefontColor(e))}}
          />
        </div>

    }
    </div>
  )
}
