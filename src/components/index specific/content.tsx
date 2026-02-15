import React, { useEffect, useState } from "react";
import { setScroll } from "./experience";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";


function Content(): React.ReactNode {
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




    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl font-light text-justify text-white" id="content" onScroll={(event) => { setScroll(event.currentTarget.scrollTop); setOffset(event.currentTarget.scrollTop) }}>
            <div className="flex flex-col w-screen" >

                <div className="flex flex-col items-center justify-center h-screen select-none ">
                    <div className="font-thin text-[22vw] h-[21vw] centered">AGAC</div>
                    <div className="text-[4vh] font-extralight">(not CANT)</div>

                    {ScrollDown(offset, 75, isMobile)}
                </div>



                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className="text-4xl sm:text-7xl text-center" >What is AGAC?</div>
                    <div className="text-2xl w-screen sm:text-4xl sm:w-[70vw]">AGAC is just a project where we try to build a rocket motor and see what happens. We eventually want to build a fully functioning rocket that can go up at least a few hundred meters but that will take time. We are planning to work on AGAC during the summer (but there is a chance we will just be too busy or lazy xd)</div>
                </div>



                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className="text-4xl sm:text-7xl text-center">Where are we right now?</div>
                    <div className="text-2xl w-screen sm:text-4xl sm:w-[70vw]">We have launched 5 rockets so far, and only 1 exploded, which is a pretty good ratio! We managed to get useable data from 2 of those launches</div>
                </div>



                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className="text-4xl sm:text-7xl text-center">Who are we?</div>
                    <div className="text-2xl w-screen sm:text-4xl sm:w-[70vw]">2 Hungarian Highschool students with brain damage</div>
                </div>



                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className="text-4xl sm:text-7xl text-center">What does "AGAC" mean?</div>
                    <div className="text-2xl w-screen sm:text-4xl sm:w-[70vw]">The name AGAC was chosen by GPT-2 and it stands for Advanced A.G.A (dont ask what A.G.A is, we have no clue) but the name stuck so now its agac.</div>
                </div>

                <div className="centered h-screen *:m-3 font-light *:p-4">
                    <div className="text-4xl sm:text-7xl text-center">Check out the tools we made</div>
                    <div className="flex *:p-2 *:bg-purple-800/50 *:rounded-lg *:backdrop-blur-md *:transition-all *:m-1.5 flex-wrap justify-center">
                        <a href="#dataProcessor" className="hover:scale-110  hover:mx-6">HX711 loadcell data processor</a>
                        <a href="#propellantCalculator" className="hover:scale-110 hover:mx-6">Fuel and Oxidizer calculator</a>


                    </div>
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








export default Content