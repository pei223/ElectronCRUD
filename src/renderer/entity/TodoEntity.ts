export default class TodoEntity {
    id: number
    title: string
    checked: boolean
    createdAt: number

    constructor(id: number, title: string, checked: boolean, createdAt: number) {
        this.id = id
        this.title = title
        this.checked = checked
        this.createdAt = createdAt
    }

    outputString(): string {
        return "タイトル：" + this.title + "、　　完了：" + (this.checked ? "している" : "していない\n")
    }

    static onlyId(id: number): TodoEntity {
        return new TodoEntity(id, null, null, null)
    }
}