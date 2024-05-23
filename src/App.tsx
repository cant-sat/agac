import { Canvas } from "@react-three/fiber"
import { Experience } from "./components/experience"


function App(): JSX.Element {


  return (
    <>
      <div className="w-screen min-h-screen overflow-hidden bg-gradient-to-tr from-amber-300 to-amber-800 ">
        <Canvas style={{ height: '100vh' }}>
          <Experience/>
        </Canvas>

      </div>
    </>
  )
}

export default App
