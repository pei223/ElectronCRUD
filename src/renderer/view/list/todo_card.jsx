import React from "react";
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


export default class TodoCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div className="card">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.props.todo.checked}
                            onChange={() => this.props.onChange(this.props.todo)}
                            inputProps={{
                                'aria-label': 'primary checkbox',
                            }}
                        />
                    }
                    label="Finished"
                    labelPlacement="top"
                    stule={{flex: 2, alignSelf: "left", }}
                />
                <div style={{ flex: 9, alignSelf: "center" }}>
                    <p style={{ wordBreak: "break-all", fontSize: "20px" }}>
                        {this.props.todo.title}
                    </p>
                </div>
                <div style={{ flex: 1, textAlign: "center", alignSelf: "flex-end", marginLeft: "10px" }}>
                    <Fab color="secondary" onClick={() => this.props.onEditClicked(this.props.todo.id)}>
                        <Icon style={{ color: "white" }}>edit_icon</Icon>
                    </Fab>
                    <p style={{ marginTop: "10px" }}></p>
                    <Fab style={{ backgroundColor: "#f44336" }} onClick={() => this.props.onDeleteClicked(this.props.todo)}>
                        <Icon style={{ color: "white" }}>close</Icon>
                    </Fab>
                </div>
            </div>
        </div>
    }
}