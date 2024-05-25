import React, { useEffect, useState } from "react";
import { CameraShake} from "@react-three/drei";
import { Vector3 } from "three";
import { getRandomNumber, getRandomVector3 } from "../utility/random";
import { useThree } from "@react-three/fiber";

export let setScroll : Function;

const stars : React.ReactNode = (<>        {Array.from({length: 300}, () =>
                
star(getRandomVector3(30, 40, true), 0.1, 0.2)
)}</>)

export function Experience(): React.ReactNode {

    const [offset, setOffset] = useState(0)
    setScroll = setOffset

    const {camera} = useThree()

    useEffect(() => {
        // Set the camera position
        camera.position.set(0, 0, (offset +1000) / 1000); // Adjust the position as needed
    }, [camera, offset]);

    return (<>

        <pointLight color="red" position={[1, 0, 0]}  intensity={1} />
        <CameraShake intensity={1}/>
        
        <mesh position={[1, 0, 0]}>
            <torusGeometry />
            <meshStandardMaterial  color="white" />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="white" />
        </mesh>

        {stars}

    </>)
}

function star(pos : Vector3, minSize : number = 0.5, maxSize : number = 0.5) : React.ReactNode {


    return (<>
    {/* White Light Emitting Globe */}
        
            <mesh position={pos}>
                <sphereGeometry args={[getRandomNumber(minSize, maxSize), 32, 32]} />
                <meshBasicMaterial/>
            </mesh>
    </>)
}