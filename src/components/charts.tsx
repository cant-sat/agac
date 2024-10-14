import { useEffect,  useState } from "react"
import { LineChart, Legend, Tooltip, XAxis, YAxis, Line, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"

interface chartData {
    dataUrls: string[],
    xAxisUrl: string,
    dataUrlLabels: { [key: string]: string }
}

let cache: { [key: string]: number[] } = {}

function DataChart({ dataUrls, xAxisUrl, dataUrlLabels }: chartData): JSX.Element {
    const [chartData, setChartData] = useState<{ [key: string]: number }[]>([])
    const [lines, setLines] = useState<string[]>([])

    useEffect(() => {
        // Fetch and prepare the data
        const fetchData = async () => {
            let updatedChartData: { [key: string]: number }[] = chartData
            let updatedLines: string[] = []

            for (const dataUrl of dataUrls) {
                try {
                    
                    if (!cache[dataUrl]) {
                        let response = await fetch(dataUrl, { method: "get" }).then((body) => body.text())
                        cache[dataUrl] = JSON.parse(response)
                    }

                    const data: number[] = cache[dataUrl]
                    const label = dataUrlLabels[dataUrl] ? dataUrlLabels[dataUrl] : dataUrl
                    updatedLines.push(label)

                    // Ensure chartData has the correct number of entries
                    data.forEach((value, i) => {
                        if (!updatedChartData[i]) {
                            updatedChartData[i] = {}
                        }
                        updatedChartData[i][label] = value
                    })
                } catch (error) {
                    console.error(`Failed to fetch data from ${dataUrl}`, error)
                }
            }

            // Update state after all data is fetched
            setChartData(updatedChartData)
            setLines(updatedLines)
        }

        const fetchXAxis = async () => {
            let updatedChartData: { [key: string]: number }[] = chartData

            try {
                if (!cache[xAxisUrl]) {
                    let response = await fetch(xAxisUrl, { method: "get" }).then((body) => body.text())
                    cache[xAxisUrl] = JSON.parse(response)
                }

                const data: number[] = cache[xAxisUrl]

                // Ensure chartData has the correct number of entries
                data.forEach((value, i) => {
                    if (!updatedChartData[i]) {
                        updatedChartData[i] = {}
                    }
                    updatedChartData[i][xAxisUrl] = value

                    
                })
            } catch (error) {
                console.error(`Failed to fetch data from ${xAxisUrl}`, error)
            }

            setChartData(updatedChartData)

        
        }

        fetchXAxis()
        fetchData()

    }, [dataUrls, dataUrlLabels, xAxisUrl])

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}  className="text-black" margin={{bottom: 5, right: 5, top: 5, left: 5}}>
                <Legend stroke="#ffffff" />
                <Tooltip />
                <XAxis stroke="#ffffff" dataKey={xAxisUrl} minTickGap={10} padding={{left: 30, right: 30}}/>
                <YAxis stroke="#ffffff" />

                <ReferenceLine/>

                {lines.map((key) =>

                    <Line key={key} type={"monotone"} dataKey={key} stroke={"#888888"} />

                )}

                <CartesianGrid strokeDasharray="1 3" stroke="#444444"/>
                <ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default DataChart