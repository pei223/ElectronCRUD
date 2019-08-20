import React from "react";
// original
import BlocProvider from "../bloc/BlocProvider";
import { StateVal } from "../entity/TodoState";
import Progress from "./util/progress";
import TodoCard from "./list/todo_card";
import SupportDialog from "./util/support_dialog";
import Paging from "./list/paging";
import SearchBox from "./list/search_box";


export default class List extends React.Component {
    constructor() {
        super()
        this.todoBloc = BlocProvider.getInstance().todoBloc
        this.onTodoFetchedCallback = (data) => this._onTodoFetched(data)
        this.onTodoStateChangedCallback = (data) => this._onTodoStateChanged(data)
        this.state = {
            deleteDialogOpening: false,
            focusedData: null,
            loading: true,
            pageNum: 0,
            data: []
        }
    }

    _onTodoFetched(data) {
        if (!data) {
            this.setState({
                loading: false,
                data: []
            })
            return
        }
        this.setState({
            loading: false,
            data: data
        })
        this._fetchPageCount()
    }

    _onTodoStateChanged(todoState) {
        if (!todoState) {
            return
        }
        switch (todoState.state) {
            case StateVal.DELETED:
                this.setState({
                    loading: false,
                    data: this.state.data.filter((todo) => todo.id !== todoState.todo.id)
                })
                break
            case StateVal.UPDATED:
                let newTodos = this.state.data.concat()
                let updatedTodoIndex = newTodos.findIndex((todo) => todo.id === todoState.todo.id)
                if (updatedTodoIndex < 0) {
                    return
                }
                newTodos[updatedTodoIndex] = todoState.todo
                this.setState({
                    loading: false,
                    data: newTodos
                })
                break
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
        this.todoBloc.fetchTodo(null)
    }

    componentWillUnmount() {
        this.todoBloc.todoStream.delete(this.onTodoFetchedCallback)
        this.todoBloc.todoStateStream.delete(this.onTodoStateChangedCallback)
    }

    render() {
        return (
            <div>
                <h2>List</h2>
                <SearchBox 
                    onSearchFunction={(searchInfo) => this.todoBloc.searchTodo(searchInfo)}
                />
                <div style={{ overflow: "auto" }}>
                    {this.state.data ? this.state.data.map((todo) => { return this._todoItem(todo) }) : ""}
                </div>
                <Paging onPageSelected={(i) => {
                        this.setState({
                            loading: true
                        })
                        this.todoBloc.fetchTodo(i)
                    }}
                    pageNum={this.state.pageNum}
                    selectedPageNum={this.todoBloc.getCachedPageNum()} />
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

    _fetchPageCount() {
        this.todoBloc.getPageCount().then((count) => this.setState({
            pageNum: count
        }))
    }
}
