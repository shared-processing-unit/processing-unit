interface IWebsocket {
    onopen: (ev: Event) => any
    send: (message: string) => void
    onmessage: ({ data: string }) => void
}

export default class SharedProcessingUnit {
    private worker: Worker
    constructor(
        private readonly webSocket: IWebsocket,
        private readonly getData: <T>(link: string) => Promise<T>
    ) {
        if (!webSocket) {
            throw new Error('InvalidArgumentException')
        }
    }
    public run() {
        this.webSocket.onmessage = ({ data }) =>
            this.runStrategy(JSON.parse(data))
    }

    private async runStrategy({ data, algorithm }) {
        if (!(data && algorithm)) {
            throw Error(
                `algo or data not defined. recieved data:${data},algorithm:${algorithm}`
            )
        }
        this.createWorker(await this.getData(algorithm))
        this.worker.postMessage(await this.getData(data))
    }

    private async createWorker(algorithm: string) {
        const blob = new Blob([algorithm], { type: 'application/javascript' })
        this.worker && this.worker.terminate()
        this.worker = new Worker(URL.createObjectURL(blob))
        this.worker.onmessage = ({ data }) => {
            this.webSocket.send(
                JSON.stringify({
                    action: 'result',
                    data,
                })
            )
        }
    }
}
