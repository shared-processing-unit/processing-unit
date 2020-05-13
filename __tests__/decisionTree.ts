import { decisionTree } from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import {
    toString,
    createDecisionTreeSample,
    readCSV
} from '../scripts/prepareDataset'
import { parseCSV } from '../src/DecisionTreeWorker'
import { transpose } from '../src/algorithms/matrixHelper'

describe('createTree', () => {
    const createSamples = (dataset: string, testIndex: number) => {
        const csv = readCSV(`${__dirname}/data/${dataset}.csv`)
        const dt = transpose(createDecisionTreeSample(csv as []))
        const trainsample = parseCSV(toString(dt))
        const comperativeValue = trainsample.map(feature => {
            const index = feature.indexes.indexOf(testIndex)
            return feature.value[index]
        })
        const [expected] = trainsample.map(feature => {
            const index = feature.indexes.indexOf(testIndex)
            return feature.refY[index]
        })

        return {
            trainsample: parseCSV(toString(dt)),
            testsample: comperativeValue,
            expected
        }
    }

    it('should predict 5 right of 5.', () => {
        const irisLength = 5
        const predictions = Array(irisLength)
            .fill({})
            .map((_, index) => {
                const { testsample, trainsample, expected } = createSamples(
                    'test',
                    index
                )
                const dt = decisionTree(trainsample, {
                    minSamplesSplit: 1
                })
                const category = predict(testsample, dt)
                return category === expected
            })
        expect(predictions.filter(x => x).length).toBe(5)
    })

    it('should predict 146 right of 150.', () => {
        const irisLength = 150
        const predictions = Array(irisLength)
            .fill({})
            .map((_, index) => {
                const { testsample, trainsample, expected } = createSamples(
                    'iris',
                    index
                )
                const dt = decisionTree(trainsample, {
                    minSamplesSplit: 2
                })
                const category = predict(testsample, dt)
                const predictedWell = category === expected
                return predictedWell
            })
        expect(predictions.filter(x => x).length).toBe(146)
    })
})

//todo refactor
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
