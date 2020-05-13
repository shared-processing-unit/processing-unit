import { decisionTree } from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import {
    toString,
    createDecisionTreeSample,
    readCSV,
    ReferenceTpe
} from '../scripts/prepareDataset'
import { parseCSV } from '../src/DecisionTreeWorker'
import { transpose } from '../src/algorithms/matrixHelper'

describe('createTree', () => {
    const createSamples = (dataset: string, testIndex: number) => {
        const csv = readCSV(`${__dirname}/data/${dataset}.csv`)
        const dt = transpose(createDecisionTreeSample(csv as []))
        const filteredDt = transpose(dt).map(col =>
            col.filter(cell => cell.refX !== testIndex)
        )
        const test = transpose(dt)
            .map(col => col.filter(cell => cell.refX === testIndex))
            .filter(col => col.length !== 0)
        const testsample = [].concat(...(test as [])) as ReferenceTpe[]
        return {
            trainsample: parseCSV(toString(transpose(filteredDt))),
            testsample: testsample.map(x => x.value),
            expected: testsample[0].y
        }
    }
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
                    minSamplesSplit: 10
                })
                return predict(testsample, dt) === expected
            })
        expect(predictions.filter(x => x).length).toBe(145)
    })

    it('should predict 14 right of 20.', () => {
        const irisLength = 20
        const predictions = Array(irisLength)
            .fill({})
            .map((_, index) => {
                const { testsample, trainsample, expected } = createSamples(
                    'balloons',
                    index
                )
                const dt = decisionTree(trainsample, {
                    minSamplesSplit: 4
                })
                return predictCategory(testsample, dt) === expected
            })
        expect(predictions.filter(x => x).length).toBe(20)
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
