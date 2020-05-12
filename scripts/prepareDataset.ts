import { transpose } from '../src/algorithms/matrixHelper'
import { readFileSync } from 'fs'

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
                comparativeValue: distinctRef.refX,
                y: Y[refX]
            } as ReferenceTpe
        })
    })
}

export type ReferenceTpe = {
    refX: number
    comparativeValue: number
    y: number
}

export type DecisionTreeSample = ReferenceTpe[][]

export const toString = (dt: DecisionTreeSample) => {
    const dtAsString = dt
        .map(sample =>
            sample
                .map(
                    ({ refX, comparativeValue, y }) =>
                        `${refX},${comparativeValue},${y}`
                )
                .join(',')
        )
        .join('\n')
    return dtAsString
}
export const splitDecisionTreeSampleIntoNEstimators = (
    dt: DecisionTreeSample,
    nofSamples: number,
    nofEstimators: number
): DecisionTreeSample[] => {
    const transposedDt = transpose(dt)
    console.log(transposedDt)
    const dts = Array(nofEstimators)
        .fill({})
        .map(_ => {
            const randomIndexes = Array(nofSamples)
                .fill({})
                .map(() => Math.floor(Math.random() * transposedDt.length))
                .sort((a, b) => a - b)
            return randomIndexes.map(randomIndex => transposedDt[randomIndex])
        })
    return dts
}

const parseCSV = (path: string) => {
    const file = readFileSync(path)
    return file
        .toLocaleString()
        .split('\n')
        .map(row => row.split(','))
}

export const createSampleFile = (
    pathToCsvSample: string,
    nEstimators: number,
    sampleSize: number
) => {
    const data = parseCSV(pathToCsvSample)
    const dtSample = createDecisionTreeSample(data as [])
    return splitDecisionTreeSampleIntoNEstimators(
        dtSample as [],
        sampleSize,
        nEstimators
    ).map(dt => toString(dt))
}
