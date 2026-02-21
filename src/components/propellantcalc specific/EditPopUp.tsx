import { useEffect, useState } from "react"
import { molecule } from "../../utility/chemistry"

interface editPopUpInterface {
    closeFunc: Function,

    currentMoleculeData: { molecule: molecule, index: number, molecules:molecule[], setMolecules:Function } | null,
}



function EditPopUp({ currentMoleculeData, closeFunc}: editPopUpInterface): JSX.Element {

    const [deleteSure, setDeletSure] = useState(false)

    function handleDeleteButton() {
        if (!deleteSure) {
            setDeletSure(true)
            return
        }
        else {
            setDeletSure(false)
            
            let t = currentMoleculeData!.molecules
            t.splice(currentMoleculeData!.index, 1)

            closeFunc()
        }
    }

    useEffect(() => {
        if (currentMoleculeData) {
            (document.getElementById("newName") as HTMLInputElement).value = currentMoleculeData.molecule.name;
            (document.getElementById("newNotation") as HTMLInputElement).value = currentMoleculeData.molecule.chemicalNotation;
            (document.getElementById("newHeatOfFormation") as HTMLInputElement).value = currentMoleculeData.molecule.heatOfFormation.toString();
        }
    }, [currentMoleculeData])

    return (<dialog open={currentMoleculeData != null} className="w-screen h-screen bg-black text-white z-10">
        Name : <input type="text" name="newName" id="newName" className="text-black"/>
        <br />
        Notation : <input type="text" name="newNotation" id="newNotation" className="text-black"/>
        <br />
        Heat of formation : <input type="number" name="newHeatOfFormation" id="newHeatOfFormation" className="text-black"/>
        <br />

        <button>Save data</button>
        <br />
        <button onClick={() => { closeFunc() }}>Discard changes</button>

        <br />

        <button className="text-red-500" onClick={handleDeleteButton}>{deleteSure ? "Are you sure?" : "DELETE"}</button>
    </dialog>)
}

export default EditPopUp