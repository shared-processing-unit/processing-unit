interface IWebsocket {
    onopen: (ev: Event) => any
    send: (message: string) => void
    onmessage: ({ data: string }) => void
}

export default class SharedProcessingUnit {
    private worker: Worker
    private taskId: string
    private token: string
    constructor(
        private readonly webSocket: IWebsocket,
        private readonly getData: (link: string) => Promise<string>
    ) {
        if (!webSocket) {
            throw new Error('InvalidArgumentException')
        }
    }
    public run() {
        this.webSocket.onmessage = ({ data }) =>
            this.runStrategy(JSON.parse(data))
    }

    private async runStrategy({ data, algorithm, taskId, token }) {
        if (!(data && algorithm && taskId && token)) {
            return
        }
        this.taskId = taskId
        this.token = token
        this.worker && this.worker.terminate()
        this.createWorker(await this.getData(algorithm))
        this.defineOnMessage()
        this.worker.postMessage(JSON.parse(await this.getData(data)))
    }

    private defineOnMessage() {
        this.worker.onmessage = ({ data }) => {
            this.webSocket.send(
                JSON.stringify({
                    action: 'onResult',
                    message: {
                        result: data,
                        id: this.taskId,
                        token: this.token,
                    },
                })
            )
        }
    }

    private async createWorker(algorithm: string) {
        const blob = new Blob([algorithm], { type: 'application/javascript' })
        this.worker = new Worker(URL.createObjectURL(blob))
    }
}
