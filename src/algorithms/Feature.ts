export const createFilter = (feature: Feature, splitOn: number) => {
    return new Set(feature.indexes.slice(0, splitOn))
}

export const distinctYSize = ({ refY }: Feature) => {
    return new Set(refY).size
}

export const filterLeft = (feature: Feature, refToFilter: Set<number>) => {
    return applyFilter(feature, refToFilter, true)
}
export const filterRight = (feature: Feature, refToFilter: Set<number>) => {
    return applyFilter(feature, refToFilter, false)
}
const applyFilter = (
    { featureId, refY, indexes, value }: Feature,
    refToFilter: Set<number>,
    left: boolean
) => {
    const filter = new Set(
        indexes
            .map((value, key) => [key, value] as [number, number])
            .filter(([, value]) => refToFilter.has(value))
            .map(([key]) => key)
    )
    const filterOut = <T>(array: T[]) =>
        array.filter((_, key) => (left ? filter.has(key) : !filter.has(key)))

    return {
        indexes: filterOut(indexes),
        refY: filterOut(refY),
        featureId,
        value: filterOut(value)
    } as Feature
}

export default interface Feature {
    readonly indexes: number[]
    readonly value: number[]
    readonly refY: Entries
    readonly featureId: number
}

export type Entry = number
export type Entries = Entry[]
