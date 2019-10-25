import SharedProcessingUnit from '../src/SharedProcessingUnit'
import IWebsocket from '../src/IWebsocket'
import { Routes } from '../src/Routes'

describe('SharedProcessingUnit constructor', () => {
    test('Invalid parameters should throw an exception.', () => {
        const mock: IWebsocket = {
            onopen: jest.fn(),
            send: jest.fn(),
            onmessage: jest.fn(),
        }
        expect(() => new SharedProcessingUnit(null, null)).toThrowError()
        expect(() => new SharedProcessingUnit(mock, '')).toThrowError()
    })
})

describe('SharedProcessingUnit run', () => {
    test('should register client with clientId.', () => {
        const mock: IWebsocket = {
            onopen: jest.fn(),
            send: jest.fn(),
            onmessage: jest.fn(),
        }
        const spu = new SharedProcessingUnit(mock, 'clientId')

        const spy = jest.spyOn(mock, 'send')
        spu.run()
        mock.onopen(null)
        expect(spy).toHaveBeenCalledWith(
            JSON.stringify({ route: Routes.Register, data: 'clientId' })
        )
    })
})
