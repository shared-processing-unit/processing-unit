import { readFileSync, writeFileSync } from 'fs'
import {
    createRandomForest,
    getValueOfRows,
    filterOut,
    parseUnsortedCSV
} from './createRandomForest'

const file = readFileSync(`${__dirname}/../../__tests__/data/iris.csv`)
const csv = file.toString()
const testIndexes = [42, 10, 65, 110, 82, 135]
const randomNumbers = createRandomForest(150, 100, 150, testIndexes)
const testset = getValueOfRows(csv, testIndexes)
randomNumbers.map((bucket, index) => {
    const dataset = filterOut(csv, bucket)
    writeFileSync(
        `${__dirname}/../../__tests__/data/iris/${index}.csv`,
        parseUnsortedCSV(dataset)
    )
})
writeFileSync(
    `${__dirname}/../../__tests__/data/iris/test_sample.csv`,
    testset
        .map(({ values, expected }) => `${values.join(',')},${expected}`)
        .join('\n')
)
