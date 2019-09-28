import { Message, Incomming } from './Message'
export interface IWebsocket {
    send: (incomming: Incomming) => void
    on: (name: string, listener: (message: Message) => void) => {}
}
