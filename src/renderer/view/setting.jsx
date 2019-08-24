import React from "react"
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import Icon from '@material-ui/core/Icon'
// original
import BlocProvider from "../bloc/BlocProvider";
import AppSettingData from "../entity/AppSettingData";


export default class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.settingBloc = BlocProvider.getInstance().settingBloc
        this.prevAppSettingData = this.settingBloc.getAppData()
        this.state = {
            onePageDataNum: this.prevAppSettingData.onePageDataNum,
            isOpenSaveModal: false,
        }
    }

    render() {
        return (<div>
            <h2>Settings</h2>
            {this._inputForm()}
            <div style={{textAlign: "center", marginTop: "25px"}}>
                <p>
                    <Button onClick={() => this._onSaveClicked()} color="secondary" disabled={!this._isDataChanged()}  variant="contained"
                        style={{ color: "white", verticalAlign: "middle"}}>
                        設定を保存
                    </Button>
                </p>
                <Button onClick={() => console.log("license page")} color="default"  variant="contained"
                    style={{ color: "black", verticalAlign: "middle", marginTop: "40px"}}>
                    License page
                </Button>
            </div>
            {this._saveModal()}
        </div>)
    }

    // TODO 扱うアプリデータに修正
    _inputForm() {
        return (
            <p style={{marginTop: "15px", }}>
                <TextField
                    error={!this._isValidOnePageDataNum()}
                    ref='oneDataPageNum'
                    label="1ページに表示するデータ数"
                    value={this.state.onePageDataNum}
                    onChange={(e) => this.setState({ onePageDataNum: e.target.value })}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{width: "50%"}} />
                <p style={{color: "red", fontSize: "12px"}} >{AppSettingData.validationMessageOfOnePageDataNum(parseInt(this.state.onePageDataNum))}</p>
            </p>
        )
    }

    _saveModal() {
        return (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={this.state.isOpenSaveModal}
                onClose={() => this.setState({isOpenSaveModal: false})}
                closeAfterTransition
                className="screen-center"
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
            <Fade in={this.state.isOpenSaveModal}>
                <div className="screen-center modal-content">
                    <Icon  fontSize="large">check</Icon>
                    <p id="transition-modal-description" style={{marginTop: "10px"}}>設定保存完了</p>
                </div>
                </Fade>
            </Modal>
        )
    }

    // TODO 扱うアプリデータに修正
    _onSaveClicked() {
        this.setState({
            isOpenSaveModal: true,
        })
        this.settingBloc.setAppData(new AppSettingData(parseInt(this.state.onePageDataNum)))
    }

    // TODO 扱うアプリデータに修正
    _isDataChanged() {
        if (!this._isValidOnePageDataNum()) {
            return false
        }
        return !(this.prevAppSettingData.equals(new AppSettingData(parseInt(this.state.onePageDataNum))))
    }

    // TODO 扱うアプリデータに修正
    _isValidOnePageDataNum() {
        try {
            return AppSettingData.isValidOnePageDataNum(parseInt(this.state.onePageDataNum))
        } catch(e) {
            return false
        }
    }
}