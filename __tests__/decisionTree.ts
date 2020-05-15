import {
    parseUnsortedCSV,
    decisionTree,
    createSamples,
    parseSortedCSV,
    createRandomForest,
    featureToString
} from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import { readFileSync } from 'fs'

describe('createTree', () => {
    it('should predict 145 of 150 right', () => {
        const file = readFileSync(`${__dirname}/data/iris.csv`)
        const features = parseSortedCSV(parseUnsortedCSV(file.toString()))
        const predictions = Array(features[0].indexes.length)
            .fill({})
            .map((_, i) => {
                const {
                    sample1,
                    valuesSample2,
                    expectedSample2
                } = createSamples(features, [i])
                const dt = decisionTree(sample1, { minSamplesSplit: 10 })
                return predict(valuesSample2[0], dt) === expectedSample2[0]
            })

        expect(predictions.filter(x => x).length).toBe(146)
    })
    it('should predict 20 of 20 right', () => {
        const file = readFileSync(`${__dirname}/data/balloons.csv`)
        const features = parseSortedCSV(parseUnsortedCSV(file.toString()))
        const predictions = Array(features[0].indexes.length)
            .fill({})
            .map((_, i) => {
                const {
                    sample1,
                    valuesSample2,
                    expectedSample2
                } = createSamples(features, [i])
                const dt = decisionTree(sample1, { minSamplesSplit: 8 })
                return (
                    predictCategory(valuesSample2[0], dt) === expectedSample2[0]
                )
            })

        expect(predictions.filter(x => x).length).toBe(20)
    })
    it('test random forest', () => {
        const file = readFileSync(`${__dirname}/data/iris.csv`)
        const features = parseSortedCSV(parseUnsortedCSV(file.toString()))
        const [testIndexes] = createRandomForest(150, 1, 4, [])
        const { sample1, valuesSample2, expectedSample2 } = createSamples(
            features,
            testIndexes
        )
        const dts = createRandomForest(
            sample1[0].indexes.length,
            1,
            150,
            testIndexes
        ).map(randomNumbers => {
            const samples = createSamples(sample1, randomNumbers)
            const dt = decisionTree(samples.sample2, {
                minSamplesSplit: 10
            })

            return dt
        })
        valuesSample2.map((testSample, i) => {
            const predictions = dts.map(dt => predict(testSample, dt))
            const occurencies = predictions.reduce((prev, current) => {
                const occ = prev.get(current) || 0
                return prev.set(current, occ + 1)
            }, new Map<number, number>())
            console.log(occurencies, expectedSample2[i])
        })
        /*3  console.log(
            `performance DT: ${
                performanceDt.filter(x => x).length / performanceDt.length
            }`
        )*/
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
