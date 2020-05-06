import { SubtaskDto } from '@shared-processing-unit/spu-models/dist'

export interface IWebsocket {
    send: (message: string) => void
    onmessage: ({ data: {} }) => Promise<void>
}

export default class SharedProcessingUnit {
    constructor(
        private readonly webSocket: IWebsocket,
        private readonly getData: (link: string) => Promise<string>
    ) {
        if (!(webSocket && getData)) {
            throw new Error('InvalidArgumentException')
        }
    }
    public run() {
        this.webSocket.onmessage = async message => {
            const task = JSON.parse(message.data as string)
            if (!(task.dataset && task.algorithm)) {
                console.error(`wrong format! ${JSON.stringify(task)}`)
                return
            }
            this.createWorker(task)
        }
    }
    private send(subtaskId: string, error?: string) {
        this.webSocket.send(
            JSON.stringify({
                action: 'onResult',
                message: { subtaskId, error }
            })
        )
    }
    private async createWorker(subTask: SubtaskDto) {
        const { subtaskId, dataset, options, algorithm, resultLink } = subTask
        const blob = new Blob([await this.getData(algorithm)], {
            type: 'application/javascript'
        })
        const worker = new Worker(URL.createObjectURL(blob))
        worker.onmessage = async ({ data }) => {
            try {
                await fetch(resultLink, {
                    body: JSON.stringify(data),
                    method: 'PUT'
                })
                this.send(subtaskId)
            } catch (error) {
                console.error(error)
                this.send(subtaskId, error)
            } finally {
                worker.terminate()
            }
        }
        worker.onerror = async ({ message }) => {
            console.error(message)
            this.send(subtaskId, message)
        }
        const data = await this.getData(dataset)
        worker.postMessage({ data, options: options && JSON.parse(options) })
    }
}
