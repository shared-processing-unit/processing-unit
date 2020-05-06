import { irisX, irisY } from './data/iris'
import createDataset from './data/helper'
import { balloonsX, balloonsY } from './data/balloons'
import { decisionTree } from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
import { Entry, Entries } from '../src/algorithms/Feature'

describe('createTree', () => {
    it('should predict 146 right of 150.', async () => {
        const dt = decisionTree(createDataset(irisX as [], irisY), {
            minSamplesSplit: 2
        })
        const truePredictions = irisX
            .map(test => dt && predict(test, dt, irisX))
            .filter((prediction, index) => irisY[index] === prediction)
        console.log(`${truePredictions.length} of ${irisY.length}`)
        expect(truePredictions.length).toBe(146)
    })
    it('shouldnt take too long time to create 100 dt.', () => {
        const dataset = createDataset(irisX as [], irisY)
        const start = new Date()
        Array(100)
            .fill(() => decisionTree(dataset, { minSamplesSplit: 25 }))
            .map(x => x())
        const end = new Date()
        const time = end.getTime() - start.getTime()
        console.log(time)
        expect(time).toBeLessThan(300)
    })

    it('should performance well on balloons dataset.', () => {
        const dt = decisionTree(createDataset(balloonsX as [], balloonsY), {
            minSamplesSplit: 10
        })
        const predictions = balloonsX.map(
            test => dt && predict(test, dt, balloonsX)
        )
        const truePredictions = predictions.filter(
            (prediction, index) => balloonsY[index] === prediction
        )
        console.log(`${truePredictions.length} of ${balloonsY.length}`)
        expect(truePredictions.length).toBe(20)
    })
})

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
        const sum = first + second
        return test[split.featureIndex] <= sum / 2
            ? predict(test, dt.left, reference)
            : predict(test, dt.right, reference)
    }
}
