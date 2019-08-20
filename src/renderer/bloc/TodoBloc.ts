import Stream from "./Stream";
import TodoRepository from "../repository/TodoRepository";
import TodoState, {
    UPDATED,
    ADDED,
    DELETED,
    ERROR
} from "../entity/TodoState";
import TodoEntity from "../entity/TodoEntity";

const DATA_OF_ONE_PAGE: number = 2

export default class TodoBloc {
    todoStream: Stream;
    todoStateStream: Stream;

    private cachedPageNum: number;

    constructor() {
        this.todoStream = new Stream()
        this.todoStateStream = new Stream()
        this.cachedPageNum = 0
    }

    async addTodo(newTodo: TodoEntity) {
        let repo = new TodoRepository()
        let createdTodo = await repo.create(newTodo)
        if (createdTodo) {
            this.todoStateStream.stream(new TodoState(newTodo, ADDED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, ERROR))
    }

    async fetchTodo(pageNum: number) {
        let repo = new TodoRepository()
        if (pageNum != null) {
            this.cachedPageNum = pageNum
        }
        let data = await repo.read(this.cachedPageNum, DATA_OF_ONE_PAGE)
        this.todoStream.stream(data)
    }

    async deleteTodo(id: number) {
        let repo = new TodoRepository()
        let deletedId = await repo.delete(id)
        if (deletedId) {
            this.todoStateStream.stream(new TodoState(new TodoEntity(id, null, false), DELETED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, ERROR))
    }

    async findTodo(id: number) {
        let repo = new TodoRepository()
        let data = await repo.find(id)
        this.todoStream.stream(data)
    }

    async updateTodo(newTodo: TodoEntity) {
        let repo = new TodoRepository()
        let isUpdated = await repo.update(newTodo)
        if (isUpdated) {
            this.todoStateStream.stream(new TodoState(newTodo, UPDATED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, ERROR))
    }

    async getPageCount(): Promise<number> {
        let repo = new TodoRepository()
        let count = await repo.count()
        return Math.ceil(count / DATA_OF_ONE_PAGE)
    }

    getCachedPageNum() : number {
        return this.cachedPageNum
    }

    clearCachedPageNum() {
        this.cachedPageNum = 0
    }

    dispose() {
        this.todoStream.deleteAll()
        this.todoStateStream.deleteAll()
    }
}