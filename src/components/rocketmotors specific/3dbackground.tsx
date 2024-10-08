import React, { lazy } from "react";
import { Canvas } from "@react-three/fiber"

const Experience = lazy(()=>import("./experience"))


export function Background():React.ReactNode{

    return(<Canvas style={{ height: '100vh' }} className="w-screen min-h-screen overflow-hidden bg-black" shadows>
    <Experience/>
  </Canvas>)
}

export default Background