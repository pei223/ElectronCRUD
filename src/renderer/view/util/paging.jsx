import Link from '@material-ui/core/Link';
import React from "react";

const DISPLAY_PAGE_RANGE = 1


export default class Paging extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.pageInfo === null) {
            return <div></div>
        }
        let pagingArray = this._pagingArray()
        let firstPaging = pagingArray[0] > 0 ? <span>{this._pageLink(0)}...</span> : ""
        let lastPaging = pagingArray[pagingArray.length - 1] < this.props.pageInfo.lastPageNum - 1 ? <span>...{this._pageLink(this.props.pageInfo.lastPageNum - 1)}</span> : ""
        return (
            <div style={{
                textAlign: "center",
                marginTop: "20px",
                marginBottom: "40px"
            }}>
                {firstPaging}{pagingArray.map((i) => { return this._pageLink(i) })}{lastPaging}
            </div>
        )
    }

    _pageLink(pageNum) {
        return (
            <Link
                style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    fontSize: pageNum === this.props.pageInfo.currentPageNum ? "25px" : "20px",
                    color: pageNum === this.props.pageInfo.currentPageNum ? "blue" : ""
                }}
                onClick={() => {
                    this.props.onPageSelected(pageNum)
                }}>
                {pageNum + 1}
            </Link>)
    }

    _pagingArray() {
        let pagingArray = []
        for (let i = this.props.pageInfo.currentPageNum - DISPLAY_PAGE_RANGE; i <= this.props.pageInfo.currentPageNum + DISPLAY_PAGE_RANGE; i++) {
            if (i >= 0 && i < this.props.pageInfo.lastPageNum) {
                pagingArray.push(i)
            }
        }
        return pagingArray
    }
}