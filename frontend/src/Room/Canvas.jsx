import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from "framer-motion";
import { useDraw } from '../custom_hooks/drawing';
import Chat from './Chatbox';
import { useNavigate } from 'react-router-dom';
import { useViewportsize } from '../custom_hooks/viewportsize';
import { roomContext } from '../contexts/roomContext';
import { useSelector, useDispatch } from 'react-redux';
import { useMoveHandler } from '../custom_hooks/movesHandling';
import { drawFromSocket } from '../custom_hooks/drawFromsocket';
import MiniMap from './MiniMap';
import Toolbox from '../Toolbox/Toolbox';
import Bg from './Bg';
import Chatbox from './Chat';
import Share from './Share';
import { BsArrowsMove } from 'react-icons/bs';
import socket from '../../config/socket';

function Canvas() {
  const options = useSelector((state) => state.options);
  const CANVAS_SIZE = { width: 4000, height: 2000 };
  const [dragging, setDragging] = useState(true);
  const { x, y, canvasRef, undoRef, redoRef,bgRef } = useContext(roomContext);
  const { width, height } = useViewportsize();
  const { startDrawing, endDrawing, Drawing, isDrawing, clearOnYourMove } = useDraw(dragging);
  const { handleUndo, handleRedo } = useMoveHandler(clearOnYourMove);
  const navigate=useNavigate();
  const ref = useRef(null);


  const download=()=>{
    const canvas = document.createElement("canvas");
    canvas.width = 4000;
    canvas.height = 2000;
    const tempContext = canvas.getContext("2d");

    if (tempContext && canvasRef.current && bgRef.current) {
      tempContext.drawImage(bgRef.current, 0, 0);
      tempContext.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click()
  }
  const leaveRoom=()=>{
    socket.emit('leaveRoom');
    navigate('/');
  }
  useEffect(() => {
    setDragging(false);
  }, [])
  drawFromSocket(isDrawing);

  useEffect(() => {
    const handleKey = (e) => {
      setDragging(e.ctrlKey);
    };

    window.addEventListener("keyup", handleKey);
    window.addEventListener("keydown", handleKey);

    const undoBtn = undoRef.current;
    const redoBtn = redoRef.current;

    undoBtn?.addEventListener("click", handleUndo);
    redoBtn?.addEventListener("click", handleRedo);

    return () => {
      window.removeEventListener("keyup", handleKey);
      window.removeEventListener("keydown", handleKey);
      undoBtn?.removeEventListener("click", handleUndo);
      redoBtn?.removeEventListener("click", handleRedo);
    };
  }, [canvasRef, handleRedo, handleUndo, redoRef, undoRef]);

  return (
    <div className="relative h-full w-full overflow-hidden cursorr" >
<div className='flex absolute top-[10px] -right-[-10px] z-[100] gap-8 text-center text-white'>
  <div>
    <button onClick={download} className='btn2 w-32 h-8 rounded-lg cursorr bg-black flex items-center justify-center gap-2'>
      <img src="/download.png" alt="download" className='h-6 w-6' />
      <span>Download</span>
    </button>
  </div>
  <div>
    <Share/>
  </div>
  <div><Chatbox /></div>
</div>


      {!canvasRef ? null : (
        <motion.canvas
          ref={canvasRef}
          width={CANVAS_SIZE.width}
          height={CANVAS_SIZE.height}
          className={`absolute top-0 z-10  ${dragging ? "cursor-move" : "cursor-none"}`}
          style={{ x, y }}
          drag={dragging}
          dragConstraints={{
            left: -(CANVAS_SIZE.width - width),
            right: 0,
            top: -(CANVAS_SIZE.height - height),
            bottom: 0,
          }}
          dragElastic={0}
          dragTransition={{ power: 0, timeConstant: 0 }}
          onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
          onMouseUp={endDrawing}
          onMouseMove={(e) => Drawing(e.clientX, e.clientY, e.shiftKey)}
          onTouchStart={(e) =>
            startDrawing(
              e.changedTouches[0].clientX,
              e.changedTouches[0].clientY
            )
          }
          onTouchEnd={endDrawing}
          onTouchMove={(e) =>
            Drawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
          }
        />
      )}
      <Toolbox />
      <Bg />
      <MiniMap dragging={dragging} />
      <div className='flex flex-row absolute bottom-14 gap-7 right-5 z-10 md:bottom-5 cursorr'>
        <div>
          <button
            className={`btn-icon h-12 w-12 cursorr ${dragging ? "bg-green-500" : "bg-black text-black"
              } p-3 text-lg text-white`}
            onClick={() => setDragging((prev) => !prev)}
          >
            <BsArrowsMove/>
          </button>
        </div>
        <div>
        <button className='btn-icon h-12 w-12 cursorr' onClick={leaveRoom}>
          <img className='object-contain bottom-0' src="/logout.png" alt="" />
        </button>
      </div>
    </div>
    </div >

  );
}

export default Canvas;