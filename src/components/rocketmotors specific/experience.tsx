import React, { useEffect, useState, useRef, Ref } from "react";
import { CameraShake, DragControls, FirstPersonControls, OrbitControls, PivotControls, useGLTF } from "@react-three/drei";
import { Vector3, Mesh, BufferGeometry, Material, Color, WireframeGeometry, MeshStandardMaterial, Euler, MeshBasicMaterial, MeshNormalMaterial } from 'three';
import { getRandomNumber, getRandomVector3 } from "../../utility/random";
import { useThree, useFrame } from "@react-three/fiber";
import { FlyControls } from "three/examples/jsm/Addons.js";
import { KeyFrame } from "../../utility/keyframing";
import { lerpVector3, Vector3toEuler } from "../../utility/math";
import { WireframeMaterial } from "@react-three/drei/materials/WireframeMaterial";

export let setScroll: Function;

const modelUrls: { [key: string]: string } = {
    EndCap: "./3dmodels/endcap.gltf",
    LoadCell: "./3dmodels/loadcell.gltf",
    LoadCellAdapter: "./3dmodels/loadcelladapter.gltf",
    RocketBody: "./3dmodels/rocketbody.gltf",
    TestStand: "./3dmodels/teststand.gltf"
};

const modelRefs: { [key: string]: React.RefObject<Mesh> } = {};

const modelKeyFrames: { [key: string]: { [keyFrames: number]: KeyFrame, sorted?: number[] } } = {
    EndCap: {
        0: new KeyFrame({
            position: new Vector3(0, 0, 4),
            rotation: new Vector3(-90, 0, 0)
        }),
        100: new KeyFrame({
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0)
        }),
    },

    RocketBody: {
        0: new KeyFrame({
            position: new Vector3(0, 0.2, 4),
            rotation: new Vector3(-90, 0, 0)
        }),
        100: new KeyFrame({
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0)
        }),
    },

    LoadCellAdapter: {
        0: new KeyFrame({
            position: new Vector3(0, -0.1, 4),
            rotation: new Vector3(-90, 0, 0)
        }),
        100: new KeyFrame({
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0)
        }),
    }
}

const modelMaterials: { [key: string]: Material } = {
    EndCap: new MeshBasicMaterial({ blendColor: "#ff00ff", wireframe: true })
}

function Experience(): React.ReactNode {

    // scroll offset
    const [offset, setOffset] = useState(0)
    setScroll = setOffset

    // change the position of the camera based on scroling
    const { camera } = useThree()

    console.log(camera.position)

    let ModelsHolder: JSX.Element = Models()


    useEffect(() => {
        // Set the camera position


    }, [offset]);

    useFrame(() => {
        for (const key in modelKeyFrames) {
            let t = KeyFrame.currentKeyFrames(modelKeyFrames[key], offset)

            if (!modelRefs[key] || !modelRefs[key].current) {
                continue
            }



            let div: number = t.nextKey - t.currentKey == 0 ? 1 : t.nextKey - t.currentKey

            modelRefs[key].current.position.copy(lerpVector3(t.current.position, t.next.position, (offset - t.currentKey) / div))
            modelRefs[key].current.rotation.copy(Vector3toEuler(lerpVector3(t.current.rotation, t.next.rotation, (offset - t.currentKey) / div)))


        }
    })



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

        {ModelsHolder}
    </>)
}


function Models(): JSX.Element {
    return (
        <>
            {Object.entries(modelUrls).map(([name, url]) => {
                if (!modelRefs[name]) {
                    modelRefs[name] = useRef<Mesh>(null);
                }

                // Use useGLTF to load the model
                const { scene } = useGLTF(url);


                let mat: Material = new MeshNormalMaterial()

                if (modelMaterials[name]) {
                    mat = modelMaterials[name]
                }

                // Traverse the scene and apply the material to all meshes
                scene.traverse((child) => {
                    if ((child as Mesh).isMesh) {
                        (child as Mesh).material = mat;
                    }
                });

                // Render each model as a primitive
                return (
                    <primitive
                        key={name}
                        object={scene}
                        ref={modelRefs[name]}
                        scale={[10, 10, 10]} // Adjust scale if needed
                    />
                );
            })}
        </>
    );
}

export default Experience