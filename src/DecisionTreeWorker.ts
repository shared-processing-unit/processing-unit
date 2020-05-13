import { decisionTree } from './algorithms/decisionTree'
import Feature from './algorithms/Feature'
import { transpose } from './algorithms/matrixHelper'

export const parseCSV = (csv: string, delimiter: string = ',') => {
    const rows = transpose(csv.split('\n').map(row => row.split(delimiter)))
    const data = rows.map(row => row.map(c => Number.parseInt(c)))
    const features = Array(data.length / 3)
        .fill({})
        .map(
            (_, featureId) =>
                ({
                    indexes: data[featureId * 3],
                    value: data[featureId * 3 + 1],
                    refY: data[featureId * 3 + 2],
                    featureId
                } as Feature)
        )
    return features
}

self.onmessage = ({ data: { data, options } }: MessageEvent) => {
    self.postMessage(decisionTree(parseCSV(data), options))
}
