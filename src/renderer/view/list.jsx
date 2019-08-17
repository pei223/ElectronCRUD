import React from "react";
// original
import BlocProvider from "../bloc/BlocProvider";
import { DELETED, UPDATED } from "../entity/TodoState";
import Progress from "./util/progress";
import TodoCard from "./list/todo_card";
import SupportDialog from "./util/support_dialog";


export default class List extends React.Component {
    constructor() {
        super()
        this.todoBloc = BlocProvider.todoBloc
        this.onTodoFetchedCallback = (data) => this._onTodoFetchd(data)
        this.onTodoStateChangedCallback = (data) => this._onTodoStateChanged(data)
        this.state = {
            deleteDialogOpening: false,
            focusedData: null,
            loading: true,
            data: []
        }
    }

    _onTodoFetchd(data) {
        if (this.state.data.length > 0) {
            for (let i=0;i<data.length;i++) {
                if (data.length - i - 1 < 0 || this.state.data.length - i - 1 < 0) {
                    break
                }
                if(data[data.length - i - 1].id === this.state.data[this.state.data.length - i - 1].id) {
                    this.state.data[this.state.data.length - i - 1] = data[data.length - i - 1]
                }
            }
            this.setState({
                loading: false,
                data: this.state.data
            }
            )
            return
        }

        this.setState({
            loading: false,
            data: data
        }
        )
    }

    _onTodoStateChanged(todoState) {
        switch (todoState.state) {
            case DELETED:
                this.setState({
                    loading: false,
                    data: this.state.data.filter((todo) => todo.id !== todoState.id)
                })
            case UPDATED:
                this.todoBloc.fetchTodo()
        }
    }

    _onEditClicked(id) {
        this.props.history.push('/form' + id.toString())
    }

    _onDeleteClicked(data) {
        this.setState({
            focusedData: data,
            deleteDialogOpening: true
        })
    }

    _onCheckChanged(data) {
        data.checked = !data.checked
        this.todoBloc.updateTodo(data)
    }

    componentDidMount() {
        this.todoBloc.todoStream.listen(this.onTodoFetchedCallback)
        this.todoBloc.todoStateStream.listen(this.onTodoStateChangedCallback)
        this.todoBloc.fetchTodo()
    }

    componentWillUnmount() {
        this.todoBloc.todoStream.delete(this.onTodoFetchedCallback)
        this.todoBloc.todoStateStream.delete(this.onTodoStateChangedCallback)
    }

    render() {
        return (
            <div>
                <h2>List</h2>
                <div style={{ overflow: "auto" }}>
                    {this.state.data ? this.state.data.map((todo) => { return this._todoItem(todo) }) : ""}
                </div>
                <Progress loading={this.state.loading} />
                {this._deleteDialog()}
            </div>
        )
    }

    _todoItem(todo) {
        return (
            <TodoCard key={todo.id} 
                todo={todo} 
                onDeleteClicked={(data) => this._onDeleteClicked(data)} 
                onEditClicked={(id) => this._onEditClicked(id)} 
                onChange={(data) => this._onCheckChanged(data)}
            />
        )
    }

    _deleteDialog() {
        let onPositiveSelected = () => {
            this.setState({
                deleteDialogOpening: false,
                loading: true,
            }
            )
            this.todoBloc.deleteTodo(this.state.focusedData.id)
        }
        let onClosed = () => {
            this.setState({
                deleteDialogOpening: false,
            }
            )
        }
        return this.state.focusedData ? 
        <SupportDialog 
            isDialogOpening={this.state.deleteDialogOpening}
            onClosed={onClosed}
            onPositiveSelected={onPositiveSelected}
            title={"以下のデータを削除します。よろしいですか？"}
            texT={this.state.focusedData.outputString()} /> : ""
    }
}
