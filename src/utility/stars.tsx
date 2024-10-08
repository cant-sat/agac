import { Vector3 } from "three"
import { getRandomNumber, getRandomVector3 } from "./random"

function star(pos: Vector3, minSize: number = 0.5, maxSize: number = 0.5): React.ReactNode {


    return (<>
        <mesh position={pos}>
            <sphereGeometry args={[getRandomNumber(minSize, maxSize), 32, 32]} />
            <meshBasicMaterial />
        </mesh>
    </>)
}


// render the stars
function Stars(): React.ReactNode {
    return(<>
    
    {Array.from({ length: 300 }, () =>
                star(getRandomVector3(50, 70, true), 0.2, 0.3)
            )}
    </>)
}

export default Stars