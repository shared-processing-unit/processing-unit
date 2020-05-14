import { readFileSync, writeFileSync } from 'fs'
import { createRandomForest } from '../src/algorithms/decisionTree'

const file = readFileSync(`${__dirname}/../__tests__/data/iris.csv`)

createRandomForest(file.toString(), 100, 150).map((file, index) =>
    writeFileSync(`${__dirname}/../__tests__/data/iris/${index}.csv`, file)
)
