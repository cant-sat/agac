import { useEffect, useState } from "react"
import { molecule, rocketFuel } from "../../utility/chemistry"
import { globalSetReactionBalanceRocketFuelPointer } from "../../pages/PropellantCalculator"

interface reactionPopUpInterface {

    rocketFuelPointer: number | null,
    fuels: molecule[],
    oxidisers: molecule[],
    endProducts: molecule[],
    rocketFuels: rocketFuel[]

}



function ReactionPopUp({ fuels, oxidisers, endProducts, rocketFuels, rocketFuelPointer }: reactionPopUpInterface): JSX.Element {


    const [fuelAmount, setFuelAmount] = useState(1)
    const [oxidiserAmount, setOxidiserAmount] = useState(1)

    const [selectedEndProducts, setSelectedEndProducts] = useState<{ endProductPointer: number, endProductAmount: number }[]>([])



    const [usedEndProducts, setUsedEndProducts] = useState<boolean[]>([])

    const [message, setMessage] = useState("")

    const [endProductSelectedValue, setEndProductSelectedValue] = useState("")

    const [selectableEndProducts, setSelectableEndProducts] = useState<{ molecule: molecule, index: number }[]>([])

    function handleSave() {
        let reactionSumElements = new Uint16Array(118).fill(0)

        for (let i = 0; i < 118; i++) {

            for (let j = 0; j < selectedEndProducts.length; j++) {

                reactionSumElements[i] -= endProducts[selectedEndProducts[j].endProductPointer].elementsById[i] * selectedEndProducts[j].endProductAmount
            }

        }

        if (reactionSumElements.every(val => val == 0)) {

        }
        else {
            setMessage("Reaction is not balanced yet, you cant save it")
        }
    }

    useEffect(() => {
        if (!rocketFuelPointer) return

        const sumFuel = fuels[rocketFuels[rocketFuelPointer].fuels[0].fuelPointer].elementsById

        for (let i = 1; i < rocketFuels[rocketFuelPointer].fuels.length; i++) {

            for (let j = 0; j < 118; j++) {
                sumFuel[j] += fuels[rocketFuels[rocketFuelPointer].fuels[i].fuelPointer].elementsById[j]
                
            }
            
        }

        const sumOxidiser = oxidisers[rocketFuels[rocketFuelPointer].oxidisers[0].oxidiserPointer].elementsById

        for (let i = 1; i < rocketFuels[rocketFuelPointer].oxidisers.length; i++) {

            for (let j = 0; j < 118; j++) {
                sumOxidiser[j] += oxidisers[rocketFuels[rocketFuelPointer].oxidisers[i].oxidiserPointer].elementsById[j]
                
            }
            
        }


        const selectable = endProducts
            .map((endProduct, i) => ({ molecule: endProduct, index: i }))
            .filter(({ molecule, index }) => {
                if (usedEndProducts[index]) return false

                return !molecule.elementsIdList.some(
                    (val) =>
                        sumFuel[val] === 0 &&
                        sumOxidiser[val] === 0
                )
            })

        setSelectableEndProducts(selectable)

    }, [usedEndProducts, endProducts, rocketFuels, fuels, oxidisers])


    useEffect(() => {
        setFuelAmount(1)
        setOxidiserAmount(1)
        setSelectedEndProducts([])
        setMessage("")
        setUsedEndProducts(new Array<boolean>(endProducts.length).fill(false))
    }, [rocketFuelPointer, endProducts])

    return (<dialog open={rocketFuelPointer != null} className="w-screen h-screen bg-black text-white z-20 *:m-1">
        {rocketFuelPointer != null ? (
            <>
                <button onClick={() => { globalSetReactionBalanceRocketFuelPointer(null) }}>Go back</button>
                <br />
                <select
                    disabled={selectableEndProducts.length === 0}
                    value={endProductSelectedValue}
                    onChange={(e) => setEndProductSelectedValue(e.target.value)}
                >
                    {selectableEndProducts.length === 0 ? (
                        <option value="">Add End Products</option>
                    ) : (
                        <>
                            <option value="">No End Product selected</option>
                            {selectableEndProducts.map(({ molecule, index }) => (
                                <option key={index} value={index}>
                                    {molecule.chemicalNotationElement}
                                </option>
                            ))}
                        </>
                    )}
                </select>
                <button onClick={() => {
                    if (endProductSelectedValue === "") return

                    const index = Number(endProductSelectedValue)

                    setSelectedEndProducts(prev => [
                        ...prev,
                        { endProductPointer: index, endProductAmount: 1 }
                    ])

                    setUsedEndProducts(prev => {
                        const copy = [...prev]
                        copy[index] = true
                        return copy
                    })

                    setEndProductSelectedValue("") // reset select
                }}>Add End Product</button>
                <br />
                {
                    rocketFuels[rocketFuelPointer].fuels.map((val, i) => {
                        return (
                            < span >
                                <input type="number" id={`${i}fuelAmount`} className="w-10" value={fuelAmount * val.ratio} onChange={(e) => { setFuelAmount(Math.max(1, Math.ceil(e.target.valueAsNumber / val.ratio))) }} step={1} min={0} /> {fuels[val.fuelPointer].chemicalNotationElement}
                                {i == rocketFuels[rocketFuelPointer].fuels.length - 1 ? "" : "+"}
                            </span>
                        )
                    })
                }
                +

                {
                    rocketFuels[rocketFuelPointer].oxidisers.map((val, i) => {
                        return (
                            < span >
                                <input type="number" id={`${i}oxidiserAmount`} className="w-10" value={oxidiserAmount * val.ratio} onChange={(e) => { setOxidiserAmount(Math.max(1, Math.floor(e.target.valueAsNumber / val.ratio))) }} step={1} min={0} /> {oxidisers[val.oxidiserPointer].chemicalNotationElement}
                                {i == rocketFuels[rocketFuelPointer].oxidisers.length - 1 ? "" : "+"}
                            </span>
                        )
                    })
                }
                ⟶
                {
                    selectedEndProducts.map((prod, i) => (<>
                        <span>
                            <input type="number" name="End ProductAmount" id={`${i}thEndProductAmount`} className="w-10" value={prod.endProductAmount} onChange={(e) => {
                                setSelectedEndProducts(prev => {
                                    let t = [...prev]
                                    t[i].endProductAmount = e.target.valueAsNumber

                                    if (e.target.valueAsNumber == 0) {
                                        t.splice(i, 1)
                                        setUsedEndProducts(prev => {
                                            const temp = [...prev]

                                            temp[i] = false
                                            return temp
                                        })
                                    }
                                    return t
                                })
                            }} step={1} min={1} /> {endProducts[prod.endProductPointer].chemicalNotationElement}
                        </span>
                        {i == selectedEndProducts.length - 1 ? "" : "+"}
                    </>
                    ))
                }
            </>)

            : "You should never see this"}
        <br />
        <button onClick={handleSave}>Save Reaction</button>

    </dialog >)
}

export default ReactionPopUp