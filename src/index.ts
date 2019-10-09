import DOMWebSocketMapper from './DOMWebSocketMapper'

const callFunctionIfDOMReady = (func: () => void) => {
    const domReady =
        document.readyState === 'complete' ||
        document.readyState === 'interactive'
    domReady ? func() : setTimeout(() => callFunctionIfDOMReady(func), 1)
}

callFunctionIfDOMReady(() => {
    const webSocket = new WebSocket(process.env.connection)
    const scriptTag = document.createElement('script')
    document.body.appendChild(scriptTag)

    const mapper = new DOMWebSocketMapper(
        webSocket,
        scriptTag,
        window.location.href
    )
    mapper.mapWebSocketToDOMElement()
})
