import React from 'react'
import { AiOutlineDelete } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { roomContext } from '../contexts/roomContext';
export default function SelectionButtons() {
    const { moveRef, copyRef, deleteRef } = useContext(roomContext);
    const options = useSelector((state) => state.options);
    const selection = options.selection;
    let pos = { top: -40, left: -40 };
    if (selection) {
        const { x, y, width, height } = selection;
        pos.top = Math.min(y, y + height) - 40;
        pos.left = Math.min(x, x + width);
    }
    if(options.mode==="text")return;
    return (
        <div
            className="absolute top-0 left-0 z-50 flex items-center justify-center gap-2"
            style={pos}
        >
            <button
                className="rounded-full bg-gray-200 p-2"
                ref={moveRef}
            >
                <BsArrowsMove />
            </button>
            <button
                className="rounded-full bg-gray-200 p-2"
                ref={copyRef}
            >
                <FiCopy />
            </button>
            <button
                className="rounded-full bg-gray-200 p-2"
                ref={deleteRef}
            >
                <AiOutlineDelete />
            </button>
        </div>
    );
}
