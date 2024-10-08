import React, { useEffect, useState } from "react";
import { setScroll } from "./experience";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";


export function Content(): React.ReactNode {
    const [offset, setOffset] = useState(0)


    // window dimension
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [isMobile, setIsMobile] = useState(windowDimensions.height > windowDimensions.width)


    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            setIsMobile(windowDimensions.height > windowDimensions.width)

        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    
    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

        const maxScrollTop = scrollHeight - clientHeight;

        const percentage = scrollTop / maxScrollTop;

        setScroll(percentage * 100); 
        setOffset(event.currentTarget.scrollTop)
    }

    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl font-light text-justify text-white" id="content" onScroll={handleScroll}>
            <div className="flex flex-col w-screen" >

                <div className="flex flex-col items-center justify-center h-screen select-none -translate-y-5">
                    <div className="font-thin text-[10vw] centered">Rocket Motors</div>
                    

                    {ScrollDown(offset, 75, isMobile)}
                </div>

                

              


            </div>
        </div>
    )
}

function ScrollDown(scroll: number, disappear: number, isMobile: boolean) {




    if (scroll > disappear) {
        return null;
    }

    const opacity = -1 * ((scroll - disappear) / disappear);



    return (
        <>
            <div
                className={`absolute flex right-6 ${isMobile ? 'bottom-[8vh]' : ' bottom-3'}`}
                style={{ opacity: opacity }}
            >
                <div className="self-center text-xl">scroll down!</div>
                <MdKeyboardDoubleArrowDown className="self-center text-5xl text-white" />
            </div>
        </>
    );
}


function ShortOrLong(): React.ReactNode {
    const [answer, setter] = useState("") // "short" or "long"


    if (answer == "") {
        return (<div className="centered underline hover:cursor-pointer *:m-6">
            <div onClick={() => { setter("short") }} >Short answer</div>
            <div onClick={() => { setter("long") }} >Long answer</div>
        </div>)
    }
    if (answer == "short") {
        return (<div className="centered">No where, we are no where</div>)
    }
    if (answer == "long") {
        return (<div className="centered">
            We got all of the 3D plans for the rocket test stand where we will test our rocket motors. The propellent we will be using with it will be simple black powder. We already have the loadcell for the rocket test stand working we just have to save the data we gather somehow, the current plan is to write to an SD card but we want to change to saving all the data to our own server.
        </div>)
    }

    return <>ERROR</>
}



export default Content