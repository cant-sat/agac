import React from "react";


export class rocketFuel{
    public name:string = ""
    public fuels : {ratio :number, fuelPointer:number}[] = []
    public oxidisers : {ratio :number, oxidiserPointer:number}[] = []
    public oxidiserExcess : number = 0
    public description : string = ""

    public toxic : boolean = false
 
    public fuelAmount : number = 0
    public oxidiserAmount : number = 0

    public fuelRatioSum = 0
    public oxidiserRatioSum = 0

    public fuelMassSum = 0
    public oxidiserMassSum = 0


}



export class molecule {
    public name: string = "";
    public chemicalNotation: string = "";

    public heatOfFormation: number = 0;
    public density : number = -1;

    public chemicalNotationElement: React.ReactElement = (<></>);

    public elementsById: Uint16Array = new Uint16Array(118).fill(0);
    public elementsIdList: number[] = []

    public oxygenAmount: number = 0 // positive for oxidisers, negative for fuels (positive is the amount of oxygen it can give, negative is the amount of oxygen it needs to burn)


    public moleculeType: moleculeType = -1

    public molarMass = 0

    public toxic : boolean = false 

    public static moleculeFromNotation(
        moleculeName: string,
        moleculeChemicalNotation: string,
        moleculeHeatOfFormation: number,
        tMoleculeType: moleculeType,
        moleculeDensity : number,
        toxic : boolean,
        oxygenAmount : number
    ): molecule | string {
        

        if (moleculeChemicalNotation == "" || moleculeName == "") {
            return "A name and chemical notation is needed"
        }
        if (!chemInited) {
            throw "chem needs to be inited"
        }

        let retmolecule: molecule = new molecule;

        retmolecule.heatOfFormation = moleculeHeatOfFormation
        retmolecule.name = moleculeName;
        retmolecule.chemicalNotation = moleculeChemicalNotation;
        retmolecule.moleculeType = tMoleculeType;
        retmolecule.density = moleculeDensity
        retmolecule.toxic = toxic

        const notationParts: React.ReactNode[] = [];

        if(tMoleculeType == moleculeType.oxidiser){
            retmolecule.oxygenAmount = Math.abs(oxygenAmount)
        }
        else if(tMoleculeType == moleculeType.fuel){
            retmolecule.oxygenAmount = -Math.abs(oxygenAmount)
        }

        for (let i = 0; i < moleculeChemicalNotation.length; i += 0) {



            let currentElement: number = -1;
            let currentElementAmount: number = 1;
            let iOffset = 1;

            // Validate capitalization
            if (
                moleculeChemicalNotation[i].toLocaleLowerCase() == moleculeChemicalNotation[i] ||
                !moleculeChemicalNotation[i].match(/[a-z]/i)
            ) {

                return "molecules chemical notation is not valid (capitalisation or numbers in wrong spot or illegal charachter)";
            }
            else {
                let currentElementNotation: string = moleculeChemicalNotation[i];


                // Check for 2-letter element
                if (
                    i < moleculeChemicalNotation.length - 1 &&
                    moleculeChemicalNotation[i + 1].toLocaleLowerCase() == moleculeChemicalNotation[i + 1] &&
                    moleculeChemicalNotation[i + 1].match(/[a-z]/i)

                ) {

                    currentElementNotation += moleculeChemicalNotation[i + 1];
                    iOffset++;
                }



                // Check if element exists
                if (elements[currentElementNotation]) {
                    currentElement = elements[currentElementNotation].number - 1;
                    notationParts.push(currentElementNotation)
                } else {

                    return `element ${currentElementNotation} does not exist`;
                }

                // Check for numbers
                if (
                    i < moleculeChemicalNotation.length - currentElementNotation.length &&
                    moleculeChemicalNotation[i + currentElementNotation.length].match(/[0-9]/i)
                ) {



                    iOffset++;
                    let j = i + currentElementNotation.length + 1;

                    currentElementAmount = Number(
                        moleculeChemicalNotation[i + currentElementNotation.length]
                    );
                    notationParts.push(<sub>{moleculeChemicalNotation[i + currentElementNotation.length]}</sub>)


                    while (
                        j < moleculeChemicalNotation.length &&
                        moleculeChemicalNotation[j].match(/[0-9]/i)
                    ) {
                        notationParts.push(<sub>{moleculeChemicalNotation[j]}</sub>)
                        currentElementAmount *= 10;
                        currentElementAmount += Number(moleculeChemicalNotation[j]);
                        j++;
                        iOffset++;
                    }

                }


            }



            i += iOffset;


            retmolecule.elementsIdList.push(currentElement)
            retmolecule.elementsById[currentElement] += currentElementAmount;
            retmolecule.molarMass += elementsById[currentElement].mass * currentElementAmount

        }
        retmolecule.chemicalNotationElement = (<>{notationParts}</>);

        return retmolecule;
    }
}

export type ElementType = {
    symbol: string
    number: number
    name: string
    mass: number
}

export enum moleculeType {
    unassigned = -1,
    oxidiser,
    fuel,
}

export let elements: { [key: string]: ElementType } = {}
export let elementsById: ElementType[] = []
export let chemInited = false

export function initChem() {
    if (chemInited) {
        return
    }

    fetch("/data/elements.json")
        .then((resp) => resp.json())
        .then((val) => {
            elements = val

            let telementsById: ElementType[] = new Array<ElementType>(118)

            for (let key in val) {
                telementsById[val[key].number - 1] = val[key]
            }

            elementsById = telementsById

           
                chemInited = true

           
            



        })

}