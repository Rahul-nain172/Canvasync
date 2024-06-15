import React, { useContext, useRef } from 'react';
import { roomContext } from '../contexts/roomContext';
import { useMouse,useInterval } from 'react-use';
import socket from "../../config/socket";
import { motion } from 'framer-motion';
import { FaPencilAlt } from 'react-icons/fa';
import { AiOutlinePlus } from "react-icons/ai";
import { LuTextCursor } from "react-icons/lu";
import { BsEraser } from "react-icons/bs";

import { useSelector } from 'react-redux';

export default function Mouse() {
    const { x, y } = useContext(roomContext);
    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    const prevPosition = useRef({ x: 0, y: 0 });
    const options = useSelector((state) => state.options);

    const ref = useRef(null); // Create a ref

    const { docX, docY } = useMouse(ref); // Pass the ref to useMouse hook

    const getPos = (pos, motionValue) => pos - motionValue.get();
    const style={ color: 'black', fontSize: '18px' };

    useInterval(() => {
        if (
            (prevPosition.current.x !== docX || prevPosition.current.y !== docY) &&
            !touchDevice
        ) {
            socket.emit("mouseMove", getPos(docX, x), getPos(docY, y),options.shape,options.mode);
            prevPosition.current = { x: docX, y: docY };
        }
    }, 150);
    if (touchDevice) return null;

    return (
        <motion.div
            ref={ref} // Attach the ref to an HTML element
            className="pointer-events-none absolute top-0 left-0 z-30 select-none transition-colors cursor-none text-white dark:text-white"
            style={{cursor:'none'}}
            animate={{ x: docX+10 , y: docY-10 }} // Assuming you want to animate the position
            transition={{ duration: 0.05, ease: "linear" }}
        >
    {(options&&options.mode==="text")&&(<div><LuTextCursor style={style}/></div>)}
    {(options.shape==='line'&&options.mode==="draw")&&(<div><FaPencilAlt style={style}/></div>)}
    {(options.shape==='circle'&&options.mode==="draw")&&(<div><AiOutlinePlus style={style}/></div>)}
    {(options.shape==='rect'&&options.mode==="draw")&&(<div><AiOutlinePlus style={style}/></div>)}
    {(options.shape==='line'&&options.mode==="select")&&(<div><AiOutlinePlus style={style}/></div>)}
    {options.mode==="eraser"&&(<div><BsEraser style={style}/></div>)}
            
        </motion.div>
    );
};
