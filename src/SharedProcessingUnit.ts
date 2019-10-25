import IWebsocket from './IWebsocket'
import { Routes } from './Routes'

export default class SharedProcessingUnit {
    private worker: Worker
    constructor(
        private readonly webSocket: IWebsocket,
        private readonly clientId: string
    ) {
        if (!(webSocket && clientId)) {
            throw new Error('InvalidArgumentException')
        }
    }
    public run() {
        this.defineOnMessage()
        this.register()
    }

    private defineOnMessage() {
        this.webSocket.onmessage = ({ data }) => {
            this.runStrategy(JSON.parse(data))
        }
    }
    private runStrategy({ data, routes }) {
        if (routes === Routes.Algorithm) {
            this.createWorker(data)
        }
        if (routes === Routes.Data) {
            this.worker.postMessage(data)
        }
    }
    private register() {
        const registerMessage = JSON.stringify({
            route: Routes.Register,
            data: this.clientId,
        })
        this.webSocket.onopen = () => this.webSocket.send(registerMessage)
    }
    private createWorker(algorithm: string) {
        const blob = new Blob([algorithm], { type: 'application/javascript' })
        this.worker = new Worker(URL.createObjectURL(blob))
        this.worker.onmessage = ({ data }) => {
            const registerMessage = JSON.stringify({
                route: Routes.Result,
                data,
            })
            this.webSocket.send(registerMessage)
        }
    }
}
