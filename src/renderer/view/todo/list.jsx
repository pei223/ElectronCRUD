import React from "react";
import { IconButton } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
// original
import BlocProvider from "../../bloc/BlocProvider";
import Progress from "../util/progress";
import TodoCard from "./todo_card";
import SupportDialog from "../util/support_dialog";
import Paging from "../util/paging";
import SearchBox from "./search_box";
import { Observer } from "../../bloc/Stream";


const errorViewStyle = {
    fontSize: "25px",
    textAlign: "center",
}

export default class List extends React.Component {
    constructor() {
        super()
        this.todoBloc = BlocProvider.getInstance().todoBloc
        this.pageInfoObserver = new Observer((pageInfo) => {
            this.setState({
                pageInfo: pageInfo,
            })
        }, (resultId) => {
        })
        this.todoObserver = new Observer((data) => {
            this.setState({
                loading: false,
                data: data
            })
        }, (resultId) => {
            this.setState({
                loading: false,
                failed: true,
            })
        })
        this.state = {
            deleteDialogOpening: false,
            focusedData: null,
            loading: true,
            failed: false,
            pageInfo: null,
            data: [],
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
        this.todoBloc.update(data).then((result) => {
            if (result) {
                this.todoBloc.fetch()
            } else {
                // TODO エラー処理
            }
        })
    }

    /**
     * BlocのStreamをlistenして, 必要な情報をblocから取得する.
     */
    componentDidMount() {
        this.todoBloc.todoStream.listen(this.todoObserver)
        this.todoBloc.pageInfoStream.listen(this.pageInfoObserver)
        this.todoBloc.fetchFirstPage()
    }

    /**
     * BlocのStreamのlistenを解除する
     */
    componentWillUnmount() {
        this.todoBloc.todoStream.delete(this.todoObserver)
        this.todoBloc.pageInfoStream.delete(this.pageInfoObserver)
    }

    render() {
        return (
            <div>
                <p>
                    <h2 style={{width: "100%"}}>List{this._reloadButton()}</h2>
                </p>
                <SearchBox onSearchFunction={(searchInfo) => {
                    this.todoBloc.search(searchInfo)
                }} />
                {this.state.failed ? this._errorView() : ""}
                <div style={{ overflow: "auto" }}>
                    {this.state.data ? this.state.data.map((todo) => { return this._todoItem(todo) }) : ""}
                </div>
                <Paging onPageSelected={(i) => {
                    this.setState({
                        loading: true,
                        failed: false,
                    })
                    this.todoBloc.fetchSelectedPage(i)
                }} pageInfo={this.state.pageInfo} />
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
                        loading: true,
                        failed: false,
                    })
                    this.todoBloc.fetch()
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
                    this.todoBloc.delete(this.state.focusedData.id).then((result) => {
                        if (result) {
                            this.todoBloc.fetch()
                        } else {
                            // TODO エラー処理
                        }
                    })
                }}
                title={"以下のデータを削除します。よろしいですか？"}
                text={this.state.focusedData.outputString()} /> : ""
    }

    _errorView() {
        return <p style={errorViewStyle}>データ取得に失敗しました</p>
    }
}
