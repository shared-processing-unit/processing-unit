import SharedProcessingUnit from '../src/SharedProcessingUnit'

describe('SharedProcessingUnit constructor', () => {
    test('Invalid parameters should throw an exception.', () => {
        expect(() => new SharedProcessingUnit(null)).toThrowError()
    })
})
