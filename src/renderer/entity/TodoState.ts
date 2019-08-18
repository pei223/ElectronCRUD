import TodoEntity from "./TodoEntity";

export const DELETED: string = "deleted"
export const UPDATED: string = "updated"
export const ADDED: string = "added"
export const ERROR: string = "error"

export default class TodoState{
    todo: TodoEntity;
    state: string;

    constructor(todo: TodoEntity, state: string) {
        this.todo = todo
        this.state = state
    }
}