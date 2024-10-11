import {LineChart, Legend, Tooltip, XAxis, YAxis, Line, CartesianGrid} from "recharts"

interface chartData {
    dataUrls : string[],
    yAxisUrl? : string,
    dataUrlLabels : {[key : string] : string}
}

let cache : {[key : string ] : string} = {}

function DataChart({dataUrls, yAxisUrl, dataUrlLabels} : chartData) : JSX.Element{
    var chartData : [number[]]
    var lines : string[]
    

    dataUrls.forEach(async (dataUrl)=>{
        try {
            let response : string = ""
            if(cache[dataUrl]){
                response = cache[dataUrl]
            }
            else {
                response = await fetch(dataUrl, {method: "get"}).then((body)=>{
                    return body.text()
                })
                cache[dataUrl] = response
            }

            const data : number[] = JSON.parse(response)
            chartData.push(data)

            
            const label = dataUrlLabels[dataUrl] ? dataUrlLabels[dataUrl] : dataUrl
            lines.push(label)
            
        } catch (error) {
            throw error
        }
        
    })

    async ()=>{

    }


    return (
        <LineChart>
            <Legend stroke="#ffffff"/>
            <Tooltip/>
            <XAxis stroke="#ffffff"/>
            <YAxis stroke="#ffffff"/>
        </LineChart>
    )
}

export default DataChart