import SubTask from 'spu.models/dist/SubTask'

export interface IWebsocket {
    send: (message: string) => void
    onmessage: ({ data: string }) => Promise<void>
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
            const task = JSON.parse(message.data)
            if (!(task.data && task.algorithm && task.taskId)) {
                return
            }
            this.createWorker(task)
        }
    }
    private async createWorker(subTask: SubTask) {
        const { taskId, subtaskId, data, options, algorithm } = subTask
        const blob = new Blob([await this.getData(algorithm)], {
            type: 'application/javascript',
        })
        const worker = new Worker(URL.createObjectURL(blob))
        worker.onmessage = ({ data }) => {
            this.webSocket.send(
                JSON.stringify({
                    action: 'onResult',
                    message: { result: data, taskId, subtaskId },
                })
            )
            worker.terminate()
        }
        worker.postMessage({
            data: JSON.parse(await this.getData(data)),
            options: options && JSON.parse(options),
        })
    }
}
