import SharedProcessingUnit from './SharedProcessingUnit'

const getData = async (link: string) => {
    const response = await fetch(link)
    return response.json()
}
const webSocket = new WebSocket(process.env.connection)
const spu = new SharedProcessingUnit(webSocket, getData)

spu.run()
