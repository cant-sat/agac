import { useEffect, useState } from "react"
import { molecule, rocketFuel } from "../../utility/chemistry"
import { globalAddRocketFuel, globalRemoveRocketFuel, globalSetReactionBalanceRocketFuelPointer } from "../../pages/PropellantCalculator"
import { gcd } from "../../utility/math"

interface rocketFuelSectionInterface {
    oxidisers: molecule[]
    fuels: molecule[]
    rocketFuels: rocketFuel[]
}

export default function RocketFuelSection({ oxidisers, fuels, rocketFuels }: rocketFuelSectionInterface): JSX.Element {
    const [message, setMessage] = useState("")

    const [selectedOxidisers, setSelectedOxidisers] = useState<{ oxidiserPointer: number, ratio: number }[]>([])
    const [selectedOxidisersById, setSelectedOxidisersById] = useState<boolean[]>([])
    const [oxidiserSelectValue, setOxidiserSelectValue] = useState<string>("")


    const [selectedFuels, setSelectedFuels] = useState<{ fuelPointer: number, ratio: number }[]>([])
    const [selectedFuelsById, setSelectedFuelsById] = useState<boolean[]>([])
    const [fuelSelectValue, setFuelSelectValue] = useState<string>("")

    const [oxidiserExcess, setOxidiserExcess] = useState(0)



    useEffect(() => {
        setSelectedFuels([])
        setSelectedOxidisers([])

        setSelectedFuelsById(new Array<boolean>(fuels.length).fill(false))
        setSelectedOxidisersById(new Array<boolean>(oxidisers.length).fill(false))
    }, [oxidisers, fuels])

    function createRocketFuel() {
        let rocketFuelName = (document.getElementById("rocketFuelName") as HTMLInputElement).value
        let rocketFuelDescription = (document.getElementById("rocketFuelDescription") as HTMLInputElement).value

        if (selectedFuels.length == 0 || selectedOxidisers.length == 0) {
            setMessage("at least 1 fuel and 1 oxidiser is needed")
            return
        }



        let fuelDivisor: number = selectedFuels[0].ratio

        for (let i = 1; i < selectedFuels.length; i++) {
            fuelDivisor = gcd(fuelDivisor, selectedFuels[i].ratio)

        }
        let newFuels: { fuelPointer: number, ratio: number }[] = selectedFuels.map((val) => {
            return { ...val, ratio: val.ratio / fuelDivisor }
        })

        let oxidiserDivisor: number = selectedOxidisers[0].ratio

        for (let i = 1; i < selectedOxidisers.length; i++) {
            oxidiserDivisor = gcd(oxidiserDivisor, selectedOxidisers[i].ratio)

        }
        let newOxidisers: { oxidiserPointer: number, ratio: number }[] = selectedOxidisers.map((val) => {
            return { ...val, ratio: val.ratio / fuelDivisor }
        })

        let id = ""

        
            const formatSide = (
                items: { name: string, ratio: number }[]
            ): string => {

                if (items.length === 0) return ""

                // If only one → just name
                if (items.length === 1) {
                    return items[0].name
                }

                // Multiple → show ratio prefix
                const ratioString = items.map(i => i.ratio).join(":")
                const namesString = items.map(i => i.name).join(", ")

                return `${ratioString} ${namesString}`
            }

            const fuelSide = formatSide(
                newFuels.map(f => ({
                    name: fuels[f.fuelPointer].chemicalNotation,
                    ratio: f.ratio
                }))
            )

            const oxidiserSide = formatSide(
                newOxidisers.map(o => ({
                    name: oxidisers[o.oxidiserPointer].chemicalNotation,
                    ratio: o.ratio
                }))
            )

            id = `${fuelSide}; ${oxidiserSide}`
        
            if(rocketFuelName == "") rocketFuelName = id

        let tRocketFuel: rocketFuel = { fuels: newFuels, name: rocketFuelName, oxidisers: newOxidisers, oxidiserExcess: oxidiserExcess, description: rocketFuelDescription , reactionId : id, balanced: false}

        globalAddRocketFuel(tRocketFuel)

        setSelectedFuels([])
        setSelectedOxidisers([])

        setSelectedFuelsById(new Array<boolean>(fuels.length).fill(false))
        setSelectedOxidisersById(new Array<boolean>(oxidisers.length).fill(false));

        (document.getElementById("rocketFuelName") as HTMLInputElement).value = "";
        (document.getElementById("rocketFuelDescription") as HTMLInputElement).value = "";

        setOxidiserExcess(0)
        setMessage("")
    }

    return (<div className="my-5 *:m-1">
        <div className="text-xl">Create Rocket fuels</div>
        <input type="text" name="Rocket Fuel Name" id="rocketFuelName" placeholder="Name (Can be blank)" />
        <input type="text" name="Rocket Fuel Name" id="rocketFuelDescription" placeholder="Description (Can be blank)" />


        <br />

        Oxidiser Excess (in %):
        <input type="number" name="Rocket Fuel Excess" value={oxidiserExcess} onChange={(e) => {
            setOxidiserExcess(Number(e.target.value))
        }} id="rocketFuelExcess" step={0.01} placeholder="Excess of oxidiser (in %)" />
        <span className="text-gray-400 text-sm">(1 means that there will be 1% more of every oxidiser than stoichiometrically calculated, negative means fuel excess)</span>
        <br />
        Select Fuels
        <select
            name="Fuel"
            id="fuelSelect"
            disabled={fuels.length === 0 || selectedFuels.length === fuels.length}
            value={fuelSelectValue}
            onChange={(e) => setFuelSelectValue(e.target.value)}
        >
            {fuels.length === 0 || selectedFuels.length === fuels.length ? (
                <option value="">Add Fuels</option>
            ) : (
                <>
                    <option value="">No fuel selected</option>
                    {fuels.map((fuel, i) => {
                        if (selectedFuelsById[i]) return null

                        return (
                            <option key={i} value={i}>
                                {fuel.chemicalNotationElement}
                            </option>
                        )
                    })}
                </>
            )}
        </select>

        <button
            onClick={() => {
                if (fuelSelectValue === "") return

                const index = Number(fuelSelectValue)

                setSelectedFuels(prev => [
                    ...prev,
                    { fuelPointer: index, ratio: 1 }
                ])

                setSelectedFuelsById(prev => {
                    const copy = [...prev]
                    copy[index] = true
                    return copy
                })

                setFuelSelectValue("") // reset select
            }}
        >
            Add Fuel
        </button>

        {selectedFuels.map((val, i) => {
            return (
                <div key={i}>
                    <button className="text-red-500 font-bold" onClick={() => {
                        setSelectedFuels(prev => prev.filter((_, j) => j !== i))
                        setSelectedFuelsById(prev => {
                            const copy = [...prev]
                            copy[i] = false
                            return copy
                        })

                    }}>X</button>
                    {fuels[val.fuelPointer].chemicalNotationElement} – ratio
                    <input
                        min={1}
                        step={1}
                        type="number"
                        className="w-12 ml-2"
                        value={val.ratio}
                        onChange={(e) => {
                            const newRatio = Number(e.target.value)

                            setSelectedFuels(prev =>
                                prev.map((selFuel, j) =>
                                    j === i
                                        ? { ...selFuel, ratio: newRatio }
                                        : selFuel
                                )
                            )
                        }}
                    />

                </div>
            )
        })}

        <br />
        Select Oxidisers
        <select
            name="Oxidiser"
            id="oxidiserSelect"
            disabled={oxidisers.length === 0 || selectedOxidisers.length === oxidisers.length}
            value={oxidiserSelectValue}
            onChange={(e) => setOxidiserSelectValue(e.target.value)}
        >
            {oxidisers.length === 0 || selectedOxidisers.length === oxidisers.length ? (
                <option value="">Add Oxidisers</option>
            ) : (
                <>
                    <option value="">No oxidiser selected</option>
                    {oxidisers.map((oxidiser, i) => {
                        if (selectedOxidisersById[i]) return null

                        return (
                            <option key={i} value={i}>
                                {oxidiser.chemicalNotationElement}
                            </option>
                        )
                    })}
                </>
            )}
        </select>

        <button
            onClick={() => {
                if (oxidiserSelectValue === "") return

                const index = Number(oxidiserSelectValue)

                setSelectedOxidisers(prev => [
                    ...prev,
                    { oxidiserPointer: index, ratio: 1 }
                ])

                setSelectedOxidisersById(prev => {
                    const copy = [...prev]
                    copy[index] = true
                    return copy
                })

                setOxidiserSelectValue("")
            }}
        >
            Add Oxidiser
        </button>

        {selectedOxidisers.map((val, i) => {
            return (
                <div key={i}>
                    <button
                        className="text-red-500 font-bold"
                        onClick={() => {
                            setSelectedOxidisers(prev => prev.filter((_, j) => j !== i))
                            setSelectedOxidisersById(prev => {
                                const copy = [...prev]
                                copy[i] = false
                                return copy
                            })
                        }}
                    >
                        X
                    </button>

                    {oxidisers[val.oxidiserPointer].chemicalNotationElement} – ratio
                    <input
                        min={1}
                        step={1}
                        type="number"
                        className="w-12 ml-2"
                        value={val.ratio}
                        onChange={(e) => {
                            const newRatio = Number(e.target.value)

                            setSelectedOxidisers(prev =>
                                prev.map((selOxidiser, j) =>
                                    j === i
                                        ? { ...selOxidiser, ratio: newRatio }
                                        : selOxidiser
                                )
                            )
                        }}
                    />
                </div>
            )
        })}

        <br />

        <button onClick={createRocketFuel}>Create Rocket Fuel</button>
        <span className="text-red-500">{message}</span>
        <br />
        <div className="text-xl">
            Rocket fuels
        </div>
        {rocketFuels.map((val, i) => (
            <div>                    <button
                className="text-red-500 font-bold"
                onClick={() => {
                    globalRemoveRocketFuel(i)
                }}
            >
                X
            </button>{val.name}
            
            {val.balanced ? "Yippi" : (<button onClick={()=>{
                globalSetReactionBalanceRocketFuelPointer(i)
            }}>
                    Balance equation
            </button>)}</div>

        ))}
    </div>)
}