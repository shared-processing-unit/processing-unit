import SubtaskDto from '@shared-processing-unit/spu-models/dist/SubtaskDto'

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
        const { subtaskId, dataset, options, algorithm } = subTask
        const blob = new Blob([await this.getData(algorithm)], {
            type: 'application/javascript'
        })
        const worker = new Worker(URL.createObjectURL(blob))
        worker.onmessage = ({ data }) => {
            this.webSocket.send(
                JSON.stringify({
                    action: 'onResult',
                    message: { result: data, subtaskId }
                })
            )
            worker.terminate()
        }
        const dataAsString = await this.getData(dataset)
        worker.postMessage({
            data: JSON.parse(dataAsString),
            options: options && JSON.parse(options)
        })
    }
}
