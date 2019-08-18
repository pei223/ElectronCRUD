export default class TodoEntity {
    id: number
    title: string
    checked: boolean

    constructor(id: number, title: string, checked: boolean) {
        this.id = id
        this.title = title
        this.checked = checked
    }

    outputString(): string {
        return "タイトル：" + this.title + "、　　完了：" + (this.checked ? "している" : "していない\n")
    }
}