import { useState } from "react";

function DataProcessor(): JSX.Element {

    const [fileData, setFileData] = useState<string>("");

    function processData(){
        const fileInput = document.getElementById("preProcessed") as HTMLInputElement;
        const file = fileInput?.files?.[0];  // Get the first selected file

        const originalDivider = (document.getElementById("originalDivider") as HTMLInputElement).valueAsNumber ? (document.getElementById("originalDivider") as HTMLInputElement).valueAsNumber : 1
        const originalOffset = (document.getElementById("originalOffset") as HTMLInputElement).valueAsNumber ? (document.getElementById("originalOffset") as HTMLInputElement).valueAsNumber : 0
        const newDivider = (document.getElementById("newDivider") as HTMLInputElement).valueAsNumber ? (document.getElementById("newDivider") as HTMLInputElement).valueAsNumber : 1
        const newOffset = (document.getElementById("newOffset") as HTMLInputElement).valueAsNumber ? (document.getElementById("newOffset") as HTMLInputElement).valueAsNumber : 0

        if (file) {
          const reader = new FileReader();
    
          // This will run when the file is successfully read
          reader.onload = function(event) {
            const result = event.target?.result as string;
            // Here you can now process the data

            let values : number[]= JSON.parse(result)

            console.log(values)

            let i = 0

            while (i < values.length){
                console.log(values.length-i)

                let oldMeasure = (values[i] * originalDivider) - originalOffset
                values[i] = (oldMeasure + newOffset) / newDivider

                i+= 1;
            }

            setFileData(JSON.stringify(values))

          };
    
          // Read the file as text
          reader.readAsText(file);
        } else {
          alert("No file selected");
        }
    }

    return (
      <div className="text-white *:m-3">
        <div>
        Data Processor for HX711 loadcell - For a given file containing a list of numbers in JSON formatting, it will output another list of numbers where, a<sub>n</sub>= ((o<sub>n</sub> * o<sub>d</sub> - o<sub>o</sub>) / n<sub>d</sub>) + n<sub>o</sub>
        <div>
          o<sub>n</sub> : nth elemnt of the input
          <br />
          o<sub>d</sub> : Original divider
          <br />
          o<sub>o</sub> : Original offset
          <br />
          n<sub>d</sub> : New dividel
          <br />
          n<sub>o</sub> : New offset
        </div>
        </div>
        
        <input type="file" accept=".txt" name="Original Values" id="preProcessed" />
        
        <hr />
        <input type="number" className="text-black" name="" id="originalOffset"/> Original Offset
        <br />
        <input type="number" className="text-black" name="" id="originalDivider"/> Original Divider

        <hr />
        <input type="number" className="text-black" name="" id="newOffset" /> New Offset
        <br />
        <input type="number" className="text-black" name="" id="newDivider"/> New Divider
        <hr />

        <input type="button" value="Process Data" className="bg-white text-black p-1 hover:cursor-pointer active:bg-slate-300" onClick={processData}/>

        <hr />

        <div id="newValues" className="text-wrap w-[95vw]" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
            {fileData}
        </div>
      </div>
    )
  }
  
  export default DataProcessor