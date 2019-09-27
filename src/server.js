const app = require('http').createServer()
const io = require('socket.io')(app)

app.listen(8080, () => {
    console.log('ready!')
})

io.on('connection', socket => {
    socket.emit('loadscript', {
        link:
            'https://cdn.jsdelivr.net/npm/hello-world-js@0.0.2/src/index.min.js',
        type: 'algorithm',
    })
    socket.on('register', data => {
        console.log(data)
    })
})
