import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContent } from "@material-ui/core";


export default class SupportDialog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Dialog
            open={this.props.isDialogOpening}
            PaperProps={{
                style: {
                    backgroundColor: "gainsboro",
                    boxShadow: "none",
                }
            }}
            BackdropProps={{
                style: {
                    color: "#00000050",
                },
            }}
            onClose={this.props.onClosed}>
            <DialogTitle id="alert-dialog-slide-title">{this.props.title}</DialogTitle>
            <DialogContent>{this.props.text}</DialogContent>
            <DialogActions>
                <Button color="default" onClick={this.props.onClosed}>
                    いいえ
                </Button>
                <Button onClick={this.props.onPositiveSelected} color="primary">
                    はい
                </Button>
            </DialogActions>
        </Dialog>
    }
}