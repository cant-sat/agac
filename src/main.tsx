import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/Index.tsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import DataProcessor from './pages/DataProcessor.tsx'
import RocketMotors from './pages/RocketMotors.tsx'
import Rockets from './pages/Rockets.tsx'

const router = createHashRouter([{
  path: "/",
  element: (<Index/>),
  errorElement: (<div className='text-white'>404</div>)
},{
  path: "/dataProcessor",
  element: (<DataProcessor/>)
},{
  path: "/rocketmotors",
  element: (<RocketMotors/>)
},{
  path: "/rockets",
  element: (<Rockets/>)
}])




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
) 

