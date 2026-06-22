import { useEffect, useState } from "react";
import { globalSetCurrentRocketFuelPointer } from "../../pages/PropellantCalculator";
import { molecule, rocketFuel } from "../../utility/chemistry";


interface RocketFuelCalcPopUpInterface {

    fuels: molecule[]
    oxidisers: molecule[]

    rocketFuels: rocketFuel[]
    currentRocketFuelPointer: null | number
}

export default function RocketFuelCalcPopUp({ currentRocketFuelPointer, rocketFuels, fuels, oxidisers }: RocketFuelCalcPopUpInterface): JSX.Element {

    const [mass, setMass] = useState<number>(10)

    useEffect(() => {
        setMass(25)
    }, [currentRocketFuelPointer])

    return (
        <dialog open={currentRocketFuelPointer != null} className="w-screen h-screen bg-black text-white z-10 *:m-1">

            {currentRocketFuelPointer != null ? (<>
                Mass : <input type="number" value={mass} onChange={(e) => setMass(Number(e.target.value))} /> g

                <br />

                {rocketFuels[currentRocketFuelPointer].oxidisers.map((val, i) => {
                    const ox = oxidisers[val.oxidiserPointer]
                    const totalOxMass = mass * (rocketFuels[currentRocketFuelPointer].oxidiserMassSum / (rocketFuels[currentRocketFuelPointer].oxidiserMassSum + rocketFuels[currentRocketFuelPointer].fuelMassSum))

                    const grams = totalOxMass * (val.ratio * ox.molarMass * rocketFuels[currentRocketFuelPointer].oxidiserAmount) / rocketFuels[currentRocketFuelPointer].oxidiserMassSum
                    return (<div key={`ox-${i}`}>{ox.chemicalNotationElement} : {grams}</div>)
                })}

                {rocketFuels[currentRocketFuelPointer].fuels.map((val, i) => {
                    const f = fuels[val.fuelPointer]
                    const totalFuelMass = mass * (rocketFuels[currentRocketFuelPointer].fuelMassSum / (rocketFuels[currentRocketFuelPointer].oxidiserMassSum + rocketFuels[currentRocketFuelPointer].fuelMassSum))

                    const grams = totalFuelMass * (val.ratio * f.molarMass * rocketFuels[currentRocketFuelPointer].fuelAmount) / rocketFuels[currentRocketFuelPointer].fuelMassSum

                    return (<div key={`fuel-${i}`}>{f.chemicalNotationElement} : {grams}</div>)
                })}





                <br />


                <button onClick={() => globalSetCurrentRocketFuelPointer(null)}>
                    Close
                </button></>
            ) : ""}

        </dialog>
    )
}