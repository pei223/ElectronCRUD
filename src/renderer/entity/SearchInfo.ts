export default class SearchInfo {
    keyword: string
    checked: boolean
    startDate: number
    endDate: number

    constructor(keyword: string, checked: boolean, startDate: number, endDate: number) {
        this.keyword = keyword === "" ? null : keyword
        this.checked = checked
        this.startDate = this.isValidDate(startDate) ? startDate : null
        this.endDate = this.isValidDate(endDate) ? endDate : null
    }

    static empty() {
        return new SearchInfo(null, null, null, null)
    }

    private isValidDate(dateNumber: number): boolean {
        let date = new Date()
        date.setTime(dateNumber)
        return date.getTime instanceof Function && !isNaN(date.getTime())
    }
}