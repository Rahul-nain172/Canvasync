import React, { useRef } from 'react'
import { FaRedo, FaUndo } from "react-icons/fa";
import { useContext } from 'react';
import { roomContext } from '../contexts/roomContext';
import { useSelector } from 'react-redux';

export default function UndoRedo() {
  const {undoRef,redoRef}=useContext(roomContext);
  const room=useSelector((state)=>state.room);
  const savedMoves=useSelector((state)=>state.savedMoves);
  const myMoves=room.myMoves;


    return (
        <>
          <button
            className={`btn-icon text-xl cursorr ${!savedMoves.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            ref={redoRef}
            disabled={!savedMoves.length}
          >
            <FaRedo />
          </button>
          <button
            className={`btn-icon text-xl cursorr ${!myMoves.length? 'opacity-50 cursor-not-allowed' : ''}`}
            ref={undoRef}
            disabled={!myMoves.length}
            
          >
            <FaUndo />
          </button>
        </>
      );
}
