import React from "react";
import { OrbitControls, Wireframe } from "@react-three/drei";
import { Color } from "three";

export function Experience() : React.ReactNode {

    

    return (<>
  <ambientLight intensity={0.1} />
  <directionalLight color="red" position={[0, 0, 5]} />

        <OrbitControls/>
        <mesh position={[1,0,0]}>
            <torusGeometry/>
            <meshBasicMaterial color="blue" wireframe={true} />
        </mesh>
        
    </>)
}