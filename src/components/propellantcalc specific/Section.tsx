import { useState } from "react"
import { molecule, moleculeType } from "../../utility/chemistry"
import { globalAddMolecule, globalSetEditMoleculeData } from "../../pages/PropellantCalculator"

interface SectionInterface {
    molecules: molecule[],
    sectionName: string,
    moleculeTypeName: string,
    sectionMoleculeType: moleculeType,

}


export default function Section({ molecules,  sectionMoleculeType, moleculeTypeName, sectionName }: SectionInterface): JSX.Element {

    const [message, setMessage] = useState("")

    function addMolecule(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const MoleculeName = (document.getElementById(`${moleculeTypeName}Name`) as HTMLInputElement).value
        const MoleculeNotation = (document.getElementById(`${moleculeTypeName}Notation`) as HTMLInputElement).value
        const MoleculeHeatOfFormation = Number(
            (document.getElementById(`${moleculeTypeName}HeatOfFormation`) as HTMLInputElement).value
        )
        const MoleculeDensity = Number(
            (document.getElementById(`${moleculeTypeName}Density`) as HTMLInputElement).value
        )

        let t = molecule.moleculeFromNotation(
            MoleculeName,
            MoleculeNotation,
            MoleculeHeatOfFormation,
            sectionMoleculeType,
            MoleculeDensity

        )

        if (typeof t == "string") {
            setMessage(t)
        } else {
            setMessage("")
                ; (document.getElementById(`${moleculeTypeName}Notation`) as HTMLInputElement).value = ""
                ; (document.getElementById(`${moleculeTypeName}Name`) as HTMLInputElement).value = ""
                ; (document.getElementById(`${moleculeTypeName}HeatOfFormation`) as HTMLInputElement).value = ""
                ; (document.getElementById(`${moleculeTypeName}Density`) as HTMLInputElement).value = ""

            globalAddMolecule(t)
        }
    }

    return (<div className="p-1">
        <div className="text-xl">{sectionName}</div>
        <form onSubmit={addMolecule} className="p-2 *:mx-1">
            <input type="text" id={`${moleculeTypeName}Name`} placeholder={`${moleculeTypeName} Name`}  required/>

            <input type="text" id={`${moleculeTypeName}Notation`} placeholder={`${moleculeTypeName} Notation`}  required/>

            <input type="number" step={0.001}  id={`${moleculeTypeName}HeatOfFormation`} placeholder={`${moleculeTypeName} Heat Of Formation (in kJ/mol)`} required/>

            <input type="number" step={0.001}  id={`${moleculeTypeName}Density`} placeholder={`${moleculeTypeName} Density (in g/cm^3)`} required/>

            <button type="submit" >Add {moleculeTypeName}</button>
        </form>

        {message && <div className="text-red-500">{message}</div>}

        {molecules.map((value, i) => (
            <div key={i} className="m-1">
                <button  onClick={() => {
                    globalSetEditMoleculeData({ index: i, molecule: value})
                }}>Edit</button>
                {value.name} - {value.chemicalNotationElement} (Δ<i>H</i><sub>k</sub> = {value.heatOfFormation} kJ/mol, {value.density} g/cm<sup>3</sup>)
                
            </div>
        ))}
    </div>)
}