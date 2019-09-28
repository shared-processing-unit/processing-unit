import { run } from './communication'

const ws = new WebSocket(process.env.connection)
run(ws, window.location.href)
