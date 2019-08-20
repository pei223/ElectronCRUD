import TodoEntity from "./TodoEntity";

export enum StateVal {
    DELETED,
    UPDATED,
    ADDED,
    ERROR
}

export class TodoState{
    todo: TodoEntity;
    state: StateVal;

    constructor(todo: TodoEntity, state: StateVal) {
        this.todo = todo
        this.state = state
    }
}