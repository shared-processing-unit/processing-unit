import * as communication from '../src/communication'
import { Message } from '../src/types/Incoming'
import { Type } from '../src/types/Type'

const {
    rootId,
    checkMessage,
    loadScript,
    getRoot,
    createScriptTagsWithinRootDiv,
    run,
} = communication

describe('checkMessage', () => {
    test('call with valid parameter', () => {
        const message: Message = {
            link: 'http://testlink.com/',
            type: Type.Algorithm,
        }
        expect(() => checkMessage(message)).not.toThrowError()
    })

    test('call with invalid parameter', () => {
        const expectedError = new Error('loadScript InvalidArgumentException')

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

    test('loadScript should call "checkMessage"', () => {
        const message: Message = {
            link: 'http://testlink.com/',
            type: Type.Algorithm,
        }
        const spy = jest.spyOn(communication, 'checkMessage')
        loadScript(message)
        expect(spy).toHaveBeenCalled()
    })
})

describe('getRoot', () => {
    test('root-div exists', () => {
        document.body.innerHTML = `
        <div id="${rootId}">
            <script id="${Type.Algorithm}"></script>
            <script id="${Type.Data}"></script>
        </div>`
        expect(() => getRoot(rootId)).not.toThrowError()
    })
    test('root-div not exists', () => {
        document.body.innerHTML = ''
        expect(() => getRoot(rootId)).toThrowError()
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

    test('createScriptTagsWithinRootDiv should call "getRoot"', () => {
        const spy = jest.spyOn(communication, 'getRoot')
        createScriptTagsWithinRootDiv(rootId)
        expect(spy).toHaveBeenCalled()
    })
})

describe('run', () => {
    test('run should call "createScriptTagsWithinRootDiv"', () => {
        const mock = {
            onopen: jest.fn(),
            send: jest.fn(),
            onmessage: jest.fn(),
        }
        const spy = jest
            .spyOn(communication, 'createScriptTagsWithinRootDiv')
            .mockImplementation()
        run(mock, 'id')
        expect(spy).toHaveBeenCalled()
    })

    // todo add onopen, send and onmessage
})
