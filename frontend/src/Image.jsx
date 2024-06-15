import React ,{useContext,useEffect, useState} from 'react'
import {initialMove} from "./references/initialMove"
import { roomContext } from './contexts/roomContext'
import { motion,useMotionValue } from 'framer-motion'
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import socket from "../config/socket"


export default function Image() {
    const {Image,setImage,x,y,canvasRef}=useContext(roomContext);
    const getPos = (pos, motionValue) =>pos - motionValue.get();
    const imageX = useMotionValue(Image.x || 50);
    const imageY = useMotionValue(Image.y || 50);
    useEffect(() => {
        if (Image.x) imageX.set(Image.x);
        else imageX.set(50);
        if (Image.y) imageY.set(Image.y);
        else imageY.set(50);
      }, [imageX, imageY, Image.x, Image.y]);

      const placeImage = () => {
        const [finalX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];
    
        const move = {
          ...initialMove,
          img: { base64: Image.base64 },
          path: [[finalX, finalY]],
          options: {
            ...initialMove.options,
            selection: null,
            shape: "image",
          },
        };
    
        socket.emit("draw", move);
    
        setImage({ base64: "" });
        imageX.set(50);
        imageY.set(50);
      };
    
      if (!Image.base64) return null;
      return (
        <motion.div
          drag
          dragConstraints={canvasRef}
          dragElastic={0}
          dragTransition={{ power: 0.03, timeConstant: 50 }}
          className="absolute top-0 z-20 cursor-grab"
          style={{ x: imageX, y: imageY }}
        >
          <div className="absolute bottom-full mb-2 flex gap-3">
            <button
              className="rounded-full bg-gray-200 p-2"
              onClick={placeImage}
            >
              <AiOutlineCheck />
            </button>
            <button
              className="rounded-full bg-gray-200 p-2"
              onClick={() => setImage({ base64: "" })}//for deletion of Image
            >
              <AiOutlineClose />
            </button>
          </div>
          <img 
            className="pointer-events-none  cursor-pointer"
            alt="image to place"
            src={Image.base64}
            
          />
        </motion.div>
      );
};

