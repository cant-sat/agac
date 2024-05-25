import React, { useEffect, useState, useRef } from "react";
import { CameraShake } from "@react-three/drei";
import { Vector3, Mesh, BufferGeometry, Material, Color } from 'three';
import { getRandomNumber, getRandomVector3 } from "../utility/random";
import { useThree, useFrame } from "@react-three/fiber";

export let setScroll: Function;

// render the stars
const stars: React.ReactNode = (<>        {Array.from({ length: 300 }, () =>
    star(getRandomVector3(50, 70, true), 0.2, 0.3)
)}</>)

export function Experience(): React.ReactNode {

    // scroll offset
    const [offset, setOffset] = useState(0)
    setScroll = setOffset

    // change the position of the camera based on scroling
    const { camera } = useThree()

    useEffect(() => {
        // Set the camera position
        camera.position.set(0, 0, (offset + 600) / 200); // Adjust the position as needed
    }, [camera, offset]);

    // rotate the torus
    const torusRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)

    // update every frame
    useFrame(() => {
        if (torusRef.current) {
            torusRef.current.rotation.x += 0.01 * ((offset + 500)/1000)
            torusRef.current.rotation.y += 0.01 * ((offset+500)/1000)
        }
    })

    return (<>

        <pointLight color={new Color("#ff00ff")} position={[1, 0.5, 0]} intensity={1} />
        <CameraShake intensity={1} />

        <mesh ref={torusRef} position={[1, 0.5, 0]} >
            <torusGeometry args={[1, 0.2, 3, 20, 20]}/>
            <meshStandardMaterial color="white" />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="white" />
        </mesh>

        {stars}

    </>)
}

function star(pos: Vector3, minSize: number = 0.5, maxSize: number = 0.5): React.ReactNode {


    return (<>
        {/* White Light Emitting Globe */}

        <mesh position={pos}>
            <sphereGeometry args={[getRandomNumber(minSize, maxSize), 32, 32]} />
            <meshBasicMaterial />
        </mesh>
    </>)
}