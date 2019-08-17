import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

export default class Progress extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return this.props.loading ? 
        <div className="screen-center">
            <CircularProgress color="primary" />
        </div> : <div></div>
    }
}