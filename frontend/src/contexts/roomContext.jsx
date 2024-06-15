import { createContext, useRef, useState,useEffect } from "react";
import { useMotionValue } from "framer-motion";

export const roomContext = createContext();
const getStringFromRgba = (rgba) =>
  `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

const RoomContextProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const minimapRef = useRef(null);
  const bgRef = useRef(null);
  const undoRef=useRef(null);
  const redoRef=useRef(null);
  const moveRef=useRef(null);
  const copyRef=useRef(null);
  const deleteRef=useRef(null);
  // const [Context,setContext]=useState(null);
  const [showbgOptions,setshowbgOptions]=useState(false);
  const [Image, setImage] = useState({ base64: "" });
  const [Text,setText]=useState({hasText:false});
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return (
    <roomContext.Provider
    value={{
        x,
        y,
        undoRef,redoRef,
        canvasRef,
        minimapRef,
        bgRef,
        moveRef,copyRef,deleteRef,
        showbgOptions,
        Image,
        Text,
        setText,
        setImage,
        setshowbgOptions
    }}
    >
  {children}
</roomContext.Provider>
  );
};

export default RoomContextProvider;
