import Papa = require('papaparse')
import { readFileSync, writeFileSync, writeFile } from 'fs'
import {
    createCsvReferenceTable,
    createRandomCSVChunks
} from './prepareDataset'

const parseCSV = async (path: string) => {
    const file = readFileSync(path)
    return await new Promise<[]>(resolve => {
        Papa.parse(file.toLocaleString(), {
            header: false,
            complete: ({ data }) => resolve(data as [])
        })
    })
}

export const createDataset = async (
    trainSample: string,
    outDirectory: string,
    nEstimators: number,
    sampleSize: number
) => {
    const referencePath = `${outDirectory}/reference_table.csv`
    const csv = await parseCSV(trainSample)
    writeFileSync(referencePath, createCsvReferenceTable(csv))
    const referenceTable = await parseCSV(referencePath)
    await Promise.all(
        createRandomCSVChunks(referenceTable, sampleSize, nEstimators).map(
            (file, id) => {
                new Promise(resolve =>
                    writeFile(`${outDirectory}/${id}.csv`, file, () =>
                        resolve(true)
                    )
                )
            }
        )
    )
}
