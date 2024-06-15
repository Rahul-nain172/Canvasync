import { CgScreen } from "react-icons/cg";
import { useRef, useState } from "react";
import { roomContext } from "../contexts/roomContext";
import { useContext } from "react";
import { useClickAway } from "react-use";
import SelectBackground from "../Room/SelectBackground";

export default function PickBackground() {
  const {showbgOptions,setshowbgOptions}=useContext(roomContext);
  const ref = useRef();
  useClickAway(ref, () => setshowbgOptions(false));
  return (
    <div className="relative flex items-center cursorr"  ref={ref}>
      <button className='btn-icon cursorr' onClick={() => {setshowbgOptions(prev =>!prev)}}
      >
        <CgScreen />

      </button>
      {showbgOptions &&
        <div className="fixed inset-0 cursorr bg-white left-40 bg-opacity-50 z-50 w-[1000px] h-[800px] shadow-xl">
          <SelectBackground />
        </div>
      }
    </div>
  )
}
