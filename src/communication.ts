import * as WebSocket from 'ws'
import { Type } from './Type'
import { Message, Incomming } from './Message'

export const rootId = 'shared-processing-unit'
export const loadScript = (message: Message) => {
    if (!message || !message.type || !message.link) {
        throw new Error(
            'loadScript call with invalid parameter. should be a message object.'
        )
    }
    const { type, link } = message
    const scriptTag = document.getElementById(type)
    scriptTag.setAttribute('src', link)
}

export const throwExceptionIfRootIdNotExists = (id: string) => {
    if (!document.getElementById(id)) {
        throw new Error(
            `Pleace create a div with the following id: "${rootId}"`
        )
    }
}

export const createScriptTagsWithinRootDiv = (rootId: string) => {
    throwExceptionIfRootIdNotExists(rootId)

    const root = document.getElementById(rootId)
    const scriptTags = Object.keys(Type)
        .map(key => Type[key])
        .map(id => {
            const script = document.createElement('script')
            script.id = id
            return script
        })
    scriptTags.forEach(tag => root.appendChild(tag))
}

export const run = (webSocket: WebSocket, id: string) => {
    const registerMsg: Incomming = { route: 'register', data: id }
    createScriptTagsWithinRootDiv(rootId)

    webSocket.send(registerMsg)
    webSocket.on('message', loadScript)
}
