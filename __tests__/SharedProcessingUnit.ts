import SharedProcessingUnit from '../src/SharedProcessingUnit'

describe('SharedProcessingUnit', () => {
    test('Invalid parameters should throw an exception.', () => {
        //@ts-ignore
        expect(() => new SharedProcessingUnit(null, null)).toThrowError()
    })
    test('webSocket should be defined.', () => {
        expect(
            () =>
                new SharedProcessingUnit(
                    { onmessage: jest.fn(), send: jest.fn() },
                    //@ts-ignore
                    null
                )
        ).toThrowError()
    })
    test('getdata should be defined', () => {
        //@ts-ignore
        expect(() => new SharedProcessingUnit(null, jest.fn())).toThrowError()
    })
    test('run should do nothing, if message is invalid', () => {
        const websocket = { onmessage: jest.fn(), send: jest.fn() }
        const spu = new SharedProcessingUnit(websocket, jest.fn())
        //@ts-ignore
        spu.createWorker = jest.fn()
        spu.run()
        websocket.onmessage({
            data: JSON.stringify({
                data: 'data',
                algorithm: 'algorithm'
            })
        })
        //@ts-ignore
        expect(spu.createWorker).not.toBeCalled()
    })

    test('run should create worker, if message is valid', () => {
        const websocket = { onmessage: jest.fn(), send: jest.fn() }
        const spu = new SharedProcessingUnit(websocket, jest.fn())
        //@ts-ignore
        spu.createWorker = jest.fn()
        spu.run()
        websocket.onmessage({
            data: JSON.stringify({
                dataset: 'data',
                algorithm: 'algorithm',
                subtaskId: 'subtaskId'
            })
        })
        //@ts-ignore
        expect(spu.createWorker).toBeCalled()
    })
})
