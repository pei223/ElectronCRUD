export default class PageInfo {
    lastPageNum: number
    currentPageNum: number
    onePageDataNum: number

    constructor(lastPageNum: number, currentPageNum: number, onePageDataNum: number) {
        this.lastPageNum = lastPageNum
        this.currentPageNum = currentPageNum
        this.onePageDataNum = onePageDataNum
    }

    static firstPage(lastPageNum: number, onePageDataNum: number): PageInfo {
        return new PageInfo(lastPageNum, 0, onePageDataNum)
    }
}