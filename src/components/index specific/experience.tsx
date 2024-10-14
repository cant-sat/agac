import React, { useEffect, useState, useRef } from "react";
import { CameraShake,} from "@react-three/drei";
import { Mesh, BufferGeometry, Material, Color} from 'three';
import { useThree, useFrame } from "@react-three/fiber";
import Stars from "../../utility/stars";

export let setScroll: Function;


const StarryBackground = (<Stars/>)

function Experience(): React.ReactNode {

    // scroll offset
    const [offset, setOffset] = useState(0)
    setScroll = setOffset

    // change the position of the camera based on scroling
    const { camera } = useThree()
    camera.position.set(0, 0, (offset + 600) / 200)
    

    useEffect(() => {
        // Set the camera position
        camera.position.set(0, 0, (offset + 600) / 200); // Adjust the position as needed
        
    }, [camera, offset]);

    // rotate the torus
    const torusRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)

    // update every frame
    useFrame(() => {
        if (torusRef.current) {
            torusRef.current.rotation.x += 0.01 * ((offset + 500) / 1000)
            torusRef.current.rotation.y += 0.01 * ((offset + 500) / 1000)
        }
    })

    return (<>

        <pointLight color={new Color("#ff00ff")} position={[1, 0.5, 0]} intensity={1} castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={25}
        />


        <CameraShake intensity={0.8} />

        <mesh ref={torusRef} position={[1, 0.5, 0]} castShadow>
            <torusGeometry args={[1, 0.2, 3, 20, 20]} />
            <meshStandardMaterial />
        </mesh>


        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial />
        </mesh>



        {StarryBackground}

    </>)
}



export default Experience