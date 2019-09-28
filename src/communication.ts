import { Type } from './Type'
import { Message, Incomming } from './Message'
import { IWebsocket } from './IWebsocket'

export const rootId = 'shared-processing-unit'

export const messageGuard = (data: any): data is Message => {
    if (data && (data as Message).link && (data as Message).type) {
        return true
    }
    throw new Error('loadScript InvalidArgumentException')
}

export const loadScript = (message: any) => {
    if (messageGuard(message)) {
        const scriptTag = document.getElementById(message.type)
        scriptTag.setAttribute('src', message.link)
    }
}

export const getRoot = (id: string) => {
    const root = document.getElementById(rootId)
    if (root) {
        return root
    }
    throw new Error(`Please create: <div id="${rootId}"></div>`)
}

export const createScriptTagsWithinRootDiv = (rootId: string) => {
    const root = getRoot(rootId)
    const scriptTags = Object.keys(Type)
        .map(key => Type[key])
        .map(id => {
            const script = document.createElement('script')
            script.id = id
            return script
        })
    scriptTags.forEach(tag => root.appendChild(tag))
}

export const run = (webSocket: IWebsocket, id: string) => {
    const registerMsg: Incomming = { route: 'register', data: id }
    createScriptTagsWithinRootDiv(rootId)

    webSocket.onopen = () => webSocket.send(JSON.stringify(registerMsg))
    webSocket.onmessage = ({ data }) => loadScript(JSON.parse(data))
}
