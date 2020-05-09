/*import { decisionTree } from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import { Entry, Entries } from '../src/algorithms/Feature'
import { parseCSV } from '../src/DecisionTreeWorker'
import { createRandomCSVChunks } from '../scripts/prepareDataset'

const referenceTable = [
    [10, 1, 5, 1, 2, 1, 0, 1],
    [10, 1, 5, 1, 2, 0, 0, 1],
    [11, 1, 6, 1, 3, 0, 2, 1],
    [12, 0, 7, 0, 4, 1, 5, 1],
    [13, 0, 8, 0, 7, 0, 7, 1],
    [14, 1, 9, 1, 8, 0, 10, 1],
    [15, 1, 15, 1, 9, 1, 12, 1],
    [16, 1, 16, 1, 12, 0, 15, 1],
    [17, 0, 17, 0, 13, 0, 1, 1],
    [18, 0, 18, 0, 14, 1, 1, 0],
    [0, 1, 0, 1, 17, 0, 3, 0],
    [0, 1, 0, 1, 18, 0, 4, 1],
    [1, 1, 1, 1, 0, 1, 6, 0],
    [2, 0, 2, 0, 0, 1, 8, 0],
    [3, 0, 3, 0, 1, 1, 9, 1],
    [4, 1, 4, 1, 5, 1, 11, 0],
    [5, 1, 10, 1, 6, 1, 13, 0],
    [6, 1, 11, 1, 10, 1, 14, 1],
    [7, 0, 12, 0, 11, 1, 16, 0],
    [8, 0, 13, 0, 15, 1, 18, 0]
]*/
describe('predict', () => {
    it('shouldnt take too long time to create 100 dt.', () => {
        /*   const [randomChunk] = createRandomCSVChunks(referenceTable as [], 40, 1)
        const features = parseCSV(randomChunk)
        const dt = decisionTree(features, { minSamplesSplit: 10 })
        const category = predict([], dt, referenceTable)
        expect(category).toBe(0)*/
    })
})
/*
//todo refactor
const predict = (
    test: Entries,
    dt: Node<Leaf>,
    reference: Entries[]
): Entry => {
    const { split } = dt.value
    if (!split || !dt.left || !dt.right) {
        return dt.value.category
    }
    const first = Number.parseFloat(
        `${reference[split.index1][split.featureIndex]}`
    )
    const second = Number.parseFloat(
        `${reference[split.index2][split.featureIndex]}`
    )

    if (Number.isNaN(first) && Number.isNaN(second)) {
        return test[split.featureIndex] !==
            reference[split.index2][split.featureIndex]
            ? predict(test, dt.left, reference)
            : predict(test, dt.right, reference)
    } else {
        return test[split.featureIndex] < second
            ? predict(test, dt.left, reference)
            : predict(test, dt.right, reference)
    }
}
*/
