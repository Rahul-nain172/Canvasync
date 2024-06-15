import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { AiFillMessage } from "react-icons/ai";
import Chat from './Chatbox';

export default function Chatbox() {
    const [isChat, setisChat] = useState(false);
    return (
        <>
            <button className='btn2 w-24 h-8 rounded-lg cursorr bg-black flex items-center justify-center gap-2' onClick={() => setisChat(!isChat)}><img src="/chat.png" className='h-6 w-6' alt="chaticon"></img>Chat</button>
            <motion.div
                className="absolute  left-10 top-40 z-[60]  rounded-lg cursorr p-5"
                animate={{
                    x: isChat? 300 : 800,
                    y: "-50%",
                }}
                transition={{
                    duration: 0.4,
                    ease: [0.6, 0.01, -0.05, 0.9],
                }}
            >
                <Chat setisChat={setisChat} isChat={isChat} />
            </motion.div>
        </>
    )
}
