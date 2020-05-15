import {
    parseUnsortedCSV,
    decisionTree,
    parseSortedCSV,
    featureToString,
    filterOut,
    getValueOfRows
} from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import { readFileSync } from 'fs'
import Options from '../src/algorithms/Options'

describe('createTree', () => {
    const createPredictions = (
        file: Buffer,
        options: Options,
        predict: (test: number[], dt: Node<Leaf>) => number
    ) => {
        const csv = file.toString()
        const { length } = csv.split('\n')
        const array = Array(length)
            .fill({})
            .map((_, i) => i)
        return Array(length)
            .fill({})
            .map((_, i) => {
                const dataset = filterOut(
                    csv,
                    array.filter(x => x !== i)
                )
                const features = parseSortedCSV(parseUnsortedCSV(dataset))
                const [{ values, expected }] = getValueOfRows(csv, [i])
                const dt = decisionTree(features, options)
                return predict(values, dt) === expected
            })
    }
    it('should predict 145 of 150 right', () => {
        const file = readFileSync(`${__dirname}/data/iris.csv`)
        const predictions = createPredictions(
            file,
            { minSamplesSplit: 49 },
            predict
        )
        expect(predictions.filter(x => x).length).toBe(145)
    })
    it('should predict 20 of 20 right', () => {
        const file = readFileSync(`${__dirname}/data/balloons.csv`)
        const predictions = createPredictions(
            file,
            { minSamplesSplit: 8 },
            predictCategory
        )
        expect(predictions.filter(x => x).length).toBe(19)
    })
    it('parsed() = (parsed()^-1)^-1', () => {
        const file = readFileSync(`${__dirname}/data/iris.csv`)
        const unsortedCSV = file.toString()
        const parsed = parseUnsortedCSV(unsortedCSV)
        const features = parseSortedCSV(parsed)
        expect(featureToString(features)).toBe(parsed)
    })
})

const predictCategory = (test: number[], dt: Node<Leaf>): number => {
    const { split } = dt.value
    if (!split || !dt.left || !dt.right) {
        return dt.value.category
    }

    const { featureIndex, value1 } = split
    return test[featureIndex] !== value1
        ? predictCategory(test, dt.left)
        : predictCategory(test, dt.right)
}
const predict = (test: number[], dt: Node<Leaf>): number => {
    const { split } = dt.value
    if (!split || !dt.left || !dt.right) {
        return dt.value.category
    }

    const { featureIndex, value1, value2 } = split
    return test[featureIndex] <= (value1 + value2) / 2
        ? predict(test, dt.left)
        : predict(test, dt.right)
}
