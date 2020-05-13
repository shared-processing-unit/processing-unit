export const reverse = <T>(matrix: T[]): T[] => {
    return [...matrix].reverse()
}
export const vectorAdd = (left: number[], right: number[]) => {
    return left.map((entry, index) => {
        return index === left.length - 1 ? entry : entry + right[index + 1]
    })
}

export const transpose = <T>(data: Array<T[]>) => {
    return data[0].map((_, i) => data.map(row => row[i]))
}
