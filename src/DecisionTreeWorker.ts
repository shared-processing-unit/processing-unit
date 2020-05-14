import {
    decisionTree,
    parseDecisionTreeSample
} from './algorithms/decisionTree'

self.onmessage = ({ data: { data, options } }: MessageEvent) => {
    self.postMessage(decisionTree(parseDecisionTreeSample(data), options))
}
