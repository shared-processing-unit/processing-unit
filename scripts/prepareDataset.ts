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
    return [X, Y] as [[][], number[]]
}

export const createDecisionTreeSample = (data: []): DecisionTreeSample => {
    const [X, Y] = anonymizeMatrix(data)
    return X.map(column => {
        const sorted = column
            .map((value, refX) => ({ value, refX }))
            .sort(({ value }, cell2) => `${value}`.localeCompare(cell2.value))
        const anonymized = anonymize(sorted.map(({ value }) => value) as [])
        return sorted.map(({ refX, value }) => {
            const distinctRef = sorted[anonymized.indexOf(value)]
            return {
                refX,
                comperativeValue: distinctRef.refX,
                y: Y[refX]
            } as ReferenceTpe
        })
    })
}

export type ReferenceTpe = {
    refX: number
    comperativeValue: number
    y: number
}

export type DecisionTreeSample = ReferenceTpe[][]

export const splitDecisionTreeSampleIntoNEstimators = (
    refTable: DecisionTreeSample,
    nofSamples: number,
    nofEstimators: number
): DecisionTreeSample[] => {
    return Array(nofEstimators)
        .fill({})
        .map(() => {
            const randomIndexes = Array(nofSamples)
                .fill({})
                .map(() => Math.floor(Math.random() * refTable[0].length))
                .sort()
            return randomIndexes.map(
                randomIndex =>
                    refTable.map(
                        row => row.filter(({ refX }) => refX === randomIndex)[0]
                    ) as ReferenceTpe[]
            )
        })
}
