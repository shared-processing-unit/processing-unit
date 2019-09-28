import { Type } from '../types/Type'
import { Incoming } from '../types/Incoming'
import { IWebsocket } from '../interfaces/IWebsocket'
import Message from './Message'

export default class Communication {
    rootId: string
    root: HTMLElement
    registerMessage: Incoming
    webSocket: IWebsocket
    message: Message

    constructor(rootId: string, connectionId: string, clientId: string) {
        this.rootId = rootId
        this.setRoot()
        this.addTagsToRoot()

        this.registerMessage = { route: 'register', data: clientId }
        this.webSocket = new WebSocket(connectionId)
    }

    run() {
        this.webSocket.onopen = () =>
            this.webSocket.send(JSON.stringify(this.registerMessage))
        this.webSocket.onmessage = ({ data }) => this.setMessage(data)
    }

    setMessage(data: string) {
        this.message = new Message(JSON.parse(data))

        const scriptTag = document.getElementById(this.message.type)
        scriptTag.setAttribute('src', this.message.link)
    }

    setRoot() {
        this.root = document.getElementById(this.rootId)
        if (!this.root) {
            throw new Error(`Please create: <div id="${this.rootId}"></div>`)
        }
    }

    addTagsToRoot() {
        const scriptTags = Object.keys(Type)
            .map(key => Type[key])
            .map(id => {
                const script = document.createElement('script')
                script.id = id
                return script
            })

        scriptTags.forEach(tag => this.root.appendChild(tag))
    }
}
