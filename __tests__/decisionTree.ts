import {
    parseDecisionTreeSample,
    decisionTree,
    createRandomForest
} from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import { readFileSync } from 'fs'
import Feature from '../src/algorithms/Feature'

describe('createTree', () => {
    const createSamples = (features: Feature[], testIndex: number) => {
        const trainSample = features.map(feature => {
            const index = feature.indexes.indexOf(testIndex)
            return {
                featureId: feature.featureId,
                indexes: feature.indexes.filter((_, ii) => ii !== index),
                value: feature.value.filter((_, ii) => ii !== index),
                refY: feature.refY.filter((_, ii) => ii !== index)
            } as Feature
        })
        const testSample = features.map(feature => {
            const index = feature.indexes.indexOf(testIndex)
            return feature.value[index]
        })

        const expected =
            features[0].refY[features[0].indexes.indexOf(testIndex)]

        return { expected, testSample, trainSample }
    }

    it('should predict 145 of 150 right', () => {
        const file = readFileSync(`${__dirname}/data/iris.csv`)
        const features = parseDecisionTreeSample(file.toString())
        const predictions = Array(features[0].indexes.length)
            .fill({})
            .map((_, i) => {
                const { trainSample, testSample, expected } = createSamples(
                    features,
                    i
                )
                const dt = decisionTree(trainSample, { minSamplesSplit: 10 })
                return predict(testSample, dt) === expected
            })

        expect(predictions.filter(x => x).length).toBe(145)
    })
    it('should predict 20 of 20 right', () => {
        const file = readFileSync(`${__dirname}/data/balloons.csv`)
        const features = parseDecisionTreeSample(file.toString())
        const predictions = Array(features[0].indexes.length)
            .fill({})
            .map((_, i) => {
                const { trainSample, testSample, expected } = createSamples(
                    features,
                    i
                )
                const dt = decisionTree(trainSample, { minSamplesSplit: 8 })
                return predictCategory(testSample, dt) === expected
            })

        expect(predictions.filter(x => x).length).toBe(19)
    })

    it('should predict 145 of 150 right', () => {
        const file = readFileSync(`${__dirname}/data/iris.csv`)
        const [sample] = createRandomForest(file.toString(), 1, 1000)
        const features = parseDecisionTreeSample(sample)
        const predictions = Array(features[0].indexes.length)
            .fill({})
            .map((_, i) => {
                const { trainSample, testSample, expected } = createSamples(
                    features,
                    i
                )
                const dt = decisionTree(trainSample, { minSamplesSplit: 1 })
                return predict(testSample, dt) === expected
            })

        expect(predictions.filter(x => x).length).toBe(predictions)
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
