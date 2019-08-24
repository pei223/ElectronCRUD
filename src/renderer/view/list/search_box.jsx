import React from "react"
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Drawer from '@material-ui/core/Drawer'
import Fab from '@material-ui/core/Fab'
// original
import SearchInfo from '../../entity/SearchInfo'


// TODO データによってフォーム・stateを変更
export default class SearchBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = this._initState()
    }

    /**
     * TODO 扱うデータによって修正
     */
    _initState() {
        let now = new Date()
        let start = new Date()
        start.setMonth(now.getMonth() - 1)
        let end = new Date()
        end.setMonth(now.getMonth() + 1)
        return {
            opening: false,
            checked: false,
            keyword: "",
            startDate: this._formatDate(start),
            endDate: this._formatDate(end),
        }
    }

    render() {
        return (
            <div>
                {this._buttonsRow()}
                {this._drawer()}
            </div>
        )
    }

    /**
     * 検索ボックスボタン. タップするとドロワー表示の検索ボックスが表示される. 
     */
    _buttonsRow() {
        return (
            <div>
                <Fab color="secondary" variant="extended" aria-label="delete" onClick={() => this._toggleDrawer(true)} 
                    style={{
                        color: "white",
                        marginTop: "20px",
                        marginBottom: "20px",
                    }} >
                    <Icon>search</Icon>{"　Search box"}
                </Fab>
                <Fab color="secondary" variant="extended" aria-label="delete" onClick={() => this._onClearClicked()} 
                    style={{ color: "white", backgroundColor: "#f44336", marginLeft: "15px" }}>
                    <Icon>close</Icon>{"　Clear"}
                </Fab>
            </div>
        )
    }

    /**
     * ドロワー表示部分.
     */
    _drawer() {
        return <Drawer anchor="top" open={this.state.opening} onClose={() => this._toggleDrawer(false)}>
            <div style={{
                margin: "30px",
            }}>
                {this._searchForm()}
            </div>
        </Drawer>
    }

    /**
     * 検索ボックスのフォーム.
     * TODO 扱うデータによって修正
     */
    _searchForm() {
        return <div>
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
                            />}
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
                        defaultValue={this.state.startDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.state.startDate}
                        onChange={(e) => {
                            let date = e.target.value
                            this.setState({
                                startDate : date
                             })
                        }}
                        style={{
                            marginRight: "20px"
                        }}
                    />
                    <TextField
                        id="datetime-local"
                        label="end date"
                        type="datetime-local"
                        defaultValue={this.state.endDate}
                        value={this.state.endDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => {
                            let date = e.target.value
                            this.setState({ 
                                endDate: date
                            })
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
    }

    _toggleDrawer(open) {
        this.setState({
            opening: open
        })
    }

    /**
     * TODO 検索情報に渡すデータ
     */
    _onSearchClicked() {
        let searchInfo = new SearchInfo(this.state.keyword, this.state.checked, this._parseDate(this.state.startDate), this._parseDate(this.state.endDate))
        this.props.onSearchFunction(searchInfo)
        this._toggleDrawer(false)
    }

    _onClearClicked() {
        this.props.onSearchFunction(null)
        this.setState(this._initState())
        this._toggleDrawer(false)
    }

    _formatDate(date) {
        if (date === null || !(date.getTime instanceof Function) || isNaN(date.getTime())) {
            return ""
        }
        return date.getFullYear() + "-" + this._fixTo2digit(date.getMonth() + 1) + "-" + this._fixTo2digit(date.getDate()) + "T" + this._fixTo2digit(date.getHours())
            + ":" + this._fixTo2digit(date.getMinutes())
    }

    _fixTo2digit(numStr) {
        return ("00" + numStr).substr(-2)
    }

    _parseDate(dateStr) {
        try {
            let date = new Date()
            date.setSeconds(0)
    
            let field = dateStr.split("T")
            let dateField = field[0].split("-")
            let timeField = field[1].split(":")
    
            date.setFullYear(parseInt(dateField[0]))
            date.setMonth(parseInt(dateField[1])-1)
            date.setDate(parseInt(dateField[2]))
            date.setHours(parseInt(timeField[0]))
            date.setMinutes(parseInt(timeField[1]))
            return date
        } catch(e) {
            console.log(e)
            return null
        }
    }
}