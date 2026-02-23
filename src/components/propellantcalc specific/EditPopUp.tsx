import { useEffect, useState } from "react"
import { molecule } from "../../utility/chemistry"
import { globalEditMolecule, globalRemoveMolecule, globalSetEditMoleculeData } from "../../pages/PropellantCalculator"

interface editPopUpInterface {

    currentMoleculeData: { molecule: molecule, index: number } | null,
}



function EditPopUp({ currentMoleculeData }: editPopUpInterface): JSX.Element {

    const [deleteSure, setDeletSure] = useState(false)

    const [message, setMessage] = useState("")

    function handleDeleteButton() {
        if (!deleteSure) {
            setDeletSure(true)
            return
        }
        else {
            setDeletSure(false)

            globalRemoveMolecule(currentMoleculeData!.molecule.moleculeType, currentMoleculeData!.index)

            globalSetEditMoleculeData(null)


        }
    }

    useEffect(() => {
        if (currentMoleculeData) {
            (document.getElementById("newName") as HTMLInputElement).value = currentMoleculeData.molecule.name;
            (document.getElementById("newHeatOfFormation") as HTMLInputElement).value = currentMoleculeData.molecule.heatOfFormation.toString();
            (document.getElementById(`newDensity`) as HTMLInputElement).value = currentMoleculeData.molecule.density.toString()
        }
    }, [currentMoleculeData])

    function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (currentMoleculeData) {
            const MoleculeName = (document.getElementById(`newName`) as HTMLInputElement).value
            const MoleculeHeatOfFormation = Number(
                (document.getElementById(`newHeatOfFormation`) as HTMLInputElement).value
            )
            const MoleculeDensity = Number(
                (document.getElementById(`newDensity`) as HTMLInputElement).value
            )

            let t = { ...currentMoleculeData.molecule }
            t.density = MoleculeDensity
            t.name = MoleculeName
            t.heatOfFormation = MoleculeHeatOfFormation

            if (typeof t == "string") {
                setMessage(t)
            } else {
                setMessage("")
                    ; (document.getElementById(`newDensity`) as HTMLInputElement).value = ""
                    ; (document.getElementById(`newName`) as HTMLInputElement).value = ""
                    ; (document.getElementById(`newHeatOfFormation`) as HTMLInputElement).value = ""


                globalEditMolecule(t, currentMoleculeData.index)
                globalSetEditMoleculeData(null)
            }
        }
    }

    return (<dialog open={currentMoleculeData != null} className="w-screen h-screen bg-black text-white z-10 *:m-1">
        <form className="*:m-1" onSubmit={handleSave}>
            Name : <input type="text" name="newName" id="newName" />
            <br />
            Notation : {currentMoleculeData ? currentMoleculeData.molecule.chemicalNotationElement : ""}
            <br />
            Heat of formation : <input type="number" step={0.001} name="newHeatOfFormation" id="newHeatOfFormation" /> kJ/mol
            <br />
            Densitiy : <input type="number" step={0.001} name="newDensity" id="newDensity" /> g/cm<sup>3</sup>
            <br />
            <button type="submit" >Save data</button>
            <div>{message}</div>
        </form>

        <button onClick={() => { globalSetEditMoleculeData(null) }} >Discard changes</button>

        <br />

        <button className="text-red-500 font-bold" onClick={handleDeleteButton}>{deleteSure ? "Are you sure?" : "DELETE"}</button> <span>(everything that contained this molecule will also be deleted)</span>
    </dialog>)
}

export default EditPopUp