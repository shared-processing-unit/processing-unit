import summUp from './algorithms/summUp'

self.onmessage = ({ data: { data } }: MessageEvent) => {
    self.postMessage(summUp(data))
}
