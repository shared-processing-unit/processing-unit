import { transpose } from '../src/algorithms/matrixHelper'

const anonymize = (data: []) => {
    const sorted = [...data].sort((a, b) => `${a}`.localeCompare(`${b}`))
    const distinct = Array.from(new Set(sorted))
    return data.map(value => distinct.indexOf(value))
}

const anonymizeMatrix = (csv: [][]) => {
    const data = transpose(csv).map(row => anonymize(row as []))
    const [Y] = data.slice(-1)
    const X = data.slice(0, -1)
    return [X, Y] as [[][], []]
}

export const createCsvReferenceTable = (csv: []) => {
    const [X, Y] = anonymizeMatrix(csv)
    const matrix = X.map(column => {
        const sorted = column
            .map((value, refX) => ({ value, refX }))
            .sort(({ value }, cell2) => `${value}`.localeCompare(cell2.value))
        const anonymized = anonymize(sorted.map(({ value }) => value) as [])
        return sorted.map(({ refX, value }) => {
            const distinctRef = sorted[anonymized.indexOf(value)]
            return `${distinctRef.refX},${Y[refX]}`
        })
    })
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
