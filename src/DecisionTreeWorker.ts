import { decisionTree } from './algorithms/decisionTree'
import { transpose } from './algorithms/matrixHelper'
import Feature from './algorithms/Feature'

export const parseCSV = (csv: string, delimiter: string = ',') => {
    const rows = csv.split('\n')
    const data = transpose(rows.map(row => row.split(delimiter)))
    const filterOutY = data.filter((_, index) => !(index % 2))
    const parsedIndexes = filterOutY.map(indexes =>
        indexes.map(index => Number.parseInt(index))
    )
    const features = parsedIndexes.map(
        (indexes, featureId) =>
            ({
                indexes,
                refY: data[featureId * 2 + 1],
                featureId
            } as Feature)
    )
    return features
}

self.onmessage = ({ data: { data, options } }: MessageEvent) => {
    const features = parseCSV(data)
    console.log(JSON.stringify(features))
    self.postMessage(decisionTree(features, options))
}
