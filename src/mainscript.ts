import { connect } from 'socket.io-client'
import { Type } from './Type'
import { Message } from './Message'

const socket = connect(process.env.wss)

const rootId = 'shared-processing-unit'

const loadScript = ({ type, link }: Message) => {
    const id = `shared-processing-unit-${type}`
    const scriptTag = document.getElementById(id)
    scriptTag.setAttribute('src', link)
}

const canRun = (id: string) => !!document.getElementById(id)

if (!canRun(rootId)) {
    throw new Error(`Pleace create a div with the following id: "${rootId}"`)
}

const root = document.getElementById(rootId)
const scriptTags = Object.keys(Type)
    .map(key => `shared-processing-unit-${Type[key]}`)
    .map(id => {
        const script = document.createElement('script')
        script.id = id
        return script
    })
scriptTags.forEach(tag => root.appendChild(tag))

socket.emit('register', window.location.href)
socket.on('loadscript', loadScript)

const sendResult = (data: string) => {
    socket.emit('result', data)
}
