import React, { useContext, useEffect, useState } from 'react';
import { roomContext } from '../contexts/roomContext';
import { motion, useMotionValue } from 'framer-motion';
import {useSelector } from 'react-redux';
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { initialMove } from '../references/initialMove';
import socket from '../../config/socket';

const WriteText = () => {

  const { Text, setText, canvasRef, x, y } = useContext(roomContext);
  const options=useSelector((state)=>state.options);

  const TextX = useMotionValue(Text.x || 0);
  const TextY = useMotionValue(Text.y || 0);
  const [input, setInput] = useState("");
  const width = Text.width || 200;  // Set a default width
  const height = Text.height || 50; // Set a default height
  const getStringFromRgba = (rgba) =>
    `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`; 
  const getPos = (pos, motionValue) => pos - motionValue.get();
  let px,py;
  useEffect(() => {
    if (Text.x) TextX.set(Text.x);
    else TextX.set(0);

    if (Text.y) TextY.set(Text.y);
    else TextY.set(0);
  }, [TextX, TextY, Text.x, Text.y]);
  const placeText = () => {
    const canvas = canvasRef.current;
    const [fx, fy] = [getPos(TextX.get(), x), getPos(TextY.get(), y)];
    const move = {
      ...initialMove,
      path: [[fx, fy]],
      options: {
        ...initialMove.options,
        text:input,
        fontSize:options.fontSize,
        fontColor:options.fontColor,
        selection: null,
        shape: "text",
      },
    };
    socket.emit("draw",move);
    setInput("");
    setText({ ...Text, hasText: false });
  };

  if (!Text.hasText) return null;

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x:TextX, y:TextY}}
    >
      <div className="absolute bottom-full mb-2 flex gap-3">
        <button
          className="rounded-full bg-gray-200 p-2"
          onClick={placeText}
        >
          <AiOutlineCheck />
        </button>
        <button
          className="rounded-full bg-gray-200 p-2"
          onClick={() => {setText({ ...Text, hasText: false });setInput("")}}
        >
          <AiOutlineClose />
        </button>
      </div>
      <textarea
        style={{ 
          width, 
          height, 
          fontSize: `${options.fontSize}px`, 
          color: `${getStringFromRgba(options.fontColor)}`, 
          textDecoration: 'none', 
          outline: 'none', 
          background: 'transparent', 
          boxShadow: 'none'
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="resize-none border border-gray-300 p-1 bg-transparent"
      />
    </motion.div>
  );
};

export default WriteText;
