import {LineChart, Legend, Tooltip, XAxis, YAxis, Line, CartesianGrid} from "recharts"

interface chartData {
    dataUrls : string[],
    yAxisUrl? : string
}

function DataChart({dataUrls, yAxisUrl} : chartData) : JSX.Element{
    let chartData : []

    dataUrls.forEach(async (dataUrl)=>{
        try {
            const response = await fetch(dataUrl, {method: "get"}).then((body)=>{
                return body.text()
            })
            const data : number[] = JSON.parse(response)

            
        } catch (error) {
            throw error
        }
        
    })


    return (
        <LineChart>

        </LineChart>
    )
}

export default DataChart