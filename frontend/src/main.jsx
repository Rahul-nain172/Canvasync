import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { PrimeReactProvider } from "primereact/api";
// index.js or App.js
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true }}>
    <Provider store={store}>
    <App/>
    </Provider>
    </PrimeReactProvider>
  </React.StrictMode>,
)
