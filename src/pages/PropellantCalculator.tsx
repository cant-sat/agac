import { useEffect, useState } from "react"
import { chemInited, initChem, molecule, moleculeType,  rocketFuel } from "../utility/chemistry"
import EditPopUp from "../components/propellantcalc specific/EditPopUp"
import Section from "../components/propellantcalc specific/Section"
import RocketFuelSection from "../components/propellantcalc specific/RocketFuelSection"
import "../components/propellantcalc specific/propellantCalc.css"
import ReactionPopUp from "../components/propellantcalc specific/ReactionPopUp"


export let globalSetEditMoleculeData: (newData: { molecule: molecule, index: number } | null) => void = () => { throw "globalSetEditMoleculeData is not yet set" }
export let globalAddMolecule: (newMolecule: molecule) => void = () => { throw "globalAddMolecule is not yet set" }
export let globalEditMolecule: (newMolecule: molecule, index: number) => void = () => { throw "globalEditMolecule is not yet set" }
export let globalRemoveMolecule: (deleteType: moleculeType, index: number) => void = () => { throw "globalRemoveMolecule is not yet set" }
export let globalAddRocketFuel: (newRocketFuel: rocketFuel) => void = () => { throw "globalAddRocketFuel is not yet set" }
export let globalRemoveRocketFuel: (index: number) => void = () => { throw "globalRemoveRocketFuel is not yet set" }
export let globalSetReactionBalanceRocketFuelPointer: (newRocketFuelPointer : number | null) => void = () => { throw "globalSetReactionBalanceRocketFuelPointer is not yet set" }
export let globalBalanceRocketFuel: (i : number, fuelAmount:number, oxidiserAmount :number, endProducts : {amount:number, endProductPointer : number}[]) => void= () => { throw "globalBalanceRocketFuel is not yet set" }

function PropellantCalculator(): JSX.Element {

  const [oxidisers, setOxidisers] = useState<molecule[]>([])
  const [fuels, setFuels] = useState<molecule[]>([])
  const [endProducts, setEndProducts] = useState<molecule[]>([])
  const [rocketFuels, setRocketFuels] = useState<rocketFuel[]>([])



  const [editMoleculeData, setEditMoleculeData] = useState<{ molecule: molecule, index: number } | null>(null)

  const [reactionBalanceRocketFuelPointer, setReactionBalanceRocketFuelPointer] = useState<number | null>(null)


  globalSetEditMoleculeData = (newMolecule) => {
    setEditMoleculeData(newMolecule)
  }

  globalSetReactionBalanceRocketFuelPointer = (newRocketFuelPointer: number | null) => {
    setReactionBalanceRocketFuelPointer(newRocketFuelPointer)
  }


  useEffect(() => {
    if (!chemInited) initChem()

    window.addEventListener("beforeunload", (e) => {
      if (oxidisers.length != 0 || fuels.length != 0 || endProducts.length != 0) {
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

      case moleculeType.endProduct:
        setEndProducts(prev => [...prev, newMolecule])
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

      case moleculeType.endProduct:
        setEndProducts(prev => {
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

      case moleculeType.endProduct:
        setEndProducts(prev => prev.filter((_, i) => i !== index))
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

  return (
    <>
      <EditPopUp
        currentMoleculeData={editMoleculeData}
      />

      <ReactionPopUp endProducts={endProducts} fuels={fuels} oxidisers={oxidisers} rocketFuelPointer={reactionBalanceRocketFuelPointer} rocketFuels={rocketFuels}/>



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

        {/* ========================= */}
        {/* END PRODUCTS */}
        {/* ========================= */}
        <Section moleculeTypeName="End Product" molecules={endProducts} sectionMoleculeType={moleculeType.endProduct} sectionName="End Products" />

        <hr />

        <RocketFuelSection fuels={fuels} oxidisers={oxidisers} rocketFuels={rocketFuels} />

        <hr />
      </div>
    </>
  )
}

export default PropellantCalculator