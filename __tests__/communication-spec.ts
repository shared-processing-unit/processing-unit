import * as communication from '../src/communication'
import { Message } from '../src/Message'
import { Type } from '../src/Type'

const {
    rootId,
    loadScript,
    throwExceptionIfRootIdNotExists,
    createScriptTagsWithinRootDiv,
    run,
} = communication

describe('loadScript', () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <div id="${rootId}">
            <script id="${Type.Algorithm}"></script>
            <script id="${Type.Data}"></script>
        </div>`
    })

    test('call with valid parameter', () => {
        const message: Message = {
            link: 'http://testlink.com/',
            type: Type.Algorithm,
        }
        loadScript(message)
        const element = document.getElementById(message.type)
        expect(element).not.toBeNull()
        expect(element.tagName).toBe('SCRIPT')
        expect(element).toBeInstanceOf(HTMLScriptElement)
        expect((element as HTMLScriptElement).src).toBe(message.link)
    })
    test('call with invalid parameters', () => {
        const expectedError = new Error(
            'loadScript call with invalid parameter. should be a message object.'
        )
        expect(() => loadScript(null)).toThrow(expectedError)
        expect(() => loadScript({ link: '', type: '' })).toThrow(expectedError)
        expect(() => loadScript({ link: '.', type: '' })).toThrow(expectedError)
        expect(() => loadScript({ link: '', type: '.' })).toThrow(expectedError)
        expect(() => loadScript({ link: null, type: '.' })).toThrow(
            expectedError
        )
        expect(() => loadScript({ link: '.', type: null })).toThrow(
            expectedError
        )
    })
})

describe('throwExceptionIfRootIdNotExists', () => {
    test('root-div exists', () => {
        document.body.innerHTML = `
        <div id="${rootId}">
            <script id="${Type.Algorithm}"></script>
            <script id="${Type.Data}"></script>
        </div>`
        expect(() => throwExceptionIfRootIdNotExists(rootId)).not.toThrowError()
    })
    test('root-div not exists', () => {
        document.body.innerHTML = ''
        expect(() => throwExceptionIfRootIdNotExists(rootId)).toThrowError()
    })
})

describe('createScriptTagsWithinRootDiv', () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <div id="${rootId}">
        </div>`
    })

    test('script-tags successfully created', () => {
        createScriptTagsWithinRootDiv(rootId)
        Object.keys(Type)
            .map(key => Type[key])
            .forEach(link => {
                const element = document.getElementById(link)
                expect(element).not.toBeNull()
                expect(element.tagName).toBe('SCRIPT')
                expect(element).toBeInstanceOf(HTMLScriptElement)
                expect((element as HTMLScriptElement).src).toBe('')
            })
    })

    test('script-tags are within root-div if rootId set corretly', () => {
        createScriptTagsWithinRootDiv(rootId)
        const element = document.getElementById(rootId)
        expect(element.hasChildNodes()).toBeTruthy()
    })

    test('createScriptTagsWithinRootDiv should call "throwExceptionIfRootIdNotExists"', () => {
        const spy = jest.spyOn(communication, 'throwExceptionIfRootIdNotExists')
        createScriptTagsWithinRootDiv(rootId)
        expect(spy).toHaveBeenCalled()
    })
})

describe('run', () => {
    test('run should call "createScriptTagsWithinRootDiv"', () => {
        const mock = {
            send: jest.fn(),
            on: jest.fn(),
        }
        const spy = jest
            .spyOn(communication, 'createScriptTagsWithinRootDiv')
            .mockImplementation()
        run(mock, 'id')
        expect(spy).toHaveBeenCalled()
    })
    test('run should call send with registration values on websocket', () => {
        const mock = {
            send: jest.fn(),
            on: jest.fn(),
        }
        const spy = jest.spyOn(mock, 'send')

        run(mock, 'id')
        expect(spy).toHaveBeenCalledWith({ route: 'register', data: 'id' })
    })
    test('run should register listener on websocket', () => {
        const mock = {
            send: jest.fn(),
            on: jest.fn(),
        }
        const spy = jest.spyOn(mock, 'on')

        run(mock, 'id')
        expect(spy).toHaveBeenCalledWith('message', loadScript)
    })
})
