import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineClose } from "react-icons/ai";
import { setBg } from '../redux/background/backgroundSlice'
import { useContext } from 'react';
import { roomContext } from '../contexts/roomContext';
export default function SelectBackground() {
    const dispatch = useDispatch();
    const bg = useSelector((state) => state.bg);
    const {setshowbgOptions}=useContext(roomContext);
    const renderBg = (ref,mode,lines) => {
        const ctx = ref?.getContext("2d");
        if (ctx) {
          ctx.fillStyle = mode === "dark" ? "#222" : "#fff";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
          if (lines) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = mode === "dark" ? "#444" : "#ddd";
            for (let i = 0; i < ctx.canvas.height; i += 40) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(ctx.canvas.width, i);
              ctx.stroke();
            }
    
            for (let i = 0; i < ctx.canvas.width; i += 40) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, ctx.canvas.height);
              ctx.stroke();
            }
          }
        }
      };
    return (
        <div className=" relative flex flex-col items-center rounded-md bg-white p-10 w-full h-full text-black cursorr">
            <button className="absolute top-5 right-5 text-black" onClick={()=>setshowbgOptions(prev=>!prev)}>
                <AiOutlineClose />
            </button>
            <h2 className="mb-4 text-2xl font-bold text-black">Choose background</h2>
            <div className="grid gap-5 sm:grid-cols-2">
            <canvas
            className="h-48 w-64 cursorr rounded-md border-2"
            tabIndex={0}
            width={256}
            height={192}
            onClick={() => dispatch(setBg({mode:"light", lines:false}))}
             ref={(ref) => renderBg(ref, "light", false)}
            />
            <canvas
            className="h-48 w-64 cursorr rounded-md border-2"
            tabIndex={0}
            width={256}
            height={192}
            onClick={() => dispatch(setBg({mode:"dark", lines:false}))}
             ref={(ref) => renderBg(ref, "dark", false)}
            />
            <canvas
            className="h-48 w-64 cursorr rounded-md border-2"
            tabIndex={0}
            width={256}
            height={192}
            onClick={() => dispatch(setBg({mode:"light" , lines:true}))}
             ref={(ref) => renderBg(ref, "light", true)}
            />
            <canvas
            className="h-48 w-64 cursorrrounded-md border-2"
            tabIndex={0}
            width={256}
            height={192}
            onClick={() => dispatch(setBg({mode: "dark", lines: true}))}
             ref={(ref) => renderBg(ref, "dark", true)}
            />
            </div>
        </div>
    )
}
