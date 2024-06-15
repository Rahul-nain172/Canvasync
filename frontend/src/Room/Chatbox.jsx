import React, { useRef, useState, useEffect } from 'react';
import socket from '../../config/socket';

export default function Chat(props) {
  const [Input, setInput] = useState("");
  const [MessageList, setMessageList] = useState([]);
  const chatBoxRef = useRef(null);

  const sendMessage = () => {
    socket.emit('sendMessage', Input);
    setMessageList(prev => [...prev, { name: 'You', message: Input }]);
    setInput("");
  };

  useEffect(() => {
    const addMessage = (userName, message) => {
      setMessageList(prev => [...prev, { name: userName, message }]);
    };
    socket.on("newMessage", addMessage);
    return () => {
      socket.off("newMessage", addMessage);
    };
  }, []);

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [MessageList]);



  return (
    <div className='bg-zinc-200 z-50 absolute flex flex-col w-96 h-[30rem] rounded-xl border-4 border-black right-[18px] top-[52px] shadow-lg'>
      <div className='w-full h-12 flex items-center bg-black rounded-t-lg'>
        <span><img className="h-10 w-10 ml-2" src="/meetme.png" alt="Logo" /></span>
        <span className='text-white pl-4 text-lg font-semibold'>Message Box</span>
      </div>

      {/* text-area */}
      <div ref={chatBoxRef} className='flex-1 overflow-y-auto p-4 bg-white rounded-b-lg'>
        {MessageList.map((msg, ind) => (
          <div key={ind} className={`mb-2 p-3 rounded-lg shadow-md ${msg.name === 'You' ? 'bg-blue-500 text-white self-end text-right' : 'bg-gray-300 self-start text-left'}`}>
            <span className='font-bold'>{msg.name}</span>: <span>{msg.message}</span>
          </div>
        ))}
      </div>

      {/* send area */}
      <div className='flex items-center p-3 border-t border-black bg-white rounded-b-lg'>
        <input
          type="text"
          className='flex-1 rounded-lg border border-gray-300 text-black px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
          value={Input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <img
          onClick={sendMessage}
          src='/paper-plane.png'
          className='h-[40px] w-[40px] cursor-pointer hover:opacity-80 transition duration-150 ease-in-out'
          alt="Send"
        />
      </div>
    </div>
  );
}
