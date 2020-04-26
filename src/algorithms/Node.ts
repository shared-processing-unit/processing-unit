export default class Node<T> {
    public readonly left?: Node<T>
    public readonly right?: Node<T>
    constructor(public readonly value: T, left?: Node<T>, right?: Node<T>) {
        left && (this.left = left)
        right && (this.right = right)
    }
}
