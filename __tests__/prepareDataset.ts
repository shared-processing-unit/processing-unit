import {
    createDecisionTreeSample,
    splitDecisionTreeSampleIntoNEstimators,
    ReferenceTpe
} from '../scripts/prepareDataset'
describe('prepare dataset', () => {
    const referenceTable = [
        [
            { refX: 2, comperativeValue: 2, y: 1 },
            { refX: 0, comparativeValue: 0, y: 1 },
            { refX: 1, comparativeValue: 0, y: 0 },
            { refX: 3, comparativeValue: 0, y: 0 }
        ],
        [
            { refX: 3, comparativeValue: 3, y: 0 },
            { refX: 1, comparativeValue: 1, y: 0 },
            { refX: 0, comparativeValue: 0, y: 1 },
            { refX: 2, comparativeValue: 2, y: 1 }
        ]
    ] as ReferenceTpe[][]
    it('create decisionTree Sample', async () => {
        const matrix = [
            ['YELLOW', 5.4, 'T'],
            ['YELLOW', 3.0, 'F'],
            ['PURPLE', 6.1, 'T'],
            ['YELLOW', 2.5, 'F']
        ]
        const ref = createDecisionTreeSample(matrix as [])
        expect(ref).toStrictEqual(referenceTable)
    })
    it('create n random decisionTree samples', () => {
        const mockMath = Object.create(global.Math)
        let counter = 0
        const randomNumbers = [0, 1 / 4, 3 / 4, 0, 0, 0]
        mockMath.random = () => randomNumbers[counter++]

        global.Math = mockMath

        const csvChunks = splitDecisionTreeSampleIntoNEstimators(
            referenceTable,
            3,
            2
        )
        expect(csvChunks).toStrictEqual([
            [
                [
                    { refX: 0, comparativeValue: 0, y: 1 },
                    { refX: 0, comparativeValue: 0, y: 1 }
                ],
                [
                    { refX: 1, comparativeValue: 0, y: 0 },
                    { refX: 1, comparativeValue: 1, y: 0 }
                ],
                [
                    { refX: 3, comparativeValue: 0, y: 0 },
                    { refX: 3, comparativeValue: 3, y: 0 }
                ]
            ],
            [
                [
                    { refX: 0, comperativeValue: 0, y: 1 },
                    { refX: 0, comparativeValue: 0, y: 1 }
                ],
                [
                    { refX: 0, comperativeValue: 0, y: 1 },
                    { refX: 0, comparativeValue: 0, y: 1 }
                ],
                [
                    { refX: 0, comperativeValue: 0, y: 1 },
                    { refX: 0, comparativeValue: 0, y: 1 }
                ]
            ]
        ])
    })
})
