export default class Stream {
    constructor() {
        this.observers = []
    }

    listen(observer) {
        this.observers.push(observer)
    }

    delete(delete_observer) {
        this.observers = this.observers.filter(observer => observer !== delete_observer)
    }

    stream(data) {
        this.observers.forEach(observer => {
            if (observer && observer instanceof Function) {
                observer(data)
            }
        })
    }

    deleteAll() {
        this.observers = []
    }
}