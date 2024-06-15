import React from 'react'
import socket from '../../config/socket';
import { useSelector } from 'react-redux'
import OtherMouse from './OtherMouse';
export default function RenderMouses() {
  const room=useSelector((state)=>state.room);
  const users=room.users;
  return (
    <>
      {[...users.keys()].map((userId) => {
        if (userId === socket.id) return null;
        return <OtherMouse userId={userId} color={users.get(userId).color} userName={users.get(userId).name} key={userId} />;
      })}
    </>
  )
}
