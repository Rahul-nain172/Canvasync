import { useEffect, useMemo, useRef, useState } from "react";

import { motion, useMotionValue } from "framer-motion";
import {useViewportsize} from '../custom_hooks/viewportsize';
import { useContext } from "react";
import {roomContext} from "../contexts/roomContext"
import { useSelector,useDispatch } from "react-redux";


export default function MiniMap(props){

    const CANVAS_SIZE={width:4000,height:2000}//added
    const { minimapRef,x,y,canvasRef,bgRef}=useContext(roomContext);
    const bg=useSelector((state)=>state.bg);


    const dragging=props.dragging;
    //x,y->original board coordinates
    const { width, height } = useViewportsize();

    const [x1,setx1]=useState(0);
    const [y1,sety1]=useState(0);
    //x1,y1 minimap coordinates
    const [draggingMinimap, setDraggingMinimap] = useState(false);

  useEffect(()=>{
    const updateMiniCanvas = () => {
      if (canvasRef.current && minimapRef.current && bgRef.current) {
        const smallCtx = minimapRef.current.getContext("2d");
        if (smallCtx) {
          smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
          smallCtx.drawImage(
            bgRef.current,
            0,
            0,
            smallCtx.canvas.width,
            smallCtx.canvas.height
          );
          smallCtx.drawImage(
            canvasRef.current,
            0,
            0,
            smallCtx.canvas.width,
            smallCtx.canvas.height
          );
        }
      }
    };
    updateMiniCanvas();
  },[canvasRef,bgRef,bg])

    useEffect(() => {
        if (!draggingMinimap) {
          const unsubscribe = x.onChange(setx1);
          return unsubscribe;
        }
    
        return () => {};
      }, [x, draggingMinimap]);
    useEffect(() => {
        if (!draggingMinimap) {
          const unsubscribe = y.onChange(sety1);
          return unsubscribe;
        }
    
        return () => {};
    }, [y, draggingMinimap]);



    const containerRef = useRef(null);
    const miniX = useMotionValue(0);
    const miniY = useMotionValue(0);

    
    const divider = useMemo(() => {
        if (width > 1600) return 7;
        if (width > 1000) return 10;
        if (width > 600) return 14;
        return 20;
      }, [width]);
      useEffect(() => {
        miniX.onChange((newX) => {
          if (!dragging) x.set(Math.floor(-newX * divider));
        });
        miniY.onChange((newY) => {
          if (!dragging) y.set(Math.floor(-newY * divider));
        });
    
        return () => {
          miniX.clearListeners();
          miniY.clearListeners();
        };
      }, [x, y, divider, dragging, miniX, miniY]);

    return(
        <div
        className="absolute right-10 top-[3.5rem] z-40 cursorr overflow-hidden rounded-lg shadow-lg "
        style={{
          width: CANVAS_SIZE.width / divider,
          height: CANVAS_SIZE.height / divider,
        }}
        ref={containerRef}
      >
        <canvas
          ref={minimapRef}
          width={CANVAS_SIZE.width}
          height={CANVAS_SIZE.height}
          className="h-full w-full"
        />
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragTransition={{ power: 0, timeConstant: 0 }}
          onDragStart={() => setDraggingMinimap(true)}
          onDragEnd={() => setDraggingMinimap(false)}
          className="absolute top-0 left-0 cursor-grab rounded-lg border-2 border-red-500"
          style={{
            width: width / divider,
            height: height / divider,
            x: miniX,
            y: miniY,
          }}
          animate={{ x: -x1 / divider, y: -y1 / divider }}
          transition={{ duration: 0 }}
        />
      </div>
    )
}

