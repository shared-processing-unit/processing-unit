import { transpose } from '../src/algorithms/matrixHelper'
import { readFileSync } from 'fs'

const anonymize = (data: []) => {
    const sorted = [...data].sort((a, b) => a - b)
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
    const dt = X.map(column => {
        const sorted = column
            .map((value, refX) => ({ value, refX }))
            .sort((a, b) => a.value - b.value)
        const anonymized = anonymize(sorted.map(({ value }) => value) as [])
        return sorted.map(({ refX, value }) => {
            const distinctRef = anonymized.indexOf(value)
            return {
                refX,
                value: distinctRef,
                y: Y[refX]
            } as ReferenceTpe
        })
    })
    return dt
}

export type ReferenceTpe = {
    refX: number
    value: number
    y: number
}

export type DecisionTreeSample = ReferenceTpe[][]

export const toString = (dt: DecisionTreeSample) => {
    const dtAsString = dt
        .map(sample =>
            sample
                .map(({ refX, value, y }) => `${refX},${value},${y}`)
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
    return Array(nofEstimators)
        .fill({})
        .map(_ => {
            const randomIndexes = Array(nofSamples)
                .fill({})
                .map(() => Math.floor(Math.random() * transposedDt.length))
                .sort((a, b) => a - b)
            return randomIndexes.map(randomIndex => transposedDt[randomIndex])
        })
}

export const readCSV = (path: string) => {
    const file = readFileSync(path, { encoding: 'utf-8' })
    return file
        .toString()
        .split('\n')
        .map(row => row.split(','))
}

export const createSampleFile = (
    pathToCsvSample: string,
    nEstimators: number,
    sampleSize: number
) => {
    const data = readCSV(pathToCsvSample)
    const dtSample = createDecisionTreeSample(data as [])
    return splitDecisionTreeSampleIntoNEstimators(
        dtSample as [],
        sampleSize,
        nEstimators
    )
}
