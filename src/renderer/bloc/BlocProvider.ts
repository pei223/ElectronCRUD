import TodoBloc from "./TodoBloc";

export default class BlocProvider {
    /*
     * TODO 必要なBlocの追加 
     */
    todoBloc: TodoBloc;

    private static _instance: BlocProvider;

    private constructor() {
        this.todoBloc = new TodoBloc()
    }

    /**
     * 後処理
     */
    public dispose() {
        this.todoBloc.dispose()
    }

    public static getInstance(): BlocProvider {
        if (!this._instance)
            this._instance = new BlocProvider()
        return this._instance;
    }
}
