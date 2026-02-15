//import { useState } from "react"

function PropellantCalculator(): JSX.Element {
    //const [reactants, setReactants] = useState([])
    //const [products, setProducts] = useState([])

    return (
      <div className="text-white">
        Put in the compounds you want to balance the reaction for
        <br />
        <br />
        <button type="button">Add a Reactant</button>
        <br />
        <button type="button">Remove a Reactant</button>
        <hr />

        <button type="button">Add a Product</button>
        <br />
        <button type="button">Remove a Product</button>
      </div>

    )
  }
  
  export default PropellantCalculator