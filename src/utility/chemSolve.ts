function gcd(a: number, b: number) {
    // a will be the higher of the two numbers
    a = Math.abs(a)
    b = Math.abs(b)

    if (a < b) {
        const t = b
        b = a
        a = t
    }

    if (b == 0) {
        return a == 0 ? 1 : a
    }

    while (b != 0) {
        a = a % b

        if (a < b) {
            const t = b
            b = a
            a = t
        }
    }

    return a
}

function lcm(a: number, b: number) {
    return a * b / gcd(a, b)
}



class fraction {
    // numerator / denominator
    numerator: number
    denominator: number

    constructor(p: number, q: number) {
        if (q === 0) throw "division by zero"

        // normalize sign → denominator always positive
        if (q < 0) {
            p = -p
            q = -q
        }

        this.numerator = p
        this.denominator = q
    }

    simplify(): fraction {
        const g = gcd(this.numerator, this.denominator)
        this.numerator /= g
        this.denominator /= g
        return this
    }

    static add(a: fraction, b: fraction): fraction {
        return new fraction(
            a.numerator * b.denominator + b.numerator * a.denominator,
            a.denominator * b.denominator
        ).simplify()
    }

    static subtract(a: fraction, b: fraction): fraction {
        return fraction.add(a, new fraction(-b.numerator, b.denominator))
    }

    static multiply(a: fraction, b: fraction): fraction {
        return new fraction(
            a.numerator * b.numerator,
            a.denominator * b.denominator
        ).simplify()
    }

    static divide(a: fraction, b: fraction): fraction {
        return new fraction(
            a.numerator * b.denominator,
            a.denominator * b.numerator
        ).simplify()
    }

    toString(): string {
        return `${this.numerator}/${this.denominator}`
    }

    toNumber(): number {
        return this.numerator / this.denominator
    }
}



function toRowEchelon(matrixToConvert: fraction[][]): [fraction[][], [number, number][]] {
    const matrix = matrixToConvert.map(row => [...row])

    const matrixRowsNumber = matrix.length

    const swaps: [number, number][] = []

    if (matrixRowsNumber == 0) {
        return [[], []]
    }

    const matrixColumnsNumber = matrix[0].length

    if (matrixColumnsNumber == 0) {
        return [[], []]
    }

    if (!matrix.every(row => row.length == matrixColumnsNumber)) {
        throw "every single row has to be the same length"
    }

    let pivot: { row: number, column: number } = { column: 0, row: 0 } // matrix[pivot.row][pivot.column]

    while (pivot.row < matrixRowsNumber && pivot.column < matrixColumnsNumber - 1) {
        // 
        if (matrix[pivot.row][pivot.column].numerator == 0) {
            for (let r = pivot.row + 1; r < matrixRowsNumber; r++) {

                if (matrix[r][pivot.column].numerator != 0) {
                    swaps.push([r, pivot.row])

                    const tempRow = matrix[r]
                    matrix[r] = matrix[pivot.row]
                    matrix[pivot.row] = tempRow
                    break
                }

            }
            if (matrix[pivot.row][pivot.column].numerator != 0) {
                continue
            }
            pivot.column++;
            continue
        }

        //normalize row for pivot
        for (let c = matrixColumnsNumber - 1; c != pivot.column - 1; c--) {
            matrix[pivot.row][c] = fraction.divide(matrix[pivot.row][c], matrix[pivot.row][pivot.column])
        }

        //downward pass
        for (let r = pivot.row + 1; r < matrixRowsNumber; r++) {
            const multiple = matrix[r][pivot.column]
            for (let c = pivot.column; c < matrixColumnsNumber; c++) {
                //matrix[r][c] = matrix[r][c] - matrix[pivot.row][c] * multiple

                matrix[r][c] = fraction.subtract(matrix[r][c], fraction.multiply(matrix[pivot.row][c], multiple))
            }
        }

        if (pivot.row > 0) {
            //upward pass

            for (let r = pivot.row - 1; r >= 0; r--) {
                const multiple = matrix[r][pivot.column]

                for (let c = pivot.column; c < matrixColumnsNumber; c++) {
                    //matrix[r][c] = matrix[r][c] - matrix[pivot.row][c] * multiple
                    matrix[r][c] = fraction.subtract(matrix[r][c], fraction.multiply(matrix[pivot.row][c], multiple))
                }

            }
        }


        pivot.column++;
        pivot.row++
    }


    return [matrix, swaps]
}

function findNullSpace(RREF: fraction[][], swaps: [number, number][]): number[] {

    const coefficents: number[] = []

    let freeVar = 1
    for (let i = 0; i < RREF.length; i++) {
        freeVar = lcm(freeVar, RREF[i][RREF[i].length - 1].denominator)
    }



    for (let i = 0; i < Math.min(RREF.length, RREF[0].length -1); i++) {
        coefficents.push(Math.abs(RREF[i][RREF[i].length - 1].toNumber() * freeVar))

    }


    coefficents.push(freeVar)

    for (let i = 0; i < swaps.length; i++) {

        const t = coefficents[swaps[i][0]]
        coefficents[swaps[i][0]] = coefficents[swaps[i][1]]
        coefficents[swaps[i][1]] = t
    }

    return coefficents
}

// helper to convert number matrix → fraction matrix
function toFractionMatrix(arr: number[][]): fraction[][] {
    return arr.map(row =>
        row.map(val => new fraction(val, 1))
    )
}

// helper to print matrix
function printMatrix(matrix: fraction[][]): void {
    for (const row of matrix) {
        console.log(row.map(cell => cell.toString()).join("\t"))
    }
}

// TEST CASE
const input = [
    [2, 0, 2], // H
    [0, 2, 1], // O
]

const fractionMatrix = toFractionMatrix(input)

const result = toRowEchelon(fractionMatrix)

const coefficents = findNullSpace(result[0], result[1])

console.log("RREF Result:")
printMatrix(result[0])

console.log("Coefficents")
console.log(coefficents)