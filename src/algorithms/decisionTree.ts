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
        !tensor.every(
            x =>
                x.indexes.length === x.refY.length &&
                x.refY.length === x.value.length &&
                tensor.filter(y => y.indexes.length !== x.indexes.length)
                    .length === 0
        )
    ) {
        throw Error('csv not well formated.')
    }
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
    dataLength: number,
    nEstimators: number,
    sampleSize: number,
    filter: number[]
) => {
    return Array(nEstimators)
        .fill({})
        .map(() => {
            return Array(sampleSize)
                .fill({})
                .map(() => {
                    let randomValue = -1
                    do {
                        randomValue = Math.floor(Math.random() * dataLength)
                    } while (filter.indexOf(randomValue) !== -1)
                    return randomValue
                })
                .sort((a, b) => a - b)
        })
}

export const featureToString = (features: Feature[]) => {
    return features
        .map(feature => {
            return [
                feature.indexes.join(','),
                feature.value.join(','),
                feature.refY.join(',')
            ].join('\n')
        })
        .join('\n')
}

export const parseUnsortedCSV = (csv: string) => {
    const data = transpose(
        csv.split('\n').map(row => row.split(','))
    ).map(col =>
        col
            .map(value => Number.parseFloat(value))
            .map((value, refX) => ({ value, refX }))
    )
    const X = data.slice(0, -1)
    const [Y] = data.slice(-1)
    return X.map(col => {
        const sortedCol = col.sort((a, b) => a.value - b.value)

        const distinctValue = Array.from(
            new Set(sortedCol.map(cell => cell.value))
        )
        return [
            sortedCol.map(({ refX }) => refX).join(','),
            sortedCol
                .map(({ value }) => distinctValue.indexOf(value))
                .join(','),
            sortedCol.map(({ refX }) => Y[refX].value).join(',')
        ].join('\n')
    }).join('\n')
}

export const parseSortedCSV = (csv: string) => {
    const nofColumns = 3
    const data = csv
        .split('\n')
        .map(row => row.split(','))
        .map(col => col.map(value => Number.parseFloat(value)))

    return Array(data.length / nofColumns)
        .fill({})
        .map((_, featureId) => {
            return {
                featureId,
                indexes: data[featureId * nofColumns],
                value: data[featureId * nofColumns + 1],
                refY: data[featureId * nofColumns + 2]
            } as Feature
        })
}

export const filterOut = (csv: string, selectedRowIndex: number[]) => {
    const rows = csv.split('\n')
    return selectedRowIndex.map(index => rows[index]).join('\n')
}

export const getValueOfRows = (csv: string, selectedRowIndex: number[]) => {
    const features = parseSortedCSV(parseUnsortedCSV(csv))
    return selectedRowIndex.map(index => {
        const values = features.map(
            feature => feature.value[feature.indexes.indexOf(index)]
        )
        const expected = features[0].refY[features[0].indexes.indexOf(index)]
        return { values, expected }
    })
}
