import { useEffect, useState } from "react"
import { LineChart, Legend, Tooltip, XAxis, YAxis, Line, CartesianGrid, ResponsiveContainer } from "recharts"

interface chartData {
    dataUrls: string[],
    yAxisUrl?: string,
    dataUrlLabels: { [key: string]: string }
}

let cache: { [key: string]: number[] } = {}

function DataChart({ dataUrls, yAxisUrl, dataUrlLabels }: chartData): JSX.Element {
    const [chartData, setChartData] = useState<{ [key: string]: number }[]>([])
    const [lines, setLines] = useState<string[]>([])
    const [yAxis, setYAxis] = useState<string>()


    useEffect(() => {
        // Fetch and prepare the data
        const fetchData = async () => {
            let updatedChartData: { [key: string]: number }[] = []
            let updatedLines: string[] = []

            for (const dataUrl of dataUrls) {
                try {
                    let response: string = ""
                    if (!cache[dataUrl]) {
                        response = await fetch(dataUrl, { method: "get" }).then((body) => body.text())
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

        const fetchYAxis = async () => {
            let updatedChartData: { [key: string]: number }[] = chartData
        }


        fetchData()
    }, [dataUrls, dataUrlLabels, yAxisUrl])




    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData} width={500} height={300} className="text-black">
                <Legend stroke="#ffffff" />
                <Tooltip />
                <XAxis stroke="#ffffff" dataKey={yAxis}/>
                <YAxis stroke="#ffffff" />

                {lines.map((key) =>

                    <Line key={key} type={"monotone"} dataKey={key} stroke={"#888888"} />

                )}

            </LineChart>
        </ResponsiveContainer>
    )
}

export default DataChart