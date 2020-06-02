import Split, { evaluate } from './Split'
import Leaf from './Leaf'
import Feature, { createFilter, filterLeft, filterRight } from './Feature'
import Node from './Node'
import Options from './Options'

export const decisionTree = (
    tensor: Feature[],
    options: Options,
    depth = 0
): Node<Leaf> => {
    if (
        tensor[0].refY.length <= options.minSamplesSplit ||
        new Set(tensor[0].refY).size === 1 ||
        (options.maxDepth && depth >= options.maxDepth)
    ) {
        return new Node(new Leaf(tensor[0]))
    }
    const split = bestSplit(tensor)
    const [left, right] = splitFeatures(tensor, split)
    return new Node(
        new Leaf(tensor[split.featureIndex], split),
        decisionTree(left, options, depth + 1),
        decisionTree(right, options, depth + 1)
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
    const bestGini = Math.min(...ginis)
    return evaluations[ginis.indexOf(bestGini)]
}
