import { decisionTree } from './algorithms/decisionTree'

self.onmessage = ({ data: { data, options } }: MessageEvent) => {
    self.postMessage(decisionTree(data, options))
}
