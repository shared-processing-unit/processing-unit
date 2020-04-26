import iris, { irisX, irisY, example, small } from './data/iris'
import balloons, { balloonsX, balloonsY } from './data/balloons'
import { decisionTree } from '../src/algorithms/decisionTree'
import Node from '../src/algorithms/Node'
import Leaf from '../src/algorithms/Leaf'
describe('createTree', () => {
    it('should not throw an error.', () => {
        expect(() =>
            decisionTree(example, { minSamplesSplit: 2 })
        ).not.toThrowError()
    })
    it('should not throw an error on small dataset.', () => {
        expect(() =>
            decisionTree(small, { minSamplesSplit: 2 })
        ).not.toThrowError()
    })

    it('should predict 146 right of 150.', () => {
        const dt = decisionTree(iris(), { minSamplesSplit: 2 })
        const truePredictions = irisX
            .map((test) => dt && predict(test, dt, irisX))
            .filter((prediction, index) => irisY[index] === prediction)
        console.log(`${truePredictions.length} of ${irisY.length}`)
        expect(truePredictions.length).toBe(146)
    })
    it('shouldnt take too long time to create 100 dt.', () => {
        const dataset = iris()
        const start = new Date()
        Array(100)
            .fill(() => decisionTree(dataset, { minSamplesSplit: 25 }))
            .map((x) => x())
        const end = new Date()
        const time = end.getTime() - start.getTime()
        console.log(time)
        expect(time).toBeLessThan(300)
    })

    it('should performance well on balloons dataset.', () => {
        const dt = decisionTree(balloons(), { minSamplesSplit: 10 })
        const truePredictions = balloonsX
            .map((test) => dt && predictCategories(test, dt, balloonsX))
            .filter((prediction, index) => balloonsY[index] === prediction)
        console.log(`${truePredictions.length} of ${balloonsY.length}`)
        expect(truePredictions.length).toBe(20)
    })
})

const predictCategories = (
    test: number[],
    dt: Node<Leaf>,
    reference: number[][]
): number => {
    const { split } = dt.value
    if (!split || !dt.left || !dt.right) {
        return dt.value.category
    }
    return test[split.featureIndex] !==
        reference[split.index1][split.featureIndex]
        ? predict(test, dt.left, reference)
        : predict(test, dt.right, reference)
}

const predict = (
    test: number[],
    dt: Node<Leaf>,
    reference: number[][]
): number => {
    const { split } = dt.value
    if (!split || !dt.left || !dt.right) {
        return dt.value.category
    }
    return test[split.featureIndex] <=
        (reference[split.index1][split.featureIndex] +
            reference[split.index2][split.featureIndex]) /
            2
        ? predict(test, dt.left, reference)
        : predict(test, dt.right, reference)
}
