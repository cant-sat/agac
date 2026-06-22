import { useEffect, useState } from "react"
import { chemInited, initChem, molecule, moleculeType, rocketFuel } from "../utility/chemistry.tsx"
import EditPopUp from "../components/propellantcalc specific/EditPopUp"
import Section from "../components/propellantcalc specific/Section"
import RocketFuelSection from "../components/propellantcalc specific/RocketFuelSection"
import "../components/propellantcalc specific/propellantCalc.css"
import RocketFuelCalcPopUp from "../components/propellantcalc specific/RocketFuelCalcPopUp.tsx"


export let globalSetEditMoleculeData: (newData: { molecule: molecule, index: number } | null) => void = () => { throw "globalSetEditMoleculeData is not yet set" }
export let globalAddMolecule: (newMolecule: molecule) => void = () => { throw "globalAddMolecule is not yet set" }
export let globalEditMolecule: (newMolecule: molecule, index: number) => void = () => { throw "globalEditMolecule is not yet set" }
export let globalRemoveMolecule: (deleteType: moleculeType, index: number) => void = () => { throw "globalRemoveMolecule is not yet set" }
export let globalAddRocketFuel: (newRocketFuel: rocketFuel) => void = () => { throw "globalAddRocketFuel is not yet set" }
export let globalRemoveRocketFuel: (index: number) => void = () => { throw "globalRemoveRocketFuel is not yet set" }
export let globalSetCurrentRocketFuelPointer: (newRocketFuelPointer: number | null) => void = () => { throw "globalSetCurrentRocketFuelPointer is not yet set" }

function PropellantCalculator(): JSX.Element {

  const [oxidisers, setOxidisers] = useState<molecule[]>([])
  const [fuels, setFuels] = useState<molecule[]>([])

  const [rocketFuels, setRocketFuels] = useState<rocketFuel[]>([])



  const [editMoleculeData, setEditMoleculeData] = useState<{ molecule: molecule, index: number } | null>(null)

  const [currentRocketFuelPointer, setCurrentRocketFuelPointer] = useState<number | null>(null)

  globalSetCurrentRocketFuelPointer = (newRocketFuelPointer) => {
    setCurrentRocketFuelPointer(newRocketFuelPointer)
  }

  globalSetEditMoleculeData = (newMolecule) => {
    setEditMoleculeData(newMolecule)
  }


  useEffect(() => {
    if (!chemInited) initChem()

    window.addEventListener("beforeunload", (e) => {
      if (oxidisers.length != 0 || fuels.length != 0) {
        e.preventDefault()
        e.returnValue = ""
      }
    })
  }, [])


  function addMolecule(newMolecule: molecule) {
    switch (newMolecule.moleculeType) {

      case moleculeType.fuel:
        setFuels(prev => [...prev, newMolecule])
        break

      case moleculeType.oxidiser:
        setOxidisers(prev => [...prev, newMolecule])
        break

    }
  }

  globalAddMolecule = addMolecule

  function editMolecule(newMolecule: molecule, index: number) {
    switch (newMolecule.moleculeType) {

      case moleculeType.fuel:
        setFuels(prev => {
          const copy = [...prev]
          copy[index] = newMolecule
          return copy
        })
        break

      case moleculeType.oxidiser:
        setOxidisers(prev => {
          const copy = [...prev]
          copy[index] = newMolecule
          return copy
        })
        break

    }
  }

  globalEditMolecule = editMolecule

  function removeMolecule(deleteType: moleculeType, index: number) {
    switch (deleteType) {

      case moleculeType.fuel:
        setFuels(prev => prev.filter((_, i) => i !== index))

        setRocketFuels(prev =>
          prev
            // Remove any rocket fuel that references the deleted fuel
            .filter(rf => !rf.fuels.some(f => f.fuelPointer === index))
            // Fix fuelPointer indexes after removal
            .map(rf => ({
              ...rf,
              fuels: rf.fuels.map(f => ({
                ...f,
                fuelPointer: f.fuelPointer > index
                  ? f.fuelPointer - 1
                  : f.fuelPointer
              }))
            }))
        )

        break

      case moleculeType.oxidiser:
        setOxidisers(prev => prev.filter((_, i) => i !== index))

        setRocketFuels(prev =>
          prev
            // Remove any rocket fuel that references the deleted oxidiser
            .filter(ro => !ro.oxidisers.some(o => o.oxidiserPointer === index))
            // Fix fuelPointer indexes after removal
            .map(ro => ({
              ...ro,
              oxidisers: ro.oxidisers.map(o => ({
                ...o,
                oxidiserPointer: o.oxidiserPointer > index
                  ? o.oxidiserPointer - 1
                  : o.oxidiserPointer
              }))
            }))
        )


        break

    }
  }

  globalRemoveMolecule = removeMolecule

  function addRocketFuel(newRocketFuel: rocketFuel) {
    setRocketFuels(prev => [...prev, newRocketFuel])
  }

  globalAddRocketFuel = addRocketFuel

  function removeRocketFuel(index: number) {
    setRocketFuels(prev => prev.filter((_, i) => i !== index))
  }

  globalRemoveRocketFuel = removeRocketFuel

  function exportData() {
    const data = {
      fuels,
      oxidisers,
      rocketFuels
    }

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "propellant-data.json"
    a.click()

    URL.revokeObjectURL(url)
  }

  function importData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target?.result as string)

        if (parsed.fuels) {
          const rebuiltFuels: molecule[] = []

          for (const f of parsed.fuels) {
            const m = molecule.moleculeFromNotation(
              f.name,
              f.chemicalNotation,
              f.heatOfFormation,
              moleculeType.fuel,
              f.density,
              f.toxic,
              f.oxygenAmount
            )

            if (typeof m === "string") continue // skip invalid molecules

            rebuiltFuels.push(m)
          }

          setFuels(rebuiltFuels)
        }

        if (parsed.oxidisers) {
          const rebuiltOxidisers: molecule[] = []

          for (const o of parsed.oxidisers) {
            const m = molecule.moleculeFromNotation(
              o.name,
              o.chemicalNotation,
              o.heatOfFormation,
              moleculeType.oxidiser,
              o.density,
              o.toxic,
              o.oxygenAmount
            )

            if (typeof m === "string") continue

            rebuiltOxidisers.push(m)
          }

          setOxidisers(rebuiltOxidisers)
        }

        if (parsed.rocketFuels) {
          setRocketFuels(parsed.rocketFuels) // OK (no class needed)
        }

        alert("Data imported and recalculated successfully")
      }
      catch {
        alert("Invalid JSON file")
      }
    }

    reader.readAsText(file)

    event.target.value = ""
  }

  return (
    <>
      <EditPopUp
        currentMoleculeData={editMoleculeData}
      />

      <RocketFuelCalcPopUp
        currentRocketFuelPointer={currentRocketFuelPointer}
        fuels={fuels}
        oxidisers={oxidisers}
        rocketFuels={rocketFuels}
      />


      <div className="text-white p-2">

        <br /><br />

        {/* ========================= */}
        {/* FUELS */}
        {/* ========================= */}
        <Section moleculeTypeName="Fuel" molecules={fuels} sectionMoleculeType={moleculeType.fuel} sectionName="Fuels" />

        <hr />

        {/* ========================= */}
        {/* OXIDISERS */}
        {/* ========================= */}
        <Section moleculeTypeName="Oxidiser" molecules={oxidisers} sectionMoleculeType={moleculeType.oxidiser} sectionName="Oxidisers" />

        <hr />

        <RocketFuelSection fuels={fuels} oxidisers={oxidisers} rocketFuels={rocketFuels} />

        <hr />
        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-primary"
            onClick={exportData}
          >
            Export JSON
          </button>

          <label className="btn btn-success mb-0">
            Import JSON
            <input
              type="file"
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={importData}
            />
          </label>
        </div>

      </div>
    </>
  )
}

export default PropellantCalculator