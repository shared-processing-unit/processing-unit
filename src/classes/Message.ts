export default class Message {
    type: string
    link: string

    constructor(data: Message) {
        this.validateMessage(data)
        this.type = data.type
        this.link = data.link
    }

    validateMessage(data: Message) {
        if (!(data && data.link && data.type)) {
            throw new Error('loadScript InvalidArgumentException')
        }
    }
}
