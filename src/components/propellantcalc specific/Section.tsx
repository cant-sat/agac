import { useState } from "react"
import { molecule, moleculeType } from "../../utility/chemistry"

interface SectionInterface {
    moleculesSetFunc: Function,
    molecules: molecule[],
    sectionName: string,
    moleculeTypeName: string,
    sectionMoleculeType: moleculeType

    editSetter: Function
}


export default function Section({ molecules, editSetter, moleculesSetFunc, sectionMoleculeType, moleculeTypeName, sectionName }: SectionInterface): JSX.Element {

    const [message, setMessage] = useState("")

    function addMolecule(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const MoleculeName = (document.getElementById(`${moleculeTypeName}Name`) as HTMLInputElement).value
        const MoleculeNotation = (document.getElementById(`${moleculeTypeName}Notation`) as HTMLInputElement).value
        const MoleculeHeatOfFormation = Number(
            (document.getElementById(`${moleculeTypeName}HeatOfFormation`) as HTMLInputElement).value
        )

        let t = molecule.moleculeFromNotation(
            MoleculeName,
            MoleculeNotation,
            MoleculeHeatOfFormation,
            sectionMoleculeType
        )

        if (typeof t == "string") {
            setMessage(t)
        } else {
            setMessage("")
                ; (document.getElementById(`${moleculeTypeName}Notation`) as HTMLInputElement).value = ""
                ; (document.getElementById(`${moleculeTypeName}Name`) as HTMLInputElement).value = ""
                ; (document.getElementById(`${moleculeTypeName}HeatOfFormation`) as HTMLInputElement).value = ""

            moleculesSetFunc(molecules.concat(t))
        }
    }

    return (<div className="p-1">
        <div className="text-xl">{sectionName}</div>
        <form onSubmit={addMolecule} className="p-2 *:mx-1">
            <input type="text" id={`${moleculeTypeName}Name`} placeholder={`${moleculeTypeName} Name`} className="text-black p-0.5" required/>

            <input type="text" id={`${moleculeTypeName}Notation`} placeholder={`${moleculeTypeName} Notation`} className="text-black p-0.5" required/>

            <input type="number" step={0.001}  id={`${moleculeTypeName}HeatOfFormation`} placeholder={`${moleculeTypeName} Heat Of Formation (in kJ/mol)`}className="text-black p-0.5" required/>

            <button type="submit">Add a {moleculeTypeName}</button>
        </form>

        {message && <div className="text-red-500">{message}</div>}

        {molecules.map((value, i) => (
            <div key={i}>
                {value.name} - {value.chemicalNotationElement} (Δ<i>H</i><sub>k</sub> = {value.heatOfFormation} kJ/mol)
                <button className="mx-2 bg-slate-600 py-0.5 px-2 rounded" onClick={() => {
                    editSetter({ index: i, molecule: value, molecules: molecules, setMolecules: moleculesSetFunc })
                }}>Edit</button>
            </div>
        ))}
    </div>)
}