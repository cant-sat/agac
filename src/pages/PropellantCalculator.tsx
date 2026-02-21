import { useEffect, useState } from "react"
import { chemInited, initChem, molecule, moleculeType } from "../utility/chemistry"
import EditPopUp from "../components/propellantcalc specific/EditPopUp"
import Section from "../components/propellantcalc specific/Section"

function PropellantCalculator(): JSX.Element {

  const [oxidisers, setOxidisers] = useState<molecule[]>([])
  const [fuels, setFuels] = useState<molecule[]>([])
  const [endProducts, setEndProducts] = useState<molecule[]>([])


  const [editMoleculeData, setEditMoleculeData] = useState<{ molecule: molecule, index: number, molecules: molecule[], setMolecules: Function } | null>(null)

  useEffect(() => {
    if (!chemInited) initChem()

    window.addEventListener("beforeunload", (e) => {
      if (oxidisers.length != 0 || fuels.length != 0 || endProducts.length != 0) {
        e.preventDefault()
        e.returnValue = ""
      }
    })
  }, [])


  function closeEdit() {
    setEditMoleculeData(null)
  }

  return (
    <>
      <EditPopUp
        closeFunc={closeEdit}
        currentMoleculeData={editMoleculeData}
      />

      <div className="text-white p-2">
        
        <br /><br />

        {/* ========================= */}
        {/* FUELS */}
        {/* ========================= */}
        <Section editSetter={setEditMoleculeData} moleculeTypeName="Fuel" molecules={fuels} moleculesSetFunc={setFuels} sectionMoleculeType={moleculeType.fuel} sectionName="Fuels"/>

        <hr />

        {/* ========================= */}
        {/* OXIDISERS */}
        {/* ========================= */}

        <Section editSetter={setEditMoleculeData} moleculeTypeName="Oxidiser" molecules={oxidisers} moleculesSetFunc={setOxidisers} sectionMoleculeType={moleculeType.oxidiser} sectionName="Oxidisers"/>
        <hr />

        {/* ========================= */}
        {/* END PRODUCTS */}
        {/* ========================= */}
        <Section editSetter={setEditMoleculeData} moleculeTypeName="End Product" molecules={endProducts} moleculesSetFunc={setEndProducts} sectionMoleculeType={moleculeType.endProduct} sectionName="End Products"/>

        <hr />


      </div>
    </>
  )
}

export default PropellantCalculator