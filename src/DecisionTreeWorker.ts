import { decisionTree, parseSortedCSV } from './algorithms/decisionTree'

self.onmessage = ({ data: { data, options } }: MessageEvent) => {
    self.postMessage(decisionTree(parseSortedCSV(data), options))
}
