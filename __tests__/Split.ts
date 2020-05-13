import { bestEvaluation } from '../src/algorithms/Split'

describe('evaluate', () => {
    it('calculate best split for [0, 0, 2, 1]', () =>
        expect(bestEvaluation([0, 0, 2, 1]).splitOn).toBe(1))
    it('calculate best split for [2, 1, 3, 0, 0, 2, 1]', () =>
        expect(bestEvaluation([2, 1, 3, 0, 0, 2, 1]).splitOn).toBe(0))
    it('calculate best split for [1, 3, 0, 0, 2, 1]', () =>
        expect(bestEvaluation([1, 3, 0, 0, 2, 1]).splitOn).toBe(1))
    it('calculate best split for [2, 1]', () =>
        expect(bestEvaluation([2, 1]).splitOn).toBe(0))
    it('calculate best split for [0, 0, 0]', () =>
        expect(bestEvaluation([0, 0, 0]).splitOn).toBe(0))
    it('calculate best split for [0, 1, 1]', () =>
        expect(bestEvaluation([0, 1, 1]).splitOn).toBe(0))
    it('calculate best split for [0, 2, 2]', () =>
        expect(bestEvaluation([0, 2, 2]).splitOn).toBe(0))
    it('calculate best split for []', () =>
        expect(bestEvaluation([]).splitOn).toBe(-1))
    it('calculate best split for [0]', () =>
        expect(bestEvaluation([0]).splitOn).toBe(0))
})
