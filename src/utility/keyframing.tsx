import { Vector3 } from "three";

class KeyFrame {
    public position : Vector3

    public rotation : Vector3

    public update : Function | undefined


    constructor(pos : Vector3, rot : Vector3, update? : Function){
        this.position = pos
        this.rotation = rot
        this.update = update
    }
}