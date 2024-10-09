import { Vector3 } from "three";

export class KeyFrame {
    public position: Vector3

    public rotation: Vector3

    public update: Function | undefined


    constructor(parameters: { position: Vector3, rotation: Vector3, update?: Function }) {
        this.position = parameters.position
        this.rotation = parameters.rotation
        this.update = parameters.update
    }

    static currentKeyFrames(keyframes: { [KeyFrame: number]: KeyFrame, sorted?: number[] }, t: number): NeighbouringKeyFrames {

        if(0 > t || 100 < t){
            throw "error, t out of bounds"
        }

        if (!keyframes.sorted) {
            let listOfTimes = []

            for (const key in keyframes) {

                const keyFrameTime = Number(key)

                if(0 > keyFrameTime || 100 < keyFrameTime){
                    throw "keyframe time out of bounds"
                }

                listOfTimes.push(keyFrameTime)

                
            }

            listOfTimes.sort((a, b)=> a-b)

            keyframes.sorted = listOfTimes
        }

        if(keyframes.sorted.length == 0){
            throw "you should not have a lenght of 0 in keyframes"
        }

        if(keyframes.sorted.length == 1){
            return new NeighbouringKeyFrames(keyframes[keyframes.sorted[0]], keyframes[keyframes.sorted[0]])
        }


        let i = 0

        if(keyframes.sorted[keyframes.sorted.length-1] <= t){
            return new NeighbouringKeyFrames(keyframes[keyframes.sorted[keyframes.sorted.length-1]], keyframes[keyframes.sorted[keyframes.sorted.length-1]])
        }
        if(keyframes.sorted[keyframes.sorted.length-1] > t){
            return new NeighbouringKeyFrames(keyframes[keyframes.sorted[0]], keyframes[keyframes.sorted[0]])
        }



        while (i < keyframes.sorted.length){
            if(keyframes.sorted[i] <= t && keyframes.sorted[i+1] > t){
                return new NeighbouringKeyFrames(keyframes[keyframes.sorted[i]], keyframes[keyframes.sorted[i+1]])
            }

            i++
        }

        throw "error in keyframing, this should not happen"


    }
}

class NeighbouringKeyFrames {
    public current: KeyFrame

    public next: KeyFrame


    constructor(cur: KeyFrame, next: KeyFrame) {
        this.current = cur
        this.next = next
    }
}