import {motion} from "framer-motion";
import { useSelector,useDispatch } from "react-redux";
import { useContext } from "react";
import { roomContext } from "../contexts/roomContext";
import { useEffect } from "react";


export default function Bg() {
    const bg=useSelector((state)=>state.bg);
    const {x,y,bgRef}=useContext(roomContext);
    const CANVAS_SIZE={width:4000,height:2000}//added

    useEffect(() => {
        const root = window.document.documentElement;
        if (bg.mode === "dark") {
          root.classList.remove("light");
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
          root.classList.add("light");
        }
      }, [bg.mode]);
      useEffect(() => {
        const ctx = bgRef.current?.getContext("2d");
    
        if (ctx) {
          ctx.fillStyle = bg.mode === "dark" ? "#222" : "#fff";
          ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    
          document.body.style.backgroundColor =
            bg.mode === "dark" ? "#222" : "#fff";
    
          if (bg.lines) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = bg.mode === "dark" ? "#444" : "#ddd";
            for (let i = 0; i < CANVAS_SIZE.height; i += 100) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(ctx.canvas.width, i);
              ctx.stroke();
            }
    
            for (let i = 0; i < CANVAS_SIZE.width; i +=100) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, ctx.canvas.height);
              ctx.stroke();
            }
          }
        }
      }, [bgRef, bg]);
      return (
        <motion.canvas
          ref={bgRef}
        
          width={CANVAS_SIZE.width}
          height={CANVAS_SIZE.height}
          className="absolute top-0 bg-zinc-100 "
          style={{ x, y }}
        />
      );
}

