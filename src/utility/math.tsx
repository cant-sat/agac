import {  Euler, Vector3 } from "three";

export function lerp(a : number, b : number, t: number) : number {
    return a + t * (b-a)
}


export function lerpVector3(a : Vector3, b : Vector3, t : number) : Vector3{
    return new Vector3(lerp(a.x, b.x, t),lerp(a.y, b.y, t),lerp(a.z, b.z, t))
}

export function Vector3toEuler(a : Vector3) : Euler{
    return new Euler(DegToRad(a.x), DegToRad(a.y), DegToRad(a.z))
}


export function DegToRad(a : number){
    return a /( 180 / Math.PI)
}