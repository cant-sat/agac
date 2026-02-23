import { useEffect, useState } from "react"
import { chemInited, initChem, molecule, moleculeType, reaction, rocketFuel } from "../utility/chemistry"
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
export let globalSetReactionBalanceOpen: (open: boolean) => void = () => { throw "globalSetReactionBalanceOpen is not yet set" }
export let globalAddReaction: (reaction: reaction) => void = () => { throw "globalAddReaction is not yet set" }

function PropellantCalculator(): JSX.Element {

  const [oxidisers, setOxidisers] = useState<molecule[]>([])
  const [fuels, setFuels] = useState<molecule[]>([])
  const [endProducts, setEndProducts] = useState<molecule[]>([])
  const [rocketFuels, setRocketFuels] = useState<rocketFuel[]>([])
  const [reactions, setReactions] = useState<{ [compositeKey: string]: reaction }>({})



  const [editMoleculeData, setEditMoleculeData] = useState<{ molecule: molecule, index: number } | null>(null)

  const [reactionBalanceOpen, setReactionBalanceOpen] = useState(false)

  const [reactionsNeeded, setReactionsNeeded] = useState<{ fuelPointer: number, oxidiserPointer: number }[]>([])

  globalSetEditMoleculeData = (newMolecule) => {
    setEditMoleculeData(newMolecule)
  }

  globalSetReactionBalanceOpen = (open: boolean) => {
    setReactionBalanceOpen(open)
  }

  globalAddReaction = (reaction: reaction) => {


    setReactionsNeeded(prev => {
      if (prev[0].fuelPointer != reaction.fuelPointer || prev[0].oxidiserPointer != reaction.oxidiserPointer) {
        throw "YOU ALWAYS NEED TO BALANCE THE FIRST EQUATION IN THE REACTIONS NEEDED ARRAY"
      }

      setReactions(prevR => {
        const j = { ...prevR }

        j[`${fuels[reaction.fuelPointer].chemicalNotation}-${oxidisers[reaction.oxidiserPointer].chemicalNotation}`] = reaction

        return j
      })

      const t = [...prev]
      t.shift()

      return t
    })
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

  useEffect(() => {
    let tReactionsNeeded: { [compositeKey: string]: { fuelPointer: number, oxidiserPointer: number } } = {}

    for (let i = 0; i < rocketFuels.length; i++) {
      for (let j = 0; j < rocketFuels[i].fuels.length; j++) {
        for (let k = 0; k < rocketFuels[i].oxidisers.length; k++) {
          if (reactions[`${fuels[rocketFuels[i].fuels[j].fuelPointer].chemicalNotation}-${oxidisers[rocketFuels[i].oxidisers[k].oxidiserPointer].chemicalNotation}`]) {
            continue
          }

          tReactionsNeeded[`${fuels[rocketFuels[i].fuels[j].fuelPointer].chemicalNotation}-${oxidisers[rocketFuels[i].oxidisers[k].oxidiserPointer].chemicalNotation}`] = { fuelPointer: rocketFuels[i].fuels[j].fuelPointer, oxidiserPointer: rocketFuels[i].oxidisers[k].oxidiserPointer };


        }

      }

    }

    let tReactionsNeededArray: { fuelPointer: number, oxidiserPointer: number }[] = []

    for (const key in tReactionsNeeded) {

      tReactionsNeededArray.push(tReactionsNeeded[key])



    }

    setReactionsNeeded(tReactionsNeededArray)
  }, [rocketFuels])

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

      <ReactionPopUp open={reactionBalanceOpen} endProducts={endProducts} fuels={fuels} oxidisers={oxidisers} reactionsNeeded={reactionsNeeded} />

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

        <button className="my-2" onClick={() => { setReactionBalanceOpen(true) }} disabled={reactionsNeeded.length == 0}>Balance Reactions</button>
      </div>
    </>
  )
}

export default PropellantCalculator