import { decisionTree } from './algorithms/decisionTree'
import { parseSortedCSV } from './sample/createRandomForest'

self.onmessage = ({ data: { data, options } }: MessageEvent) => {
    self.postMessage(decisionTree(parseSortedCSV(data), options))
}
