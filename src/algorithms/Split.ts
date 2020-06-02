import Feature from './Feature'
import { reverse, vectorAdd } from './matrixHelper'

export const evaluate = <T>(data: T[]) => {
    return vectorAdd(
        weightedGinies(data),
        weightedGinies(reverse(data)).reverse()
    )
}

export const bestEvaluation = <T>(data: T[]) => {
    const ginis = evaluate(data)
    const value: number = Math.min(...ginis)
    return { splitOn: ginis.indexOf(value), value }
}

const weightedGinies = <T>(data: T[]) => {
    const occurences = new Map<T, number>()
    return data.map((category, i) => {
        const occurence = occurences.get(category) || 0
        occurences.set(category, occurence + 1)
        const squaredSum = 1 - sum(Array.from(occurences.values()), i + 1)
        return squaredSum * (1 + i)
    })
}
const sum = (occurence: number[], nofElements: number) => {
    return occurence.reduce(
        (prev, cur) => (prev += cur ** 2 / nofElements ** 2),
        0
    )
}

export default class Split {
    public readonly featureIndex: number
    public readonly value1: number
    public readonly value2: number

    constructor(
        public readonly gini: number,
        public readonly splitOn: number,
        feature: Feature
    ) {
        this.featureIndex = feature.featureId
        this.value1 = feature.value[splitOn]
        this.value2 = feature.value[splitOn + 1]
    }
}
