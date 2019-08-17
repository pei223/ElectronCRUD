import Datastore from 'nedb'
const { app } = require('electron')
const userData = app.getPath('home');
import path from 'path'


export function initDb() {
    const todoDb = new Datastore({
        filename: path.join(userData, "/.todo.db"), autoload: true
    })
    global.todoDb = todoDb
}
