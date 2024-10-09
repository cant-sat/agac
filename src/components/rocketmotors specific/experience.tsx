import React, { useEffect, useState, useRef, Ref } from "react";
import { CameraShake, DragControls, FirstPersonControls, OrbitControls, PivotControls, useGLTF} from "@react-three/drei";
import { Vector3, Mesh, BufferGeometry, Material, Color, WireframeGeometry, MeshStandardMaterial} from 'three';
import { getRandomNumber, getRandomVector3 } from "../../utility/random";
import { useThree, useFrame } from "@react-three/fiber";
import { FlyControls } from "three/examples/jsm/Addons.js";

export let setScroll: Function;

const modelUrls: { [key: string]: string } = {
    EndCap: "./3dmodels/endcap.gltf",
    LoadCell: "./3dmodels/loadcell.gltf",
    LoadCellAdapter: "./3dmodels/loadcelladapter.gltf",
    RocketBody: "./3dmodels/rocketbody.gltf",
    TestStand: "./3dmodels/teststand.gltf"
};

const modelRefs: { [key: string]: React.RefObject<Mesh> } = {};

const modelKeyFrames : {[key: string] : {[keyFrame: number] : {position : Vector3, rotation : Vector3, update? : Function}}} = {
    EndCap : {
        0   : {position: new Vector3(0,0,0), rotation : new Vector3(0,0,0)},
        100 : {position: new Vector3(0,0,0), rotation : new Vector3(0,0,0)}
    }

}

function Experience(): React.ReactNode {

    // scroll offset
    const [offset, setOffset] = useState(0)
    setScroll = setOffset

    // change the position of the camera based on scroling
    const { camera } = useThree()
    

    useEffect(() => {
        // Set the camera position
        
        
    }, [offset]);

    useFrame(()=>{
        modelKeyFrames
    })



    //GLTF models
    for (const key in modelUrls){
        if(modelUrls[key]){
            
        }
    }

    return (<>

        <pointLight color={new Color("#ff00ff")} position={[1, 0.5, 0]} intensity={1} castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={25}
        />


        <CameraShake intensity={0.3} />


        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial />
        </mesh>

        <Models/>

    </>)
}


function Models(): JSX.Element{
    return (
        <>
            {Object.entries(modelUrls).map(([name, url]) => {
                if (!modelRefs[name]) {
                    modelRefs[name] = useRef<Mesh>(null);
                }

                // Use useGLTF to load the model
                const { scene } = useGLTF(url);




                // Render each model as a primitive
                return (
                    <primitive
                        key={name}
                        object={scene}
                        ref={modelRefs[name]}
                        position={[Math.random() * 10 - 5, 0, Math.random() * 10 - 5]} // Example random positions
                        scale={[10, 10, 10]} // Adjust scale if needed
                        
                    />
                );
            })}
        </>
    );
}

export default Experience