import React, { useState } from "react";
import { setScroll } from "./experience";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";


export function Content(): React.ReactNode{
    const [offset, setOffset] = useState(0)

    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl text-justify text-white" id="content" onScroll={(event)=>{setScroll(event.currentTarget.scrollTop); setOffset(event.currentTarget.scrollTop)}}>
            <div className="grid grid-cols-5 grid-rows-10 h-[200vh]" >

                <div className="flex flex-col items-center justify-center col-span-5 row-span-5 select-none ">
                    <div className="font-thin text-[22vw] h-[21vw] flex items-center">AGAC</div>
                    <div className="text-[4vh] font-extralight">(not CANT)</div>

                    {ScrollDown(offset, 150)}
                </div>
            </div>
        </div>
    )
}

function ScrollDown(scroll : number, disappear : number) : React.ReactNode{
    if(scroll > disappear){
        return (<></>)
    }

    const opacity = -1 * ((scroll - disappear) / disappear)

    return (<>
        <div className="absolute flex right-6 bottom-3" style={{opacity : opacity}}><div className="self-center text-xl">scroll down!</div><MdKeyboardDoubleArrowDown className="self-center text-5xl text-white" /></div>
    </>)
}