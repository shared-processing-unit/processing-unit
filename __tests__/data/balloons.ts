export const balloonsX = [
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 0, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 0, 1],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
]

export const balloonsY = [
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
]

export default () => {
    const transposed = balloonsX[0].map((_, columnIndex) => {
        return balloonsX.map((_, rowIndex) => balloonsX[rowIndex][columnIndex])
    })
    return transposed.map((column, id) => {
        const feature = column
            .map((value, index) => ({ value, index }))
            .sort((cell1, cell2) => cell1.value - cell2.value)
            .map((cell) => ({ refY: balloonsY[cell.index], index: cell.index }))
        return {
            ref: feature.map((f) => f.index),
            refY: feature.map((f) => f.refY),
            id,
        }
    })
}
