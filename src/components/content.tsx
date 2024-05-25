import React from "react";
import { setScroll } from "./experience";

export function Content(): React.ReactNode{
    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl text-justify text-white" onScroll={(event)=>{setScroll(event.currentTarget.scrollTop)}}>
            <div className="grid grid-cols-5 grid-rows-10 h-[200vh]">
                <div className="flex flex-col items-center justify-center col-span-5 row-span-5 select-none "><div className="font-thin text-[20vw] h-[18vw] flex items-center">AGAC</div><div className="text-[3vw] font-extralight">(not CANT)</div></div>
            </div>
        </div>
    )
}