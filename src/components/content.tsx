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

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Check if on mobile (portrait mode)
    const isMobile = windowDimensions.height > windowDimensions.width;


    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl font-light text-justify text-white" id="content" onScroll={(event) => { setScroll(event.currentTarget.scrollTop); setOffset(event.currentTarget.scrollTop) }}>
            <div className="flex flex-col w-screen" >

                <div className="flex flex-col items-center justify-center h-screen select-none ">
                    <div className="font-thin text-[22vw] h-[21vw] centered">AGAC</div>
                    <div className="text-[4vh] font-extralight">(not CANT)</div>

                    {ScrollDown(offset, 75, isMobile)}
                </div>

                <hr />

                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className={isMobile ? 'text-4xl' : 'text-8xl'}>What is AGAC?</div>
                    <div className={isMobile ? 'text-2xl w-screen' : 'text-4xl w-[70vw]'}>AGAC is just a project where we try to build a rocket motor and see what happens. We eventually want to build a fully functioning rocket that can go up at least a few hundred meters but that will take time. We are planning to work on AGAC during the summer (but there is a chance we will just be too busy or lazy xd)</div>
                </div>

                <hr />

                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className={isMobile ? 'text-4xl' : 'text-8xl'}>Where are we right now?</div>
                    <div className={isMobile ? 'text-2xl w-screen' : 'text-4xl w-[70vw]'}>{ShortOrLong()}</div>
                </div>

                <hr />

                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className={isMobile ? 'text-4xl' : 'text-8xl'}>Who are we?</div>
                    <div className={isMobile ? 'text-2xl w-screen' : 'text-4xl w-[70vw]'}>None of your business</div>
                </div>
                
                <hr />

                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className={isMobile ? 'text-4xl' : 'text-8xl'}>What does "AGAC" mean?</div>
                    <div className={isMobile ? 'text-2xl w-screen' : 'text-4xl w-[70vw]'}>no clue</div>
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
        return (<>
            <div onClick={() => { setter("short") }} >Short answer</div>
            <div onClick={() => { setter("long") }} >Long answer</div>
        </>)
    }
    if (answer == "short") {
        return (<>No where, we are no where</>)
    }
    if (answer == "long") {
        return (<>
            <div>We have lots of.... ambition and... plans</div>
            <div></div>
        </>)
    }

    return <>ERROR</>
}