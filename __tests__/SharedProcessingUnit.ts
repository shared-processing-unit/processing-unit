import SharedProcessingUnit from '../src/SharedProcessingUnit'

describe('SharedProcessingUnit', () => {
    test('Invalid parameters should throw an exception.', () => {
        expect(() => new SharedProcessingUnit(null, null)).toThrowError()
    })
})
