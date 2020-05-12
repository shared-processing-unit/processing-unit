import { createSampleFile } from '../scripts/prepareDataset'
import { parseCSV } from '../src/DecisionTreeWorker'
import { decisionTree } from '../src/algorithms/decisionTree'

describe('predict', () => {
    it('create decision tree with balloon dataset.', () => {
        const mockMath = Object.create(global.Math)
        let counter = 0
        const nofSamples = 20
        const randomNumbers = Array(nofSamples)
            .fill({})
            .map((_, i) => i / nofSamples)
        mockMath.random = () => randomNumbers[counter++]

        global.Math = mockMath
        const [sample] = createSampleFile(
            `${__dirname}/data/balloons.csv`,
            1,
            nofSamples
        )
        const features = parseCSV(sample)
        const dt = decisionTree(features, { minSamplesSplit: 2 })
        console.log(dt)
    })
})
