class JobScheduler {
    constructor() {
        this.items = []
    }

    enqueue(element) {
        this.items.push(element)
    }

    dequeue() {
        if (this.items.length === 0) {
            return null
        }

        return this.items.shift()
    }

    first() {
        if (this.items.length === 0) {
            return null
        }

        return this.items[0]
    }

    last() {
        if (this.items.length === 0) {
            return null
        }

        return this.items[this.items.length - 1]
    }

    getItems() {
        return this.items
    }

    size() {
        return this.items.length
    }
}

module.exports = JobScheduler