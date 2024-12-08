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

    const chart1 = useMemo(() => (
        <DataChart
            dataUrls={["/data/launch 1/cutreprocessedforce.txt"]}
            dataUrlLabels={{ "/data/launch 1/cutreprocessedforce.txt": "Force" }}
            xAxisUrl="/data/launch 1/cutreprocessedtimestamp.txt"
        />
    ), []);

    const chart2 = useMemo(() => (
        <DataChart
            dataUrls={["/data/launch 2/forces.txt"]}
            dataUrlLabels={{ "/data/launch 2/forces.txt": "Force" }}
            xAxisUrl="/data/launch 2/timestamps.txt"
        />
    ), []);



    return (
        <div className="absolute top-0 left-0 w-screen h-screen overflow-y-scroll text-3xl font-light text-justify text-white" id="content" onScroll={handleScroll}>
            <div className="flex flex-col w-screen" >

                <div className="flex flex-col items-center justify-center h-screen select-none -translate-y-5">
                    <div className="font-thin text-[10vw] centered">Rocket Motors</div>


                    {ScrollDown(offset, 75, isMobile)}
                </div>

                <div className="max-h-screen">
                    <div className="text-center text-6xl">
                        Launches
                    </div>

                    <div className="w-screen flex justify-evenly  *:bg-neutral-600/40 *:m-5 *:backdrop-blur-md *:p-5 *:rounded-xl *:border-neon *:border-[1.5px] *:text-center *:flex *:items-center *:max-h-[80vh] *:flex-col *:*:my-3">
                        <div>
                            <div>
                                Launch 1
                            </div>
                            <img src="./images/launch1.PNG" alt="Launch 1 cover image" className=" rounded w-[25vw] object-cover aspect-square" />
                        </div>
                        <div>
                            <div>
                                Launch 2
                            </div>
                            <img src="./images/launch2.jpg" alt="Launch 2 cover image" className=" rounded w-[25vw] object-cover aspect-square" />
                        </div>
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