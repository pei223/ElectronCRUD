import TodoBloc from "./TodoBloc";
import SettingBloc from "./SettingBloc";

export default class BlocProvider {
    /*
     * TODO 必要なBlocの追加 
     */
    todoBloc: TodoBloc;
    settingBloc: SettingBloc;

    private static _instance: BlocProvider;

    private constructor() {
        this.todoBloc = new TodoBloc()
        this.settingBloc = new SettingBloc()
    }

    /**
     * 後処理
     */
    public dispose() {
        this.todoBloc.dispose()
        this.settingBloc.dispose()
    }

    public static getInstance(): BlocProvider {
        if (!this._instance)
            this._instance = new BlocProvider()
        return this._instance;
    }
}
