import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { roomContext } from '../contexts/roomContext';
import { useContext } from 'react';
import socket from '../../config/socket';
import { FaPencilAlt } from 'react-icons/fa';
import { AiOutlinePlus } from "react-icons/ai";
import { LuTextCursor } from "react-icons/lu";
import { BsEraser } from "react-icons/bs";

export default function OtherMouse({userId,color,userName}) {
    const {x,y}=useContext(roomContext)
    const [x1, setX] = useState(x.get());
    const [y1, setY] = useState(y.get());
    const [pos, setPos] = useState({ x: -1, y: -1 });
    const [shape,setShape]=useState('line');
    const [Mode,setMode]=useState('draw')
    const style={ color: 'black', fontSize: '18px' };
    useEffect(()=>{
        socket.on("mouseMoved", (newX, newY, shape,move,socketIdMoved) => {
            if (socketIdMoved === userId) {
              setPos({ x: newX, y: newY });
              setShape(shape);
              setModee(move);
            }
          });
          return () => {
            socket.off("mouse_moved");
          }
    },[userId])
    useEffect(() => {
        const unsubscribe = x.onChange(setX);
        return unsubscribe;
      }, [x]);
    
      useEffect(() => {
        const unsubscribe = y.onChange(setY);
        return unsubscribe;
      }, [y]);
  return (
    <motion.div
      className={`pointer-events-none absolute top-0 left-0 z-[40] text-blue-800 ${
        pos.x === -1 && "hidden"
      }`}
      style={{ color:color}}
      animate={{ x: pos.x + x1, y: pos.y + y1 }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
    {(shape==='text'&&Mode==="text")&&(<div><LuTextCursor style={style}/>{userName}</div>)}
    {(shape==='line'&&Mode==="draw")&&(<div><FaPencilAlt style={style}/>{userName}</div>)}
    {(shape==='circle'&&Mode==="draw")&&(<div><AiOutlinePlus style={style}/>{userName}</div>)}
    {(shape==='rect'&&Mode==="draw")&&(<div><AiOutlinePlus style={style}/>{userName}</div>)}
    {(shape==='line'&&Mode==="select")&&(<div><AiOutlinePlus style={style}/>{userName}</div>)}
    {Mode==="eraser"&&(<div><BsEraser style={style}/>{userName}</div>)}
    </motion.div>
  )
}
