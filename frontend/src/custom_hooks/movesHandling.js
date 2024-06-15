import { useEffect, useMemo, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../config/socket";
import { roomContext } from "../contexts/roomContext";
import { addMyMove, removeMyMove } from "../redux/room/roomSlice";
import { addSavedMove, removeSavedMove } from "../redux/savedMoves/savedMovesSlice";
import { clearSelection } from "../redux/options/optionSlice";
import { useContextt } from "./useContext";
import { useSelection } from "./selection";
import { useNavigate,useParams } from 'react-router-dom';
const getStringFromRgba = (rgba) =>
    `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

export const useMoveHandler = (clearOnYourMove) => {
    const { canvasRef, minimapRef, bgRef} = useContext(roomContext);
    const Context=useContextt();
    const params=useParams();
    const dispatch = useDispatch();
    const room = useSelector((state) => state.room);
    const savedMoves = useSelector((state) => state.savedMoves);
    let prevMovesLength = 0;
    const navigate=useNavigate();
    useEffect(()=>{
        socket.emit("joinedRoom",(response)=>{
            if(response===false){
                navigate(`/join/${params.roomId}`);
            }
        });
      },[Context]);
    const sortedMovesArr = useMemo(() => {
        const { usersMoves, movesWithoutUser, myMoves } = room;
        const moves = [...movesWithoutUser, ...myMoves];
        usersMoves.forEach((userMoves, userId) => {
            if (Array.isArray(userMoves)) {
              moves.push(...userMoves);
            } else {
            }
          });
        moves.sort((a, b) => a.timestamp - b.timestamp);
        return moves;

    }, [room]);
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

    const drawMove = (move, image) => {
        if(!move){
            return;
        }
        const { path } = move;
        if (!Context || !path.length) return;
        const moveOptions = move.options;
        if (moveOptions.mode === "select"||moveOptions.mode==="text") return;
        Context.lineWidth = moveOptions.lineWidth;
        Context.strokeStyle = getStringFromRgba(moveOptions.lineColor);
        Context.fillStyle = getStringFromRgba(moveOptions.fillColor);
        if (moveOptions.mode === "eraser")
            Context.globalCompositeOperation = "destination-out";
        else Context.globalCompositeOperation = "source-over";
        if (moveOptions.shape === "image" && image)
        {
            Context.drawImage(image, path[0][0], path[0][1]);
        }
        else if(moveOptions.shape==="text"){
            const text=moveOptions.text;
            const fontSize=moveOptions.fontSize;
            const fontColor=getStringFromRgba(moveOptions.fontColor);
            Context.font = `${fontSize}px Arial`;
            Context.fillStyle=fontColor;
            // Context.fillStyle = getStringFromRgba(fontColor);
            const adjustedY = path[0][1] + fontSize;
            Context.fillText(text, path[0][0], adjustedY);

        }
        else if (moveOptions.shape === "line") {
            Context.beginPath();
            path.forEach(([x, y]) => {
                Context.lineTo(x, y);
            });
            Context.stroke();
            Context.closePath();
        } else if (moveOptions.shape === "circle") {
            const { cX, cY, rX, rY } = move.circle;
            Context.beginPath();
            Context.ellipse(cX, cY, rX, rY, 0, 0, 2 * Math.PI);
            Context.stroke();
            Context.fill();
            Context.closePath();
        } else if (moveOptions.shape === "rect") {
            const { width, height } = move.rect;
            Context.beginPath();
            Context.rect(path[0][0], path[0][1], width, height);
            Context.stroke();
            Context.fill();
            Context.closePath();
        }
        updateMiniCanvas();
    };

    const drawAllMoves = async () => {

        if (!Context) return;
        Context.clearRect(0, 0, Context.canvas.width, Context.canvas.height);

        const images = await Promise.all(
            sortedMovesArr
                .filter((move) => move.options.shape === "image")
                .map((move) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = move.img.base64;
                        img.id = move.id;
                        img.addEventListener("load", () => resolve(img));
                    });
                })
        );

        sortedMovesArr.forEach((move) => {
            if (move.options.shape === "image") {
                const img = images.find((image) => image.id === move.id);
                if (img) drawMove(move, img);
            } else drawMove(move);
        });

        updateMiniCanvas();
    };
    useSelection(drawAllMoves);
    useEffect(() => {
        socket.on("your_move", (move) => {
            clearOnYourMove();
            dispatch(addMyMove(move));
            setTimeout(() => dispatch(clearSelection()), 100);
        });

        return () => {
            socket.off("your_move");
        };
    }, [clearOnYourMove, dispatch]);

    useEffect(() => {

        if (prevMovesLength >= sortedMovesArr.length || !prevMovesLength) {
            drawAllMoves();
        } else {
            const lastMove = sortedMovesArr[sortedMovesArr.length - 1];
    
            if (lastMove.options.shape === "image") {
                const img = new Image();
                img.src = lastMove.img.base64;
                img.addEventListener("load", () => drawMove(lastMove, img));
            } else drawMove(lastMove);
        }
        return()=>{
        prevMovesLength = sortedMovesArr.length;}
    }, [sortedMovesArr]);
    

    const handleUndo = () => {
        if (Context) {
            let myMoves = room.myMoves;
            const move = myMoves[myMoves.length - 1];
            dispatch(removeMyMove());

            if (move.options.mode === "select"||move.options.mode==="text") dispatch(clearSelection());
            else if (move) {
                dispatch(addSavedMove(move));
                socket.emit("undo");
            }
        }
    };

    const handleRedo = () => {
        if (Context) {
            const move = savedMoves.at(0);
            dispatch(removeSavedMove());
            if (move) {
                socket.emit("draw", move);
            }
        }
    };

    useEffect(() => {
        const handleUndoRedoKeyboard = (e) => {
            if (e.key === "z" && e.ctrlKey) {
                handleUndo();
            } else if (e.key === "y" && e.ctrlKey) {
                handleRedo();
            }
        };

        document.addEventListener("keydown", handleUndoRedoKeyboard);

        return () => {
            document.removeEventListener("keydown", handleUndoRedoKeyboard);
        };
    }, [handleUndo, handleRedo]);

    return { handleUndo, handleRedo };
};
