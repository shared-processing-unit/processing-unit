import { writeFileSync, readFileSync } from 'fs'
import { transpose } from '../src/algorithms/matrixHelper'
import { Entries } from '../src/algorithms/Feature'
import Papa = require('papaparse')

const createCSV = (X: [][], Y: Entries, indexes: number[], delimiter = ',') => {
    const transposed = transpose(X)
    const sortedMatrix = transposed.map(column =>
        column
            .map((value, index) => ({ value, index }))
            .sort((cell1, cell2) => cell1.value - cell2.value)
            .map(({ index }) => `${indexes[index]}${delimiter}${Y[index]}`)
    )
    return transpose(sortedMatrix).join('\n')
}

export const readCsv = async (path: string) => {
    const file = readFileSync(path)
    const csv = await new Promise<[]>(resolve => {
        Papa.parse(file.toLocaleString(), {
            header: false,
            complete: ({ data }) => {
                resolve(data as [])
            }
        })
    })
    const data = transpose((csv as unknown) as [])
    const [Y] = data.slice(-1) as [string[]]
    const sortedY = [...Y].sort((a, b) => `${a}`.localeCompare(`${b}`))
    const distinctY = new Map(
        Array.from(new Set(sortedY)).map(
            (name, key) => ([name, key] as unknown) as [string, number]
        )
    )

    const X = data.slice(0, -1) as [][]
    return [transpose(X), Y.map(y => distinctY.get(y))] as [[][], Entries]
}

export default async (
    datasource: string,
    outputDirectory: string,
    nEstimators: number,
    sampleSize: number
) => {
    const [X, Y] = await readCsv(datasource)
    Array(nEstimators)
        .fill({})
        .map((_, index) => {
            const randomIndexes = Array(sampleSize)
                .fill({})
                .map(() => Math.floor(Math.random() * X.length))
            const chunkX = randomIndexes.map(index => X[index])
            const chunkY = randomIndexes.map(index => Y[index])
            writeFileSync(
                `${outputDirectory}/${index}.csv`,
                createCSV(chunkX, chunkY, randomIndexes)
            )
        })
}
