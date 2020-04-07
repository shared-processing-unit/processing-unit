import SharedProcessingUnit from './SharedProcessingUnit'

const getData = async (link: string) => {
    const response = await fetch(link, { mode: 'no-cors' })
    console.log(response, link)
    return await response.text()
}

const webSocket = new WebSocket(process.env.WebSocketURI)
const spu = new SharedProcessingUnit(webSocket, getData)

spu.run()
