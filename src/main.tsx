import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from './components/loading.tsx'
import PropellantCalculator from './pages/PropellantCalculator.tsx'

// Lazy load components
const Index = lazy(() => import('./pages/Index.tsx'))
const DataProcessor = lazy(() => import('./pages/DataProcessor.tsx'))
const RocketMotors = lazy(() => import('./pages/RocketMotors.tsx'))
const Rockets = lazy(() => import('./pages/Rockets.tsx'))

const router = createHashRouter([{
  path: "/",
  element: (<Index/>),
  errorElement: (<div className='text-white'>404</div>)
},{
  path: "/dataProcessor",
  element: (<DataProcessor/>)
},{
  path: "/rocketMotors",
  element: (<RocketMotors/>)
},{
  path: "/rockets",
  element: (<Rockets/>)
},{
  path: "/propellantCalculator",
  element: (<PropellantCalculator/>)
}])



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={(<Loading/>)}>
      <RouterProvider router={router}/>
    </Suspense>
  </React.StrictMode>,
) 

