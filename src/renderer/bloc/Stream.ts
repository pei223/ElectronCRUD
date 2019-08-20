export default class Stream<Type> {
    /**
     * データを通知するオブザーバー
     */
    private observers: Array<(data: Type) => void>;

    constructor() {
        this.observers = []
    }

    /**
     * オブザーバーを登録する
     * @param observer 等速したいオブザーバー
     */
    public listen(observer: (data: Type) => void) {
        this.observers.push(observer)
    }

    /**
     * 指定したオブザーバーを削除する
     * @param deleteObserver 削除したいオブザーバー
     */
    public delete(deleteObserver: (data: Type) => void) {
        this.observers = this.observers.filter(observer => observer !== deleteObserver)
    }

    /**
     * データをObserverに通知する
     * @param data ストリームに流すデータ
     */
    public stream(data: Type) {
        this.observers.forEach(observer => {
            if (observer && observer instanceof Function) {
                observer(data)
            }
        })
    }

    /**
     * Observer全削除
     */
    deleteAll() {
        this.observers = []
    }
}