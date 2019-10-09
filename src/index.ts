import DOMWebSocketMapper from './DOMWebSocketMapper'

const webSocket = new WebSocket(process.env.connection)
const scriptTag = document.createElement('script')
document.body.appendChild(scriptTag)

const mapper = new DOMWebSocketMapper(
    webSocket,
    scriptTag,
    window.location.href
)
mapper.mapWebSocketToDOMElement()
