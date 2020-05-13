import { transpose } from '../../src/algorithms/matrixHelper'
import Feature from '../../src/algorithms/Feature'

export default (X: [][], Y: number[]) => {
    const transposed = transpose(X)
    return transposed.map((column, featureId) => {
        const feature = column.map((value, index) => ({ value, index }))
        const x = feature
            .sort((a, b) => a.value - b.value)
            .map(({ index }) => ({ refY: Y[index], index }))
        return {
            indexes: x.map(f => f.index),
            refY: x.map(f => f.refY),
            featureId
        } as Feature
    })
}
