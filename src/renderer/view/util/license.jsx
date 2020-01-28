import React from "react"
const shell = require('electron').shell
let licenseJson = require("../../../licenses.json")

export default class license extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div  style={{border: "1px solid silver", borderRadius: "6px", overflow: "auto", height: "250px"}}>
                {Object.keys(licenseJson).map((licenseName) => {return this._licenseRow(licenseName)})}
            </div>
        )
    }

    _licenseRow(licenseName) {
        let license = licenseJson[licenseName]
        if (!license) {
            return ""
        }
        return (
            <div style={{borderBottom: "1px solid #464646", cursor: "pointer"}} onClick={() => this._onClickRow(license.repository)}>
                <p>{licenseName}({license["licenses"].toString()})</p>
                <p style={{color: "gray"}}>{license["publisher"]}</p>
            </div>
        )
    }

    _onClickRow(url) {
        shell.openExternal(url)
    }
}