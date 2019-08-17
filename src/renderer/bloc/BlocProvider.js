import TodoBloc from "./TodoBloc";

class BlocProvider {
    constructor() {
        this.todoBloc = new TodoBloc()
    }

    dispose() {
        this.todoBloc.dispose()
    }
}

export default new BlocProvider()