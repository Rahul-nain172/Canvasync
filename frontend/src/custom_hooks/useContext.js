import { useEffect, useState, useContext } from "react";
import { roomContext } from "../contexts/roomContext";
export const useContextt = () => {
    const { canvasRef } = useContext(roomContext);
    const [Context, setContext] = useState(canvasRef.current?.getContext("2d") || null);

    useEffect(() => {
        const newContext = canvasRef.current?.getContext("2d");

        if (newContext) {
            newContext.lineJoin = "round";
            newContext.lineCap = "round";
            setContext(newContext);
        }
        
    }, [canvasRef]);
    
    return Context;
};
