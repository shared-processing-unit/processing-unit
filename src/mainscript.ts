import Communication from './classes/Communication'
import { run } from './communication'

// TODO put in config file
export const rootId: string = 'shared-processing-unit'
export const connectionId: string = process.env.connection
export const clientId: string = window.location.href

// const com: Communication = new Communication(rootId, connectionId, clientId)
// com.run()

const ws = new WebSocket(connectionId)
run(ws, clientId)
