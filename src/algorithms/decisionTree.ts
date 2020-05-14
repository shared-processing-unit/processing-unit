import Split, { evaluate } from './Split'
import Leaf from './Leaf'
import Feature, { createFilter, filterLeft, filterRight } from './Feature'
import Node from './Node'
import Options from './Options'
import { transpose } from './matrixHelper'

export const decisionTree = (
    tensor: Feature[],
    options: Options
): Node<Leaf> => {
    if (
        tensor[0].refY.length <= options.minSamplesSplit ||
        new Set(tensor[0].refY).size === 1
    ) {
        return new Node(new Leaf(tensor[0]))
    }
    const split = bestSplit(tensor)
    const [left, right] = splitFeatures(tensor, split)
    return new Node(
        new Leaf(tensor[split.featureIndex], split),
        decisionTree(left, options),
        decisionTree(right, options)
    )
}

const splitFeatures = (tensor: Feature[], split: Split) => {
    const feature = tensor[split.featureIndex]
    const filter = createFilter(feature, split.splitOn + 1)
    return [
        tensor.map(f => filterLeft(f, filter)),
        tensor.map(f => filterRight(f, filter))
    ]
}

const bestSplit = (tensor: Feature[]) => {
    const splits = tensor.map(feature => {
        const ginis = evaluate(feature.refY)
        return Array.from(new Set(feature.value)).map(value => {
            const index = feature.value.indexOf(value)
            return new Split(ginis[index], index, feature)
        })
    })
    const evaluations = [].concat(...(splits as [])) as Split[]
    const ginis = evaluations.map(({ gini }) => gini)
    const bestGini = Math.max(...ginis)
    return evaluations[ginis.indexOf(bestGini)]
}

export const createRandomForest = (
    csv: string,
    nEstimators: number,
    sampleSize: number
) => {
    const data = csv.split('\n')
    return Array(nEstimators)
        .fill({})
        .map(() => {
            return Array(sampleSize)
                .fill({})
                .map(() => Math.floor(Math.random() * data.length))
                .map(randomNumber => data[randomNumber])
                .join('\n')
        })
}

export const parseDecisionTreeSample = (csv: string) => {
    const data = transpose(
        csv.split('\n').map(row => row.split(','))
    ).map(col =>
        col
            .map(value => Number.parseFloat(value))
            .map((value, refX) => ({ value, refX }))
    )
    const X = data.slice(0, -1)
    const [Y] = data.slice(-1)
    return X.map((col, featureId) => {
        const sortedCol = col.sort((a, b) => a.value - b.value)

        const distinctValue = Array.from(
            new Set(sortedCol.map(cell => cell.value))
        )
        return {
            featureId,
            value: sortedCol.map(({ value }) => distinctValue.indexOf(value)),
            refY: sortedCol.map(({ refX }) => Y[refX].value),
            indexes: sortedCol.map(({ refX }) => refX)
        } as Feature
    })
}
