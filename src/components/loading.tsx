import { GooSpinner } from "react-spinners-kit"

function Loading(): JSX.Element{
    return(<div className="w-screen h-screen bg-black text-white font-thin text-lg flex place-content-center items-center">
        <GooSpinner size={70}/>
    </div>)
}

export default Loading