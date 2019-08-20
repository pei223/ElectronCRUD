import Stream from "./Stream";
import TodoRepository from "../repository/TodoRepository";
import {TodoState, StateVal} from "../entity/TodoState";
import TodoEntity from "../entity/TodoEntity";

/**
 * 1ページに表示するデータ数
 */
const DATA_OF_ONE_PAGE: number = 2

export default class TodoBloc {
    /**
     * データのリストを流すストリーム
     */
    todoStream: Stream<Array<TodoEntity>>;
    /**
     * 1つのデータの状態を流すストリーム
     */
    todoStateStream: Stream<TodoState | null>;

    /**
     * 保持しているページ数
     */
    private cachedPageNum: number;

    constructor() {
        this.todoStream = new Stream()
        this.todoStateStream = new Stream()
        this.cachedPageNum = 0
    }

    /**
     * データ登録. 登録後todoStateStreamに追加したデータを流す.
     * @param newTodo 登録するデータ
     */
    async addTodo(newTodo: TodoEntity) {
        let repo = new TodoRepository()
        let createdTodo: TodoEntity | null = await repo.create(newTodo)
        if (createdTodo) {
            this.todoStateStream.stream(new TodoState(newTodo, StateVal.ADDED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, StateVal.ERROR))
    }

    /**
     * 指定したページ数のデータリストをtodoStreamに流す.
     * @param pageNum ページ数. nullなら保持されているページ数になる. 
     */
    async fetchTodo(pageNum: number) {
        let repo = new TodoRepository()
        if (pageNum != null) {
            this.cachedPageNum = pageNum
        }
        let data: Array<TodoEntity> | null = await repo.read(this.cachedPageNum, DATA_OF_ONE_PAGE)
        this.todoStream.stream(data)
    }

    /**
     * データ削除. 削除後todoStateStreamに削除したデータ(IDのみ)を流す. 
     * @param id 削除したいデータのID
     */
    async deleteTodo(id: number) {
        let repo = new TodoRepository()
        let deletedId: number | null = await repo.delete(id)
        if (deletedId != null) {
            this.todoStateStream.stream(new TodoState(new TodoEntity(id, null, false), StateVal.DELETED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, StateVal.ERROR))
    }

    /**
     * 指定したデータのIDを取得する. 取得後todoStreamにデータを流す. 
     * @param id 取得したいデータのID
     */
    async findTodo(id: number) {
        let repo = new TodoRepository()
        let data: Array<TodoEntity> | null = await repo.find(id)
        this.todoStream.stream(data)
    }

    /**
     * データを更新する. 更新後todoStateStreamに更新したデータを流す. 
     * @param newTodo 更新するデータ
     */
    async updateTodo(newTodo: TodoEntity) {
        let repo = new TodoRepository()
        let updatedTodo: TodoEntity | null = await repo.update(newTodo)
        if (updatedTodo) {
            this.todoStateStream.stream(new TodoState(newTodo, StateVal.UPDATED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, StateVal.ERROR))
    }

    /**
     * 全体のページ数を非同期で取得する.
     */
    async getPageCount(): Promise<number> {
        let repo = new TodoRepository()
        let count: number = await repo.count()
        return Math.ceil(count / DATA_OF_ONE_PAGE)
    }

    /**
     * 保持しているページ数を返す.
     */
    getCachedPageNum() : number {
        return this.cachedPageNum
    }

    /**
     * 保持しているページ数をクリアする
     */
    clearCachedPageNum() {
        this.cachedPageNum = 0
    }

    /**
     * 後処理
     */
    dispose() {
        this.todoStream.deleteAll()
        this.todoStateStream.deleteAll()
    }
}