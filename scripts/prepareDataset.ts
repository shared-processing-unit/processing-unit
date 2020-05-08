import { transpose } from '../src/algorithms/matrixHelper'

const extractXandAnonymizedY = (csv: [][]) => {
    const data = transpose(csv)
    const [Y] = data.slice(-1)
    const sortedY = [...Y].sort((a, b) => `${a}`.localeCompare(`${b}`))
    const distinctY = new Set(sortedY)
    const anonymizedY = new Map(
        Array.from(distinctY).map((name, key) => [name, key])
    )
    const X = data.slice(0, -1)
    return [transpose(X), Y.map(y => Number.parseInt(`${anonymizedY.get(y)}`))]
}

export const createCsvReferenceTable = (csv: []) => {
    const [X, Y] = extractXandAnonymizedY(csv) as [[][], []]
    const transposed = transpose(X)
    const matrix = transposed.map(column =>
        column
            .map((value, refX) => ({ value: `${value}`, refX }))
            .sort(({ value }, cell2) => value.localeCompare(cell2.value))
            .map(({ refX }) => `${refX},${Y[refX]}`)
    )
    return transpose(matrix).join('\n')
}

export const createRandomCSVChunks = (
    referenceTable: [][],
    sampleSize: number,
    nEstimators: number
) => {
    const extractedY = referenceTable.map(row =>
        row.filter((_, col) => col % 2)
    )
    return Array(nEstimators)
        .fill({})
        .map(() => {
            const randomIndexes = Array(sampleSize)
                .fill({})
                .map(() => Math.floor(Math.random() * extractedY.length))
            const row = randomIndexes
                .sort()
                .map(index => extractedY[index].map(y => `${index},${y}`))
            return row.join('\n')
        })
}
