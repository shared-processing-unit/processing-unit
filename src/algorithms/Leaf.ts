import Split from './Split'
import Feature, { Entry, Entries } from './Feature'

export default class Leaf {
    public readonly category: Entry
    public readonly samples: Array<[Entry, number]>
    public readonly split?: Split

    constructor(feature: Feature, split?: Split) {
        this.samples = this.getSamples(feature.refY)
        this.category = this.getCategory(this.samples)
        split && (this.split = split)
    }
    private getSamples(data: Entries) {
        return Array.from(
            data.reduce((occurences, category) => {
                const occurence = occurences.get(category) || 0
                return occurences.set(category, occurence + 1)
            }, new Map<Entry, number>())
        )
    }
    private getCategory(value: [Entry, number][]) {
        const mostOccurentCategory = Math.max(...value.map(([, o]) => o))
        const [[category]] = value.filter(([, o]) => o === mostOccurentCategory)
        return category
    }
}
