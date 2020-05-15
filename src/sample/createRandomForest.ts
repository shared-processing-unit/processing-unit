import Feature from '../algorithms/Feature'
import { transpose } from '../algorithms/matrixHelper'

export const createRandomForest = (
    dataLength: number,
    nEstimators: number,
    sampleSize: number,
    filter: number[]
) => {
    return Array(nEstimators)
        .fill({})
        .map(() => {
            return Array(sampleSize)
                .fill({})
                .map(() => {
                    let randomValue = -1
                    do {
                        randomValue = Math.floor(Math.random() * dataLength)
                    } while (filter.indexOf(randomValue) !== -1)
                    return randomValue
                })
        })
}

export const featureToString = (features: Feature[]) => {
    return features
        .map(feature => {
            return [
                feature.indexes.join(','),
                feature.value.join(','),
                feature.refY.join(',')
            ].join('\n')
        })
        .join('\n')
}

export const parseUnsortedCSV = (csv: string) => {
    const data = transpose(
        csv.split('\n').map(row => row.split(','))
    ).map(col =>
        col
            .map(value => Number.parseFloat(value))
            .map((value, refX) => ({ value, refX }))
    )
    const X = data.slice(0, -1)
    const [Y] = data.slice(-1)
    return X.map(col => {
        const sortedCol = col.sort((a, b) => a.value - b.value)

        const distinctValue = Array.from(
            new Set(sortedCol.map(cell => cell.value))
        )
        return [
            sortedCol.map(({ refX }) => refX).join(','),
            sortedCol
                .map(({ value }) => distinctValue.indexOf(value))
                .join(','),
            sortedCol.map(({ refX }) => Y[refX].value).join(',')
        ].join('\n')
    }).join('\n')
}

export const parseSortedCSV = (csv: string) => {
    const nofColumns = 3
    const data = csv
        .split('\n')
        .map(row => row.split(','))
        .map(col => col.map(value => Number.parseFloat(value)))

    return Array(data.length / nofColumns)
        .fill({})
        .map((_, featureId) => {
            return {
                featureId,
                indexes: data[featureId * nofColumns],
                value: data[featureId * nofColumns + 1],
                refY: data[featureId * nofColumns + 2]
            } as Feature
        })
}

export const filterOut = (csv: string, selectedRowIndex: number[]) => {
    const rows = csv.split('\n')
    return selectedRowIndex.map(index => rows[index]).join('\n')
}

export const getValueOfRows = (csv: string, selectedRowIndex: number[]) => {
    const features = parseSortedCSV(parseUnsortedCSV(csv))
    return selectedRowIndex.map(index => {
        const values = features.map(
            feature => feature.value[feature.indexes.indexOf(index)]
        )
        const expected = features[0].refY[features[0].indexes.indexOf(index)]
        return { values, expected }
    })
}
