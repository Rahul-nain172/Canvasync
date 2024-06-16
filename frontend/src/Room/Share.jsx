import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BiCopy } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
export default function Share() {
  const [Share, setShare] = useState(false); // State to toggle share container
  const room=useSelector((state)=>state.room);
  const roomId=room.id;
  const currentUrl = `${window.location.protocol}//${window.location.host}/canvas/${roomId}`;
  const copyToClipboard = () => {
    const shareUrl = currentUrl;

    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;

    // Make the textarea out of view
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select and copy the text inside the textarea
    textarea.select();
    document.execCommand('copy');

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);
    toast.success('Copied the link to clipboard');

  };
  return (
    <>
      <button
        className='btn2 w-24 h-8 rounded-lg cursor-pointer bg-black flex items-center justify-center gap-2 text-white'
        onClick={() => setShare(prev => !prev)}
      >
        <img src="/next.png" alt="share" className='h-6 w-6' />
        <span>Share</span>
      </button>
      <motion.div
        className="share-container absolute flex flex-col items-center left-10 top-40 z-[90] rounded-lg cursor-pointer p-5 bg-white text-black shadow-md cursorr"
        animate={{
          x: -100,
          y: Share ? -100 : 800
        }}
        transition={{
          duration: 0.4,
          ease: [0.6, 0.01, -0.05, 0.9],
        }}
      >
        <span className='font-bold text-xl mb-3'>Share URL</span>
        <div className="flex items-center justify-between w-full bg-gray-100 rounded-lg p-3"  onClick={copyToClipboard}>
          <span className='truncate mr-2'>{currentUrl}</span>
          <button className='h-8 w-8 bg-white flex items-center justify-center cursorr' >
            <BiCopy style={{ height: '20px', width: '20px' }} />
          </button>
        </div>
      </motion.div>
    </>
  );
}
