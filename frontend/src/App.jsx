import React, { useEffect } from 'react'
import Form from './forms/form'
import Room from './Room/Room'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import JoinRoom from './forms/JoinRoom'
export default function App() {
  const BrowserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Form />,
    },
    {
      path: '/canvas/:roomId',
      element: <Room />,
    },
    {
      path: '/join/:roomId',
      element: <JoinRoom />
    }
  ])
  return (
    <>
      <RouterProvider router={BrowserRouter} />
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"/>
    </>
  )
}
