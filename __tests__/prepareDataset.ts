import {
    createCsvReferenceTable,
    createRandomCSVChunks
} from '../scripts/prepareDataset'
describe('prepare dataset', () => {
    it('extractYAndIndexFromCSV', async () => {
        const matrix = [
            [1, 3, 'A'],
            [8, 2, 'B'],
            [7.9, 3, 'B'],
            [8.1, 1, 'A']
        ]
        const referenceTable = createCsvReferenceTable(matrix as [])
        expect(referenceTable).toBe('0,0,3,0\n2,1,1,1\n1,1,0,0\n3,0,2,1')
    })
    it('createRandomCSVChunks', () => {
        const mockMath = Object.create(global.Math)
        let counter = 0
        const randomNumbers = [0, 1 / 4, 3 / 4, 0, 0, 0]
        mockMath.random = () => randomNumbers[counter++]

        global.Math = mockMath

        const referenceTable = [
            [0, 0, 3, 0],
            [2, 1, 1, 1],
            [1, 1, 0, 0],
            [3, 0, 2, 1]
        ]
        const csvChunks = createRandomCSVChunks(referenceTable as [], 3, 2)
        expect(csvChunks).toStrictEqual([
            '0,0,0,0\n1,1,1,1\n3,0,3,1',
            '0,0,0,0\n0,0,0,0\n0,0,0,0'
        ])
    })
    /*  it('createDataset', async () => {
        await createDataset(
            `${__dirname}/data/iris.csv`,
            `${__dirname}/data/iris`,
            1000,
            100
        )
    })
    
    it('createDataset', async () => {
        await createDataset(
            `${__dirname}/data/balloons.csv`,
            `${__dirname}/data/balloons`,
            3,
            5
        )
    })*/
})
