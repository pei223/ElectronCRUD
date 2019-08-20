import Link from '@material-ui/core/Link';
import React from "react";

const DISPLAY_PAGE_RANGE = 1


export default class Paging extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNum: 0,
            selectedPageNum: 0,
        }
    }

    componentWillMount() {
        this.props.getPageCountFunction().then((pageNum) => {
            this.setState({
                pageNum: pageNum,
                selectedPageNum: this.props.selectedPageNum ? this.props.selectedPageNum : 0
            })
        })
    }

    render() {
        let pagingArray = this._pagingArray()
        let firstPaging = pagingArray[0] > 0 ? <span>{this._pageLink(0)}...</span> : "" 
        let lastPaging = pagingArray[pagingArray.length - 1] < this.state.pageNum - 1 ? <span>...{this._pageLink(this.state.pageNum - 1)}</span> : "" 

        return (
        <div style={{
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "40px"
        }}>
        {firstPaging}{pagingArray.map((i) => {return this._pageLink(i)})}{lastPaging}
        </div>
        )
    }

    _pageLink(pageNum) {
        return (
        <Link 
            style={{
                marginLeft: "10px",
                marginRight: "10px",
                fontSize: pageNum == this.state.selectedPageNum ? "25px": "20px",
                color: pageNum == this.state.selectedPageNum ? "blue" : ""

            }}   
            onClick={() => {
                this.setState({
                    selectedPageNum: pageNum
                })
                this.props.onPageSelected(pageNum)
            }}>
        {pageNum + 1}
      </Link>)
    }

    _pagingArray() {
        let pagingArray = []
        for(let i=this.state.selectedPageNum-DISPLAY_PAGE_RANGE;i<=this.state.selectedPageNum+DISPLAY_PAGE_RANGE;i++) {
            if (i >= 0 && i < this.state.pageNum) {
                pagingArray.push(i)
            }
        }
        return pagingArray
    }
}