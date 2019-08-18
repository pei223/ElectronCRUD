import TodoEntity from '../entity/TodoEntity';
import TodoState from '../entity/TodoState';
const remote = require('electron').remote;
const todoDb = remote.getGlobal('todoDb');


export default class TodoRepository {
    public async create(newTodo: TodoEntity): Promise<TodoEntity> {
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

    public async read(): Promise<Array<TodoEntity>> {
        return new Promise((resolve, reject) => {
            todoDb.find({}).sort({
                id: -1
            }).exec(
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

    public async find(id: number): Promise<TodoEntity> {
        return new Promise((resolve, reject) => {
            todoDb.find({
                    id: id
                },
                function (err: any, docs: any) {
                    if (err || docs.length === 0) {
                        console.log(err)
                        reject(err)
                        return
                    }
                    resolve(docs[0])
                }.bind(this)
            )
        })
    }

    public async delete(id: number): Promise<number> {
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

    public async update(todo: TodoEntity): Promise<TodoState> {
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
                resolve(docId)
            })
        })
    }

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