import React from "react";
import { OrbitControls } from "@react-three/drei";

export function Experience() : React.ReactNode {

    return (<>
        <OrbitControls/>
        <mesh>
            <boxGeometry/>
            <meshNormalMaterial/>
        </mesh>
    </>)
}