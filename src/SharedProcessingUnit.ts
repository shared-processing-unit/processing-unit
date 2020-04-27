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
    private async createWorker(subTask: SubtaskDto) {
        const { subtaskId, dataset, options, algorithm, resultLink } = subTask
        const blob = new Blob([await this.getData(algorithm)], {
            type: 'application/javascript'
        })
        const worker = new Worker(URL.createObjectURL(blob))
        worker.onmessage = async ({ data }) => {
            try {
                console.log(subTask)
                const result = await fetch(resultLink, {
                    body: data,
                    headers: { method: 'PUT' }
                })
                console.log(result)
                this.webSocket.send(
                    JSON.stringify({
                        action: 'onResult',
                        message: { result: data, subtaskId }
                    })
                )
            } catch (error) {
                console.error(error)
            } finally {
                worker.terminate()
            }
        }
        const dataAsString = await this.getData(dataset)
        worker.postMessage({
            data: JSON.parse(dataAsString),
            options: options && JSON.parse(options)
        })
    }
}
