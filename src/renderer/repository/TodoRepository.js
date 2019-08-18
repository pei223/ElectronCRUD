import TodoEntity from '../entity/TodoEntity';
const remote = require('electron').remote;
const todoDb = remote.getGlobal('todoDb');


export default class TodoRepository {
    async create(newTodo) {
        let maxId = await this._maxId()
        return new Promise((resolve, reject) => {
            todoDb.insert({
                id: maxId,
                title: newTodo.title,
                checked: newTodo.checked,
            }, function (err, doc) {
                if (err) {
                    console.log(err)
                    reject(null)
                    return
                }
                resolve(doc)
            })
        })
    }

    async read() {
        return new Promise((resolve, reject) => {
            todoDb.find({}).sort({
                id: -1
            }).exec(
                function (err, docs) {
                    if (err) {
                        console.log(err)
                        reject(err)
                        return
                    }
                    resolve(this._parseTodoList(docs))
                }.bind(this)
            )
        })
    }

    async find(id) {
        return new Promise((resolve, reject) => {
            todoDb.find({
                    id: id
                },
                function (err, docs) {
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

    async delete(id) {
        return new Promise((resolve, reject) => {
            todoDb.remove({
                id: id
            }, {
                multi: true
            }, function (err, docs) {
                if (err) {
                    console.log(err)
                    reject(null)
                    return
                }
                resolve(id)
            })
        })
    }

    async update(todo) {
        return new Promise((resolve, reject) => {
            todoDb.update({
                id: todo.id
            }, {
                id: todo.id,
                title: todo.title,
                checked: todo.checked
            }, {}, function (err, docId) {
                if (err) {
                    console.log(err)
                    reject(null)
                    return
                }
                resolve(docId)
            })
        })
    }

    _parseTodoList(objects) {
        if (!objects || objects.length === 0) {
            return []
        }
        let todos = []
        objects.forEach(
            (object) => {
                todos.push(new TodoEntity(object.id, object.title, object.checked))
            }
        )
        return todos
    }

    async _maxId() {
        return new Promise((resolve, reject) => {
            todoDb.find({}).sort({
                id: -1
            }).exec(
                function (err, docs) {
                    if (err || !docs || docs.length === 0 || !docs[0]) {
                        resolve(0)
                    }
                    resolve(docs[0].id + 1)
                }
            )
        })
    }
}