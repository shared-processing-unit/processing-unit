import Split from './Split'
import Feature from './Feature'

export default class Leaf {
    public readonly category: number
    public readonly samples: Array<[number, number]>
    public readonly split?: Split

    constructor(feature: Feature, split?: Split) {
        const samples = this.getSamples(feature.refY)
        const category = this.getCategory(samples)
        this.category = category
        this.samples = samples
        split && (this.split = split)
    }
    private getSamples(data: number[]) {
        return Array.from(
            data.reduce((occurences, category) => {
                const occurence = occurences.get(category) || 0
                return occurences.set(category, occurence + 1)
            }, new Map<number, number>())
        )
    }
    private getCategory(value: [number, number][]) {
        const mostOccurentCategory = Math.max(...value.map(([, o]) => o))
        const [[category]] = value.filter(([, o]) => o === mostOccurentCategory)
        return category
    }
}
