/**
 * 検索処理に必要な情報.
 * TODO 扱うデータに合わせる
 */
export default class SearchInfo {
    keyword: string
    checked: boolean
    startDate: Date
    endDate: Date

    constructor(keyword: string, checked: boolean, startDate: Date, endDate: Date) {
        this.keyword = keyword === "" ? null : keyword
        this.checked = checked
        this.startDate = this.isValidDate(startDate) ? startDate : null
        this.endDate = this.isValidDate(endDate) ? endDate : null
    }

    static empty() {
        return new SearchInfo(null, null, null, null)
    }

    private isValidDate(date: Date): boolean {
        return date !== null && date.getTime instanceof Function && !isNaN(date.getTime())
    }
}