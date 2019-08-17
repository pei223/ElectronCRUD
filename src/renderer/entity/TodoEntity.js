export default class TodoEntity {
    constructor(id, title, checked) {
        this.id = id
        this.title = title
        this.checked = checked
    }

    outputString() {
        return "タイトル：" + this.title + "、　　完了：" + (this.checked ? "している" : "していない\n")
    }
}