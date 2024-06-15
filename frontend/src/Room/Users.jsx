import React from 'react'
import { useSelector } from 'react-redux'
export default function Users() {
    const room=useSelector((state)=>state.room);
    const users=[...room.users]
    if(!users||users.length===0)return null;
  return (
    <div className='z-50 absolute flex '>
        {
            users.map((user,ind)=>{
                return(
                <div className='rounded-full h-10 w-10 text-white flex items-center justify-center' style={{backgroundColor:`${user[1].color}`}}>
                {user[1].name[0]}
                </div>
            )}
            )
        }
    </div>
  )
}
