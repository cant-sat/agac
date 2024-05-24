import React from "react";
import { Canvas } from "@react-three/fiber"
import { Experience } from "./experience"


export function Background():React.ReactNode{

    return(<Canvas style={{ height: '100vh' }} className="w-screen min-h-screen overflow-hidden bg-gradient-to-tr from-teal-100 to-blue-600 relative">
    <Experience/>
  </Canvas>)
}