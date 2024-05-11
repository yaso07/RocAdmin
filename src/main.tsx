import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes.tsx'
import { Provider } from 'react-redux'
import store from './api/store.ts'

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer position="top-center" />
      <RouterProvider router={routes}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
