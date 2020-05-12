import Split, { evaluate } from './Split'
import Leaf from './Leaf'
import Feature, { createFilter, filterLeft, filterRight } from './Feature'
import Node from './Node'
import Options from './Options'

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

const bestSplit = (tensor: Feature[]) =>
    tensor.reduce((split, feature) => {
        const { value, splitOn } = evaluate(feature.refY)
        return split.value > value ? split : new Split(value, splitOn, feature)
    }, {} as Split)
