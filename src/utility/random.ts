import { Vector3 } from "three";

export function getRandomNumber(min : number, max : number) :number {
    return Math.random() * (max - min) + min;
}

export function getRandomPre():number{
    // returns 1 or -1 randomly

    let t = getRandomNumber(-1, 1)

    if(t < 0){
        return -1
    }

    return 1
}

export function getRandomVector3(minRadius : number, maxRadius : number, onlyUp : boolean = false, origin:Vector3 = new Vector3(0,0,0)) : Vector3 {
    const x = getRandomNumber(-maxRadius, maxRadius)

    const maxY = Math.sqrt((maxRadius * maxRadius)-(x * x))
    let y = getRandomNumber(-maxY, maxY)
    if(onlyUp){
        y = Math.abs(y)
    }

    const t = (minRadius * minRadius)-(x*x)-(y*y) < 0 ? 0 : (minRadius * minRadius)-(x*x)-(y*y) 
    const minZ = Math.sqrt(t)
    const maxZ = Math.sqrt((maxRadius * maxRadius)-(x*x)-(y*y))
    const z = getRandomPre() * getRandomNumber(minZ, maxZ)

    return new Vector3(origin.x + x, origin.y +y,origin.z +z)
}
// Source - https://stackoverflow.com/a/1349426
// Posted by csharptest.net, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-23, License - CC BY-SA 4.0

function generateKey(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}