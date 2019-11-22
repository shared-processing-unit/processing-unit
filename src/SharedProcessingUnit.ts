import IWebsocket from './IWebsocket'

export default class SharedProcessingUnit {
    private worker: Worker
    constructor(private readonly webSocket: IWebsocket) {
        if (!webSocket) {
            throw new Error('InvalidArgumentException')
        }
    }
    public run() {
        this.webSocket.onmessage = ({ data }) =>
            this.runStrategy(JSON.parse(data))
    }

    private runStrategy({ data, algorithm }) {
        this.createWorker(algorithm)
        this.worker.postMessage(data)
    }
    private createWorker(algorithm: string) {
        const blob = new Blob([algorithm], { type: 'application/javascript' })
        this.worker && this.worker.terminate()
        this.worker = new Worker(URL.createObjectURL(blob))
        this.worker.onmessage = ({ data }) => {
            const registerMessage = JSON.stringify({
                action: 'result',
                data,
            })
            this.webSocket.send(registerMessage)
        }
    }
}
