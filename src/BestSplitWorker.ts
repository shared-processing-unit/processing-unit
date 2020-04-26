import { evaluate } from './algorithms/Split'

self.onmessage = ({ data: { data } }: MessageEvent) => {
    self.postMessage(evaluate(data))
}
