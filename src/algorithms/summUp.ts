export default (data: number[] | number[][]) => {
    const flatten = ([] as number[]).concat(...data) as number[]
    return flatten.reduce((a, b) => a + b, 0)
}
