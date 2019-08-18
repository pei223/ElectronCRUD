import Stream from "./Stream";
import TodoRepository from "../repository/TodoRepository";
import TodoState, {
    UPDATED,
    ADDED,
    DELETED,
    ERROR
} from "../entity/TodoState";

export default class TodoBloc {
    constructor() {
        this.todoStream = new Stream()
        this.todoStateStream = new Stream()
    }

    async addTodo(newTodo) {
        let repo = new TodoRepository()
        let createdTodo = await repo.create(newTodo)
        if (createdTodo) {
            this.todoStateStream.stream(new TodoState(createdTodo.id, ADDED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, ERROR))
    }

    async fetchTodo() {
        let repo = new TodoRepository()
        let data = await repo.read()
        this.todoStream.stream(data)
    }

    async deleteTodo(id) {
        let repo = new TodoRepository()
        let deletedId = await repo.delete(id)
        if (deletedId) {
            this.todoStateStream.stream(new TodoState(deletedId, DELETED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, ERROR))
    }

    async findTodo(id) {
        let repo = new TodoRepository()
        let data = await repo.find(id)
        this.todoStream.stream(data)
    }

    async updateTodo(newTodo) {
        let repo = new TodoRepository()
        let isUpdated = await repo.update(newTodo)
        if (isUpdated) {
            this.todoStateStream.stream(new TodoState(newTodo.id, UPDATED))
            return
        }
        this.todoStateStream.stream(new TodoState(null, ERROR))
    }

    dispose() {
        this.todoStream.deleteAll()
        this.todoStateStream.deleteAll()
    }
}