import summUp from '../src/algorithms/summUp'

describe('summUp', () => {
    it('[1,1] should be equals 2', () => {
        expect(summUp([1, 1])).toMatchSnapshot()
    })
    it('[1,1,6,0] should be equals 8', () => {
        expect(summUp([1, 1, 6, 0])).toMatchSnapshot()
    })
    it('[[1, 1, 6, 0], [1, 2, 3, 4]] should be equals 18', () => {
        expect(summUp([[1, 1, 6, 0], [1, 2, 3, 4]])).toMatchSnapshot()
    })
    it('[[1, 1, 6, 0], [1, 2, 3, -4]] should be equals 10', () => {
        expect(summUp([[1, 1, 6, 0], [1, 2, 3, -4]])).toMatchSnapshot()
    })
})
