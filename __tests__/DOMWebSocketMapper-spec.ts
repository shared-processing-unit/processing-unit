import DOMWebSocketMapper from '../src/DOMWebSocketMapper'
import IWebsocket from '../src/IWebsocket'

describe('Comminucation', () => {
    const rootId = 'rootId'
    const clientId = 'clientId'
    const mock: IWebsocket = {
        onopen: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
    }
    beforeEach(() => {
        document.body.innerHTML = `<script id="${rootId}"></script>`
    })
    test('mapWebSocketToDOMElement should not change the dom', () => {
        const script = document.getElementById(rootId)
        const mapper = new DOMWebSocketMapper(mock, script, clientId)
        mapper.mapWebSocketToDOMElement()

        expect(document.body.innerHTML).toBe(`<script id="${rootId}"></script>`)
    })

    test('if onmessage is called, the link-tag should be changed', () => {
        const script = document.getElementById(rootId)
        const mapper = new DOMWebSocketMapper(mock, script, clientId)
        mapper.mapWebSocketToDOMElement()

        const testlink = 'http://testlink.com/'
        mock.onmessage({ data: testlink })

        const changedScript = document.getElementById(rootId)

        expect(changedScript).not.toBeNull()
        expect(changedScript.tagName).toBe('SCRIPT')
        expect(changedScript).toBeInstanceOf(HTMLScriptElement)
        expect((changedScript as HTMLScriptElement).src).toBe(testlink)
    })

    test('ctor should register client after onopen', () => {
        const script = document.getElementById(rootId)
        new DOMWebSocketMapper(mock, script, clientId)
        mock.onopen(null)
        const spy = jest.spyOn(mock, 'send')
        expect(spy).toHaveBeenCalledWith(
            JSON.stringify({ route: 'register', data: clientId })
        )
    })

    test('no new instance should be created, if the ctor is called with wrong parameters.', () => {
        const script = document.getElementById(rootId)

        expect(() => new DOMWebSocketMapper(null, null, null)).toThrowError()
        expect(() => new DOMWebSocketMapper(mock, script, '')).toThrowError()
    })
})
