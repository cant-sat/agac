import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/Index.tsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'

const router = createHashRouter([{
  path: "/",
  element: (<Index/>),
  errorElement: (<div className='text-white'>404</div>)
},{
  path: "/dataProcessor",
  element: (<div className='text-white'>data</div>)

}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
  </React.StrictMode>,
) 




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
) 

