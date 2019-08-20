import React from "react"
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
// original
import SearchInfo from '../../entity/SearchInfo'


export default class SearchBox extends React.Component {
    constructor(props) {
        super(props)
        let now = new Date()
        let start = new Date()
        start.setMonth(now.getMonth() - 1)
        let end = new Date()
        end.setMonth(now.getMonth() + 1)
        this.state = {
            opening: false,
            checked: false,
            keyword: "",
            startDate: start.getTime(),
            endDate: end.getTime(),
        }
    }

    render() {
        return (
            <div>
                {this._searchBoxButton()}
                {this._drawer()}
            </div>
        )
    }

    _searchBoxButton() {
        return (
            <Fab color="secondary" variant="extended" aria-label="delete" onClick={() => this._toggleDrawer(true)} 
                style={{
                    color: "white",
                    marginTop: "20px",
                    marginBottom: "20px",
                }} >
                <Icon>search</Icon>{"　Search box"}
            </Fab>
        )
    }

    _drawer() {
        return <Drawer anchor="top" open={this.state.opening} onClose={() => this._toggleDrawer(false)}>
            <div style={{
                margin: "30px",
            }}>
                <div style={{
                    marginBottom: "15px",
                }}>
                    <TextField fullWidth label="keyword" onChange={(e) => this.setState({ keyword: e.target.value })} value={this.state.keyword}
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
                        style={{ textAlign: "center", marginTop: "10px", marginBottom: "10px" }}
                    />
                </div>
                <div>
                    <TextField
                        id="datetime-local"
                        label="start date"
                        type="datetime-local"
                        defaultValue={this._formatDate(this.state.startDate)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(date) => {
                            this.setState({ startDate: date === null || !(date.getTime instanceof Function) ? null : date.getTime() })
                        }}
                        style={{
                            marginRight: "20px"
                        }}
                    />
                    <TextField
                        id="datetime-local"
                        label="end date"
                        type="datetime-local"
                        defaultValue={this._formatDate(this.state.endDate)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(date) => {
                            this.setState({ endDate: date === null || !(date.getTime instanceof Function) ? null : date.getTime() })
                        }}
                    />
                </div>
                <div style={{
                    marginTop: "20px",
                    textAlign: "center",
                }}>
                    <Fab color="secondary" variant="extended" aria-label="delete" onClick={() => this._onSearchClicked()} 
                        style={{
                            color: "white",
                        }}>
                        <Icon>search</Icon>{"　Search"}
                    </Fab>
                </div>
            </div>
        </Drawer>
    }

    _toggleDrawer(open) {
        this.setState({
            opening: open
        })
    }

    _onSearchClicked() {
        this._toggleDrawer(false)
        let searchInfo = new SearchInfo(this.state.keyword, this.state.checked, this.state.startDate, this.state.endDate)
        this.props.onSearchFunction(searchInfo)
    }

    _formatDate(dateNumber) {
        let date = new Date()
        date.setTime(dateNumber)
        if (!(date.getTime instanceof Function) || isNaN(date.getTime())) {
            return ""
        }
        return date.getFullYear() + "-" + this._fixTo2digit(date.getMonth() + 1) + "-" + this._fixTo2digit(date.getDate()) + "T" + this._fixTo2digit(date.getHours())
            + ":" + this._fixTo2digit(date.getMinutes())
    }

    _fixTo2digit(numStr) {
        return ("00" + numStr).substr(-2)
    }
}