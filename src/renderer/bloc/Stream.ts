export default class Stream<Type> {
  /**
   * データを通知するオブザーバー
   */
  private observers: Array<Observer<Type>>;

  constructor() {
    this.observers = [];
  }

  /**
   * オブザーバーを登録する
   * @param observer 等速したいオブザーバー
   */
  public listen(observer: Observer<Type>) {
    this.observers.push(observer);
  }

  /**
   * 指定したオブザーバーを削除する
   * @param deleteObserver 削除したいオブザーバー
   */
  public delete(deleteObserver: Observer<Type>) {
    this.observers = this.observers.filter(
      observer => observer !== deleteObserver
    );
  }

  /**
   * データをObserverに通知する
   * @param data ストリームに流すデータ
   */
  public stream(data: Type) {
    this.observers.forEach(observer => {
      if (observer && observer instanceof Observer) {
        observer.onSuccess(data);
      }
    });
  }

  public error(resultId: number) {
    this.observers.forEach(observer => {
      if (observer && observer instanceof Observer) {
        observer.onError(resultId);
      }
    });
  }

  /**
   * Observer全削除
   */
  deleteAll() {
    this.observers = [];
  }
}

export class Observer<Type> {
  onSuccess: (data: Type) => void;
  onError: (resultId: number) => void;

  constructor(
    onSuccess: (data: Type) => void,
    onError: (resultId: number) => void
  ) {
    this.onSuccess = onSuccess;
    this.onError = onError;
  }
}
