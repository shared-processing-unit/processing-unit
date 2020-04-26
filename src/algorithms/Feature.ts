export const createFilter = (feature: Feature, splitOn: number) => {
    return new Set(feature.ref.slice(0, splitOn))
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
    { id, refY, ref }: Feature,
    refToFilter: Set<number>,
    left: boolean
) => {
    const filter = new Set(
        ref
            .map((value, key) => [key, value] as [number, number])
            .filter(([, value]) => refToFilter.has(value))
            .map(([key]) => key)
    )
    return {
        ref: ref.filter((_, key) =>
            left ? filter.has(key) : !filter.has(key)
        ),
        refY: refY.filter((_, key) =>
            left ? filter.has(key) : !filter.has(key)
        ),
        id,
    }
}

export default interface Feature {
    readonly ref: number[]
    readonly refY: number[]
    readonly id: number
}
