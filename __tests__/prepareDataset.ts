import {
    createCsvReferenceTable,
    createRandomCSVChunks
} from '../scripts/prepareDataset'
describe('prepare dataset', () => {
    it('create reference table', async () => {
        const matrix = [
            [1, 3, 'A'],
            [8, 2, 'B'],
            [7.9, 3, 'B'],
            [8.1, 1, 'A']
        ]
        const referenceTable = createCsvReferenceTable(matrix as [])
        expect(referenceTable).toBe('0,0,3,0\n2,1,1,1\n1,1,0,0\n3,0,0,1')
    })
    it('extractYAndIndexFromCSV with balloon dataset', async () => {
        const matrix = [
            ['YELLOW', 'SMALL', 'STRETCH', 'ADULT', 'T'],
            ['YELLOW', 'SMALL', 'STRETCH', 'CHILD', 'T'],
            ['YELLOW', 'SMALL', 'DIP', 'ADULT', 'T'],
            ['YELLOW', 'SMALL', 'DIP', 'CHILD', 'F'],
            ['YELLOW', 'SMALL', 'DIP', 'CHILD', 'F'],
            ['YELLOW', 'LARGE', 'STRETCH', 'ADULT', 'T'],
            ['YELLOW', 'LARGE', 'STRETCH', 'CHILD', 'T'],
            ['YELLOW', 'LARGE', 'DIP', 'ADULT', 'T'],
            ['YELLOW', 'LARGE', 'DIP', 'CHILD', 'F'],
            ['YELLOW', 'LARGE', 'DIP', 'CHILD', 'F'],
            ['PURPLE', 'SMALL', 'STRETCH', 'ADULT', 'T'],
            ['PURPLE', 'SMALL', 'STRETCH', 'CHILD', 'T'],
            ['PURPLE', 'SMALL', 'DIP', 'ADULT', 'T'],
            ['PURPLE', 'SMALL', 'DIP', 'CHILD', 'F'],
            ['PURPLE', 'SMALL', 'DIP', 'CHILD', 'F'],
            ['PURPLE', 'LARGE', 'STRETCH', 'ADULT', 'T'],
            ['PURPLE', 'LARGE', 'STRETCH', 'CHILD', 'T'],
            ['PURPLE', 'LARGE', 'DIP', 'ADULT', 'T'],
            ['PURPLE', 'LARGE', 'DIP', 'CHILD', 'F'],
            ['PURPLE', 'LARGE', 'DIP', 'CHILD', 'F']
        ]
        const referenceTable = createCsvReferenceTable(matrix as [])
        const out = `10,1,5,1,2,1,0,1\n10,1,5,1,2,0,0,1\n10,1,5,1,2,0,0,1\n10,0,5,0,2,1,0,1\n10,0,5,0,2,0,0,1\n10,1,5,1,2,0,0,1\n10,1,5,1,2,1,0,1\n10,1,5,1,2,0,0,1\n10,0,5,0,2,0,1,1\n10,0,5,0,2,1,1,0\n0,1,0,1,2,0,1,0\n0,1,0,1,2,0,1,1\n0,1,0,1,0,1,1,0\n0,0,0,0,0,1,1,0\n0,0,0,0,0,1,1,1\n0,1,0,1,0,1,1,0\n0,1,0,1,0,1,1,0\n0,1,0,1,0,1,1,1\n0,0,0,0,0,1,1,0\n0,0,0,0,0,1,1,0`
        expect(referenceTable).toBe(out)
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
            [3, 0, 0, 1]
        ]
        const csvChunks = createRandomCSVChunks(referenceTable as [], 3, 2)
        expect(csvChunks).toStrictEqual([
            '0,0,0,0\n1,1,1,1\n3,0,3,1',
            '0,0,0,0\n0,0,0,0\n0,0,0,0'
        ])
    })
})
