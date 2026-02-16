import { useState } from "react"

function PropellantCalculator(): JSX.Element {
  const [reactants, setReactants] = useState([])
  const [products, setProducts] = useState([])

  const elements: {}

  return (
    <div className="text-white p-2">
      Put in the compounds you want to balance the reaction for
      <br />
      <br />
      <button type="button">Add a Reactant</button>

      <hr />

      <button type="button">Add a Product</button>
    </div>

  )
}

export default PropellantCalculator