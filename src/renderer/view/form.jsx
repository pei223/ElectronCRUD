import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// original
import TodoEntity from "../entity/TodoEntity";
import BlocProvider from "../bloc/BlocProvider";
import { ADDED, UPDATED } from "../entity/TodoState";
import Progress from "./util/progress";


export default class Form extends React.Component {
    constructor(props) {
        super(props)
        this.todoBloc = BlocProvider.todoBloc
        let id = this.props && this.props.match && this.props.match.params.id ? parseInt(this.props.match.params.id) : null
        this.state = {
            id: id,
            todoTitle: "",
            checked: false,
            loading: id ? true : false,
        }
        this.onTodoStateChangedCallback = (data) => this._onTodoStateChanged(data)
        this.onTodoFindedCallback = (data) => this._onTodoFinded(data)
    }

    _onTodoFinded(todo) {
        if (todo) {
            this.setState({
                todoTitle: todo.title,
                checked: todo.checked,
                loading: false,
            })
        }
    }

    _onTodoStateChanged(todoState) {
        if (todoState.state === ADDED || todoState.state === UPDATED) {
            this.props.history.push('/list')
        }
    }

    _validateCheck() {
        if (this.state.todoTitle === "") {
            // TODO エラーメッセージ
            return false
        }
        return true
    }

    _onSubmitClicked() {
        if (!this._validateCheck()) {
            return
        }
        this.setState({
            loading: true,
        })
        if (this.state.id) {
            this.todoBloc.updateTodo(new TodoEntity(this.state.id, this.state.todoTitle, this.state.checked))
        } else {
            this.todoBloc.addTodo(new TodoEntity(null, this.state.todoTitle, this.state.checked))
        }
    }

    componentWillMount() {
        this.todoBloc.todoStateStream.listen(this.onTodoStateChangedCallback)
        this.todoBloc.todoStream.listen(this.onTodoFindedCallback)
        if (this.state.id) {
            this.todoBloc.findTodo(this.state.id)
        }
    }

    componentWillUnmount() {
        this.todoBloc.todoStream.delete(this.onTodoFindedCallback)
        this.todoBloc.todoStateStream.delete(this.onTodoStateChangedCallback)
    }

    render() {
        return (
            <div>
                <h2>{this.state.id ? "Edit" : "Add"}</h2>
                <TextField fullWidth label="title" onChange={(e) => this.setState({ todoTitle: e.target.value })} value={this.state.todoTitle}
                    InputProps={{
                        startAdornment: (
                            <span><Icon position="start">edit</Icon>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        ),
                    }}
                    autoFocus={true} />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.checked}
                            onChange={(e) => this.setState({ checked: e.target.checked })}
                            inputProps={{
                                'aria-label': 'primary checkbox',
                            }}
                        />
                    }
                    label="Finished"
                    labelPlacement="start"
                    style={{ textAlign: "center", marginTop: "30px" }}
                />
                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <Button variant="contained" color="secondary" onClick={() => this._onSubmitClicked()} style={{ color: "white", verticalAlign: "middle" }}>
                        <Icon>{this.state.id ? "edit" : "add"}</Icon>
                        {this.state.id ? "　Edit" : "　Add"}
                    </Button>
                    <Button variant="contained" onClick={() => this.props.history.push("/list")}
                        style={{ color: "white", verticalAlign: "middle", backgroundColor: "#f44336", marginLeft: "15px" }}>
                        <Icon>close</Icon>Cancel
                    </Button>
                </div>
                <Progress loading={this.state.loading} />
            </div>
        )
    }
}