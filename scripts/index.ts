import { readFileSync, writeFileSync } from 'fs'
import {
    createDecisionTreeSample,
    splitDecisionTreeSampleIntoNEstimators,
    toString
} from './prepareDataset'

export const parseCSV = (path: string) => {
    const file = readFileSync(path)
    return file
        .toLocaleString()
        .split('\n')
        .map(row => row.split(','))
}

export const writeSampleFile = async (
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

writeSampleFile(`${__dirname}/../__tests__/data/iris.csv`, 100, 150).then(
    files => {
        files.forEach((file, index) => {
            writeFileSync(
                `${__dirname}/../__tests__/data/iris/${index}.csv`,
                file
            )
        })
    }
)
