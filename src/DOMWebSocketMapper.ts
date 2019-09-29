import IWebsocket from './IWebsocket'

export default class DOMWebSocketMapper {
    constructor(
        private readonly webSocket: IWebsocket,
        private readonly scriptElement: HTMLElement,
        clientId: string
    ) {
        if (!(webSocket && scriptElement && clientId)) {
            throw new Error('InvalidArgumentException')
        }
        this.webSocket.onopen = () =>
            this.webSocket.send(
                JSON.stringify({ route: 'register', data: clientId })
            )
    }

    public mapWebSocketToDOMElement() {
        this.webSocket.onmessage = ({ data }) =>
            this.scriptElement.setAttribute('src', data)
    }
}
