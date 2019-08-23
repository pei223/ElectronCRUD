import TodoEntity from "./TodoEntity";

export enum StateVal {
    DELETED,
    UPDATED,
    ADDED,
    ERROR
}

/**
 * TODO 扱うデータに合わせる. Entitiyだけ差し替えれば良い
 */
export class TodoState{
    todo: TodoEntity;
    state: StateVal;

    constructor(todo: TodoEntity, state: StateVal) {
        this.todo = todo
        this.state = state
    }
}