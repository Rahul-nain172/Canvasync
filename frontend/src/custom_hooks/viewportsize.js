import { useEffect,useState } from "react";

export const useViewportsize=()=>{
    const [width,setwidth]=useState(0);
    const [height,setheight]=useState(0);

    useEffect(() => {
        const Resize = () => {
          setwidth(window.innerWidth);
          setheight(window.innerHeight);
        };
    
        window.addEventListener("resize", Resize);
        Resize();
    
        return () => {
          window.removeEventListener("resize", Resize);
        };
      }, []);

      return {width,height};
}