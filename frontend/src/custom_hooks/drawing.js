import { useState } from "react";
import { useContext } from "react";
import { roomContext } from "../contexts/roomContext";
import socket from '../../config/socket';
import {initialMove} from '../references/initialMove'
import { useSelector, useDispatch } from 'react-redux'
import { drawCircle,drawLine,drawRect, } from "../helper/helper";
import { changeSelection,clearSelection } from "../redux/options/optionSlice";
import { clearSavedMoves } from "../redux/savedMoves/savedMovesSlice";
import { addMyMove } from "../redux/room/roomSlice";
import { useContextt } from "./useContext";

//some required functions
const getPos = (pos, motionValue) => {
    return pos - motionValue.get();
}
const getStringFromRgba = (rgba) =>
    `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;



//moves will be store here for temporary basis
let tempMoves = [];
let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempImageData;

export const useDraw = (dragging) => {
    const { x, y } = useContext(roomContext);
    const Context=useContextt();
    const dispatch=useDispatch();

    const movedX = x, movedY = y;//initially kaha se shuru krna

    const options = useSelector((state) => state.options);
    const savedMoves=useSelector((state)=>state.savedMoves);
    const room=useSelector((state)=>state.room);
    const [isDrawing, setisDrawing] = useState(false);


    const drawAndSet = () => {
        //save state
        if (!tempImageData)
          tempImageData = Context?.getImageData(
            0,
            0,
            Context.canvas.width,
            Context.canvas.height
          );
          //restore state
        Context?.putImageData(tempImageData, 0, 0);
      };
      const setupCtxOptions = () => {
        if (Context) {
          Context.lineWidth = options.lineWidth;
          Context.strokeStyle = getStringFromRgba(options.lineColor);
          Context.fillStyle = getStringFromRgba(options.fillColor);
          if (options.mode === "eraser")
            Context.globalCompositeOperation = "destination-out";
          else Context.globalCompositeOperation = "source-over";
        }
      };
    const startDrawing = (x, y) => {
        if (!Context||dragging) return;
        const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];
        setupCtxOptions();
        setisDrawing(true);
        drawAndSet();
        if (options.shape === "line" && options.mode !== "select" &&options.mode!=="text") {
            Context.beginPath();
            Context.lineTo(finalX, finalY);
            Context.stroke();
          }
      
          tempMoves.push([finalX, finalY]);

    }
    const Drawing = (x, y, shift) => {
        if (!Context || !isDrawing||dragging) return;
        const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

        drawAndSet();
        if(options.mode==="select"||options.mode==="text"){
            Context.fillStyle="rgba(0,0,0,0.2)";
            drawRect(Context,tempMoves[0],finalX,finalY,false,true);
            tempMoves.push([finalX, finalY]);
            setupCtxOptions();
            return;
        }
        if(options.shape==="line"){
            if (shift) tempMoves = tempMoves.slice(0, 1);
            drawLine(Context,tempMoves[0],finalX,finalY,shift);
            tempMoves.push([finalX, finalY]);
        }
        else if(options.shape==="rect"){
            tempSize=drawRect(Context,tempMoves[0],finalX,finalY,shift);
        }
        else{
            tempCircle=drawCircle(Context,tempMoves[0],finalX,finalY,shift);
        }
    }
        const clearOnYourMove = () => {
        drawAndSet();
        tempImageData = undefined;
      };
    const endDrawing = () => {
        if (!Context||!Drawing||dragging) return;
        setisDrawing(false);
        Context.closePath();
        let addMove = true;
        if ((options.mode === "select"||options.mode==="text") && tempMoves.length) {
          clearOnYourMove();
          let x = tempMoves[0][0];
          let y = tempMoves[0][1];
          let width = tempMoves[tempMoves.length - 1][0] - x;
          let height = tempMoves[tempMoves.length - 1][1] - y;
    
          if (width < 0) {
            width -= 4;//ensuring abs(selectionwidth) > 4+abs(originalwidth)
            x += 2;
          } else {
            width += 4;
            x -= 2;
          }
          if (height < 0) {//ensuring abs(selectionheight) > 4+abs(originalheight)
            height -= 4;
            y += 2;
          } else {
            height += 4;
            y -= 2;
          }
    
          if ((width < 4 || width > 4) && (height < 4 || height > 4))
            dispatch(changeSelection({ x, y, width, height }));
          else {
            dispatch(clearSelection());
            addMove = false;
          }
        }
        const move = {
            ...initialMove,
            rect: {
              ...tempSize,
            },
            circle: {
              ...tempCircle,
            },
            path: tempMoves,
            options,
          };
        tempMoves=[];
        tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
        tempSize = { width: 0, height: 0 };
        tempImageData=undefined;
        if (options.mode !== "select"&&options.mode!=="text") {
            socket.emit("draw", move);
            dispatch(clearSavedMoves());
          } 
          else if (addMove){
            dispatch(addMyMove(move));
          }
    }
    return {
        startDrawing, endDrawing, Drawing, isDrawing,clearOnYourMove
    }
}


