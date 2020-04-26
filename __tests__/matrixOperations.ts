import { reverse, vectorAdd } from '../src/algorithms/matrixHelper'
describe('matrixOperations', () => {
    it('vectorAdd', () => {
        expect(
            vectorAdd([1, 2, 3, 4, 5], [-1, -2, -3, -4, -5])
        ).toMatchSnapshot()
    })

    it('reverse matrix should not change input', () => {
        const input = [
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
        ]

        reverse(input)
        expect(input).toMatchSnapshot()
    })
    it('reverse vector should not change input', () => {
        const input = [0, 0, 1, 0]
        reverse(input)
        expect(input).toMatchSnapshot()
    })
    it('reverse vector', () => {
        expect(reverse([0, 0, 1, 0])).toMatchSnapshot()
    })
})
