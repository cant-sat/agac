import React, { useEffect, useMemo, useState } from "react";
import { setScroll } from "./experience";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import DataChart from "../charts";




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

    const chart = useMemo(() => (
        <DataChart
            dataUrls={["/data/cutreprocessedforce.txt"]}
            dataUrlLabels={{"/data/cutreprocessedforce.txt" : "Force"}}
            xAxisUrl="/data/cutreprocessedtimestamp.txt"
        />
    ), []);
    


    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl font-light text-justify text-white" id="content" onScroll={handleScroll}>
            <div className="flex flex-col w-screen" >

                <div className="flex flex-col items-center justify-center h-screen select-none -translate-y-5">
                    <div className="font-thin text-[10vw] centered">Rocket Motors</div>
                    

                    {ScrollDown(offset, 75, isMobile)}
                </div>

                <div className="h-screen w-screen">
                    Data from the first launch
                    {chart}
                </div>
                <div className="min-h-screen">
                    The Propellant
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