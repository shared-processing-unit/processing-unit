import DOMWebSocketMapper from './DOMWebSocketMapper'

const webSocket = new WebSocket(process.env.connection)
const rootelement = document.getElementById(process.env.rootId)
const scriptTag = document.createElement('script')
rootelement.appendChild(scriptTag)

const mapper = new DOMWebSocketMapper(
    webSocket,
    scriptTag,
    window.location.href
)
mapper.mapWebSocketToDOMElement()
