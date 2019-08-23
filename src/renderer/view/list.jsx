import React from "react";
import { IconButton } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
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
            selectedPageNum: this.todoBloc.getCachedPageNum(),
            data: [],
        }
    }

    /**
     * データリスト取得時の処理
     * @param {} data 
     */
    _onTodoFetched(data) {
        this.setState({
            loading: false,
            data: data ? data : []
        })
    }

    /**
     * データ状態更新時の処理(登録・変更)
     * @param {*} todoState 
     */
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

    /**
     * 編集ボタンタップ時の挙動. 編集画面に遷移する
     * @param {*} id 
     */
    _onEditClicked(id) {
        this.props.history.push('/form' + id.toString())
    }

    /**
     * 削除ボタンタップ時の挙動. 削除確認ダイアログを表示する
     * @param {} data 
     */
    _onDeleteClicked(data) {
        this.setState({
            focusedData: data,
            deleteDialogOpening: true
        })
    }

    /**
     * リスト上でデータを変更した時の処理
     * @param {} data 
     */
    _onDataChanged(data) {
        this.todoBloc.updateTodo(data)
    }

    /**
     * BlocのStreamをlistenして, 必要な情報をblocから取得する.
     */
    componentDidMount() {
        this.todoBloc.todoStream.listen(this.onTodoFetchedCallback)
        this.todoBloc.todoStateStream.listen(this.onTodoStateChangedCallback)
        this.todoBloc.fetchTodo(null)
        this._fetchPagingInfo()
    }

    /**
     * BlocのStreamのlistenを解除する
     */
    componentWillUnmount() {
        this.todoBloc.todoStream.delete(this.onTodoFetchedCallback)
        this.todoBloc.todoStateStream.delete(this.onTodoStateChangedCallback)
    }

    render() {
        return (
            <div>
                <p>
                    <h2 style={{width: "100%"}}>List{this._reloadButton()}</h2>
                </p>
                <SearchBox onSearchFunction={(searchInfo) => {
                    this.todoBloc.searchTodo(searchInfo)
                    this._fetchPagingInfo()
                }} />
                <div style={{ overflow: "auto" }}>
                    {this.state.data ? this.state.data.map((todo) => { return this._todoItem(todo) }) : ""}
                </div>
                <Paging onPageSelected={(i) => {
                    this.setState({
                        selectedPageNum: i,
                        loading: true
                    })
                    this.todoBloc.fetchTodo(i)
                }}
                    pageNum={this.state.pageNum}
                    selectedPageNum={this.state.selectedPageNum} />
                <Progress loading={this.state.loading} />
                {this._deleteDialog()}
            </div>
        )
    }

    _reloadButton() {
        return (
            <IconButton style={{float: "right"}}
                onClick={() =>{
                    this.setState({
                        selectedPageNum: 0,
                        loading: true,
                    })
                    this.todoBloc.clearCachedPageNum()
                    this.todoBloc.fetchTodo(null)
                    this._fetchPagingInfo()
                }}>
                <Icon style={{ color: "black" }} fontSize="large">autorenew</Icon>
            </IconButton>
        )
    }

    /**
     * それぞれのデータの描画
     * @param {} todo 
     */
    _todoItem(todo) {
        return (
            <TodoCard key={todo.id}
                todo={todo}
                onDeleteClicked={(data) => this._onDeleteClicked(data)}
                onEditClicked={(id) => this._onEditClicked(id)}
                onChange={(data) => this._onDataChanged(data)}
            />
        )
    }

    /**
     * 削除ダイアログ
     */
    _deleteDialog() {
        return this.state.focusedData ?
            <SupportDialog
                isDialogOpening={this.state.deleteDialogOpening}
                onClosed={() => this.setState({ deleteDialogOpening: false })}
                onPositiveSelected={() => {
                    this.setState({
                        deleteDialogOpening: false,
                        loading: true,
                    })
                    this.todoBloc.deleteTodo(this.state.focusedData.id)
                }}
                title={"以下のデータを削除します。よろしいですか？"}
                texT={this.state.focusedData.outputString()} /> : ""
    }

    /**
     * ページングに関わる情報を取得する
     */
    _fetchPagingInfo() {
        this.todoBloc.getPageCount().then((count) => {
            this.setState({
                pageNum: count,
                selectedPageNum: this.todoBloc.getCachedPageNum()
            })
        })
    }
}
