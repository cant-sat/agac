import { useEffect, useState } from "react"
import { molecule } from "../../utility/chemistry"
import { globalAddReaction, globalEditMolecule, globalRemoveMolecule, globalSetEditMoleculeData, globalSetReactionBalanceOpen } from "../../pages/PropellantCalculator"

interface reactionPopUpInterface {

    open: boolean,
    reactionsNeeded: { fuelPointer: number, oxidiserPointer: number }[],
    fuels: molecule[],
    oxidisers: molecule[],
    endProducts: molecule[],

}



function ReactionPopUp({ open, fuels, oxidisers, endProducts, reactionsNeeded }: reactionPopUpInterface): JSX.Element {


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

            reactionSumElements[i]+= fuels[reactionsNeeded[0].fuelPointer].elementsById[i] * fuelAmount + oxidisers[reactionsNeeded[0].oxidiserPointer].elementsById[i] * oxidiserAmount
            
        }

        if(reactionSumElements.every(val => val==0)){
            globalAddReaction({endProducts: [], fuelAmount:fuelAmount, fuelPointer: reactionsNeeded[0].fuelPointer, oxidiserAmount: oxidiserAmount, oxidiserPointer:reactionsNeeded[0].oxidiserPointer})
        }
        else{
            setMessage("Reaction is not balanced yet, you cant save it")
        }
    }

    useEffect(() => {
        if (reactionsNeeded.length === 0) return

        const fuel = fuels[reactionsNeeded[0].fuelPointer]
        const oxidiser = oxidisers[reactionsNeeded[0].oxidiserPointer]

        const selectable = endProducts
            .map((endProduct, i) => ({ molecule: endProduct, index: i }))
            .filter(({ molecule, index }) => {
                if (usedEndProducts[index]) return false

                return !molecule.elementsIdList.some(
                    (val) =>
                        fuel.elementsById[val] === 0 &&
                        oxidiser.elementsById[val] === 0
                )
            })

        setSelectableEndProducts(selectable)

    }, [usedEndProducts, endProducts, reactionsNeeded, fuels, oxidisers])


    useEffect(() => {
        setFuelAmount(1)
        setOxidiserAmount(1)
        setSelectedEndProducts([])
        setMessage("")
        setUsedEndProducts(new Array<boolean>(endProducts.length).fill(false))
    }, [open, endProducts])

    return (<dialog open={open && reactionsNeeded.length > 0} className="w-screen h-screen bg-black text-white z-20 *:m-1">
        {reactionsNeeded.length > 0 ? (
            <>
                <button onClick={() => { globalSetReactionBalanceOpen(false) }}>Go back</button>
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
                <span>
                    <input type="number" name="Fuel Amount" id="fuelAmount" className="w-10" value={fuelAmount} onChange={(e) => { setFuelAmount(Math.max(1, e.target.valueAsNumber)) }} step={1} min={1} /> {fuels[reactionsNeeded[0].fuelPointer].chemicalNotationElement}
                </span> +
                <span>
                    <input type="number" name="Oxidiser Amount" id="oxidiserAmount" className="w-10" value={oxidiserAmount} onChange={(e) => { setOxidiserAmount(Math.max(1, Math.floor(e.target.valueAsNumber))) }} step={1} min={0} /> {oxidisers[reactionsNeeded[0].oxidiserPointer].chemicalNotationElement}
                </span>⟶
                {selectedEndProducts.map((prod, i) => (<>
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
                ))}
            </>)

            : "You should never see this"}
        <br />
        <button onClick={handleSave}>Save Reaction</button>

    </dialog>)
}

export default ReactionPopUp