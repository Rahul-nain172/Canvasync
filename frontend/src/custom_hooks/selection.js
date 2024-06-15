

// import { toast } from "react-toastify";
import { initialMove } from "../references/initialMove";
import socket from "../../config/socket";
import { useSelector,useDispatch } from "react-redux";
import { useContextt } from "./useContext";
import { roomContext } from "../contexts/roomContext";
import {useContext,useEffect,useMemo } from "react";
import { clearSelection } from "../redux/options/optionSlice";

let tempSelection = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const useSelection = (drawAllMoves) => {
  const Context = useContextt();
  const options = useSelector((state)=>state.options);
  const mode=options.mode;
  const dispatch=useDispatch();
  const { selection } = options;
  const { bgRef, copyRef,moveRef,deleteRef,setImage,setText } = useContext(roomContext);

  useEffect(() => {
    const callback = async () => {
      if (Context && selection) {
        await drawAllMoves();
        if(mode==="text"){
          let { x, y, width, height } = dimension;
          if(width<0)x+=width;
          if(height<0)y+=height;
          width=Math.abs(width);
          height=Math.abs(height);

          
          setText({hasText:true,x,y,width,height});
          dispatch(clearSelection());
        }
        if(mode==="select"){
        setTimeout(() => {
          const { x, y, width, height } = selection;

          Context.lineWidth = 2;
          Context.strokeStyle = "#000";
          Context.setLineDash([5, 10]);
          Context.globalCompositeOperation = "source-over";

          Context.beginPath();
          Context.rect(x, y, width, height);
          Context.stroke();
          Context.closePath();

          Context.setLineDash([]);
        }, 10);
      }
      }
    };

    if (
      tempSelection.width !== selection?.width ||
      tempSelection.height !== selection?.height ||
      tempSelection.x !== selection?.x ||
      tempSelection.y !== selection?.y
    )
      callback();

    return () => {
      if (selection) tempSelection = selection;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, Context]);

  const dimension = useMemo(() => {
    if (selection) {
      let { x, y, width, height } = selection;

      if (width < 0) {
        width += 4;
        x -= 2;
      } else {
        width -= 4;
        x += 2;
      }
      if (height < 0) {
        height += 4;
        y -= 2;
      } else {
        height -= 4;
        y += 2;
      }

      return { x, y, width, height };
    }

    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };
  }, [selection]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const makeBlob = async (withBg) => {
    if (!selection||mode!=="select") return null;

    const { x, y, width, height } = dimension;

    const imageData = Context?.getImageData(x, y, width, height);

    if (imageData) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const tempCtx = canvas.getContext("2d");

      if (tempCtx && bgRef.current) {
        const bgImage = bgRef.current
          .getContext("2d")
          ?.getImageData(x, y, width, height);

        if (bgImage && withBg) tempCtx.putImageData(bgImage, 0, 0);

        const sTempCtx = tempCanvas.getContext("2d");
        sTempCtx?.putImageData(imageData, 0, 0);

        tempCtx.drawImage(tempCanvas, 0, 0);

        const blob =await new Promise((resolve) => {
          canvas.toBlob((blobGenerated) => {
            if (blobGenerated) resolve(blobGenerated);
          });
        });

        return blob;
      }
    }

    return null;
  };
  const createDeleteMove = () => {
  
    if (!selection ||mode!=="select") return null;
    let { x, y, width, height } = dimension;

    if (width < 0) {// changing  height and width back to the original one
      width += 4;
      x -= 2;
    } else {
      width -= 4;
      x += 2;
    }
    if (height < 0) {
      height += 4;
      y -= 2;
    } else {
      height -= 4;
      y += 2;
    }

    const move= {
      ...initialMove,
      rect: {
        width,
        height,
      },
      path: [[x, y]],
      options: {
        ...options,
        shape: "rect",
        mode: "eraser",
        fillColor: { r: 0, g: 0, b: 0, a: 1 },
      },
    };

    socket.emit("draw", move);
    return move;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCopy = async () => {
    if(mode!=="select")return;
    const blob = await makeBlob(true);
    try{
        if(blob){
            await navigator.clipboard.write([new ClipboardItem({"image/png": blob})]);
        }
    }
    catch(error){
        
    }
  };

  useEffect(() => {
    const handleSelection = async (e) => {
      if (e.key === "c" && e.ctrlKey) handleCopy();
      if (e.key === "Delete" && selection) createDeleteMove();
    };
    if(mode==="select")
    document.addEventListener("keydown", handleSelection);

    return () => {
      if(mode==="select")
      document.removeEventListener("keydown", handleSelection);
    };
  }, [bgRef, createDeleteMove, Context, handleCopy, makeBlob, options, selection]);

  useEffect(() => {
    const handleSelectionMove = async () => {
      if (selection&&mode==="select") {
        const blob = await makeBlob();
        if (!blob) return;

        const { x, y, width, height } = dimension;

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener("loadend", () => {
          const base64 = reader.result?.toString();

          if (base64) {
            createDeleteMove();
            setImage({
              base64,
              x: Math.min(x, x + width),
              y: Math.min(y, y + height),
            });
          }
        });
      }
    };

    if (copyRef.current&&mode==="select") {
      const moveBtn = moveRef.current;
      const copyBtn = copyRef.current;
      const deleteBtn = deleteRef.current;

      moveBtn.addEventListener("click", handleSelectionMove);
      copyBtn.addEventListener("click", handleCopy);
      deleteBtn.addEventListener("click", createDeleteMove);

      return () => {
        moveBtn?.removeEventListener("click", handleSelectionMove);
        copyBtn?.removeEventListener("click", handleCopy);
        deleteBtn?.removeEventListener("click", createDeleteMove);
      };
    }

    return () => {};
  }, [createDeleteMove,dimension,handleCopy,makeBlob,selection,copyRef,moveRef,deleteRef,setImage,
    ]);
};
