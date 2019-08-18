import TodoBloc from "./TodoBloc";

export default class BlocProvider {
    todoBloc: TodoBloc;

    private static _instance: BlocProvider;

    private constructor() {
        this.todoBloc = new TodoBloc()
    }

    public dispose() {
        this.todoBloc.dispose()
    }

    public static getInstance(): BlocProvider {
        if (!this._instance)
            this._instance = new BlocProvider()
        return this._instance;
    }
}
