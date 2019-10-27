import SharedProcessingUnit from './SharedProcessingUnit'

const webSocket = new WebSocket(process.env.connection)
const spu = new SharedProcessingUnit(webSocket)

spu.run()
