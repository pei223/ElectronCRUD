export default class Stream {
    private observers: Array<Function>;

    constructor() {
        this.observers = []
    }

    public listen(observer: Function) {
        this.observers.push(observer)
    }

    public delete(delete_observer: Function) {
        this.observers = this.observers.filter(observer => observer !== delete_observer)
    }

    public stream(data: any) {
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