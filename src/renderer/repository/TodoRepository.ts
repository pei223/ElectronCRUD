import TodoEntity from '../entity/TodoEntity';
const remote = require('electron').remote;
const todoDb = remote.getGlobal('todoDb');


export default class TodoRepository {
    /**
     * データを登録して非同期でデータを返す. 
     * @param newTodo 登録したいデータ
     */
    public async create(newTodo: TodoEntity): Promise<TodoEntity | null> {
        let maxId = await this.maxId()
        return new Promise((resolve, reject) => {
            todoDb.insert({
                id: maxId,
                title: newTodo.title,
                checked: newTodo.checked,
            }, function (err: any) {
                if (err) {
                    console.log(err)
                    reject(null)
                    return
                }
                resolve(newTodo)
            })
        })
    }

    /**
     * 指定したページ数・データ数のデータリストを非同期で返す. 
     * @param pageNum ページ数
     * @param onePageDataCount 1ページに表示するデータ
     */
    public async read(pageNum: number, onePageDataCount: number): Promise<Array<TodoEntity> | null> {
        return new Promise((resolve, reject) => {
            todoDb.find({}).sort({
                id: -1
            }).skip(pageNum * onePageDataCount).limit(onePageDataCount).exec(
                function (err: any, docs: any) {
                    if (err) {
                        console.log(err)
                        reject(null)
                        return
                    }
                    resolve(this.parseTodoList(docs))
                }.bind(this)
            )
        })
    }

    /**
     * 指定したIDのデータを非同期でリストで返す.
     * @param id 取得したいデータのID
     */
    public async find(id: number): Promise<Array<TodoEntity> | null> {
        return new Promise((resolve, reject) => {
            todoDb.find({
                    id: id
                },
                function (err: any, docs: any) {
                    if (err || docs.length === 0) {
                        console.log(err)
                        reject(null)
                        return
                    }
                    resolve(this.parseTodoList(docs))
                }.bind(this)
            )
        })
    }

    /**
     * 指定したIDのデータを削除する. 削除したIDを非同期で返す. 
     * @param id 削除したいデータのID
     */
    public async delete(id: number): Promise<number | null> {
        return new Promise((resolve, reject) => {
            todoDb.remove({
                id: id
            }, {
                multi: true
            }, function (err: any) {
                if (err) {
                    console.log(err)
                    reject(null)
                    return
                }
                resolve(id)
            })
        })
    }

    /**
     * データを更新する. 更新後、更新したデータを非同期で返す. 
     * @param todo 更新したいデータ
     */
    public async update(todo: TodoEntity): Promise<TodoEntity | null> {
        return new Promise((resolve, reject) => {
            todoDb.update({
                id: todo.id
            }, {
                id: todo.id,
                title: todo.title,
                checked: todo.checked
            }, {}, function (err: any, docId: any) {
                if (err) {
                    console.log(err)
                    reject(null)
                    return
                }
                resolve(todo)
            })
        })
    }

    /**
     * データ数を返す. 
     */
    public async count(): Promise<number> {
        return new Promise((resolve, reject) => {
            todoDb.find({},
                function (err: any, docs: any) {
                    if (err) {
                        console.log(err)
                        resolve(0)
                        return
                    }
                    resolve(docs.length)
                }.bind(this)
            )
        })
    }

    /**
     * DBのデータをパースして返す. 
     * @param objects 
     */
    private parseTodoList(objects: Array<any>): Array<TodoEntity> {
        if (!objects || objects.length === 0) {
            return []
        }
        let todos = []
        objects.forEach(
            (object: any) => {
                todos.push(new TodoEntity(object.id, object.title, object.checked))
            }
        )
        return todos
    }

    /**
     * 全データのIDの最大値を返す. 
     */
    private async maxId(): Promise<number> {
        return new Promise((resolve, reject) => {
            todoDb.find({}).sort({
                id: -1
            }).exec(
                function (err: any, docs: any) {
                    if (err || !docs || docs.length === 0 || !docs[0]) {
                        resolve(1)
                        return
                    }
                    resolve(docs[0].id + 1)
                }
            )
        })
    }
}