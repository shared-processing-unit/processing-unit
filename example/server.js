const http = require('http')
const WebSocket = require('ws')
const fileSystem = require('fs')
const path = require('path')

http.createServer((_, response) => {
    const filePath = path.join(__dirname, '../dist/helloworld.js')
    const stat = fileSystem.statSync(filePath)

    response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size,
    })

    const readStream = fileSystem.createReadStream(filePath)
    readStream.pipe(response)
}).listen('3000', () => console.log('CDN-Server ready on port 3000'))

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log('received: %s', JSON.parse(message))
    })
    ws.send(
        JSON.stringify({
            link: 'http://localhost:3000/',
            type: 'shared-processing-unit-algorithm',
        })
    )
})
