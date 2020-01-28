import TodoEntity from "../domain/TodoEntity";
import SearchInfo from "../domain/SearchInfo";
import PageInfo from "../domain/value_object/PageInfo";
const remote = require("electron").remote;
const todoDb = remote.getGlobal("todoDb");

/**
 * TODO 扱うデータによって食わせるデータを修正
 */
export default class TodoRepository {
  /**
   * データを登録して非同期でデータを返す.
   * @TODO 扱うデータに合わせる.
   * @param newTodo 登録したいデータ
   */
  public async create(newTodo: TodoEntity): Promise<boolean> {
    let maxId = await this.maxId();
    return new Promise((resolve, reject) => {
      todoDb.insert(
        {
          id: maxId,
          title: newTodo.title,
          checked: newTodo.checked,
          createdAt: newTodo.createdAt
        },
        function(err: any) {
          if (err) {
            console.log(err);
            reject(false);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  /**
   * 指定したページ数・データ数のデータリストを非同期で返す.
   * @param pageNum ページ数
   * @param onePageDataCount 1ページに表示するデータ
   */
  public async read(
    pageInfo: PageInfo,
    searchInfo: SearchInfo
  ): Promise<Array<TodoEntity> | null> {
    return new Promise((resolve, reject) => {
      todoDb
        .find(searchInfo === null ? {} : this.toQuery(searchInfo))
        .sort({
          id: -1
        })
        .skip(pageInfo.currentPageNum * pageInfo.onePageDataNum)
        .limit(pageInfo.onePageDataNum)
        .exec(
          function(err: any, docs: any) {
            if (err) {
              console.log(err);
              reject(null);
              return;
            }
            resolve(this.parseTodoList(docs));
          }.bind(this)
        );
    });
  }

  /**
   * 指定したIDのデータを非同期でリストで返す.
   * @param id 取得したいデータのID
   */
  public async find(id: number): Promise<Array<TodoEntity> | null> {
    return new Promise((resolve, reject) => {
      todoDb.find(
        {
          id: id
        },
        function(err: any, docs: any) {
          if (err || docs.length === 0) {
            console.log(err);
            reject(null);
            return;
          }
          resolve(this.parseTodoList(docs));
        }.bind(this)
      );
    });
  }

  /**
   * 指定したIDのデータを削除する. 削除したIDを非同期で返す.
   * @param id 削除したいデータのID
   */
  public async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      todoDb.remove(
        {
          id: id
        },
        {
          multi: true
        },
        function(err: any) {
          if (err) {
            console.log(err);
            reject(false);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  /**
   * データを更新する. 更新後、更新したデータを非同期で返す.
   * TODO 扱うデータに合わせる.
   * @param todo 更新したいデータ
   */
  public async update(todo: TodoEntity): Promise<boolean> {
    return new Promise((resolve, reject) => {
      todoDb.update(
        {
          id: todo.id
        },
        {
          id: todo.id,
          title: todo.title,
          checked: todo.checked,
          createdAt: todo.createdAt
        },
        {},
        function(err: any, docId: any) {
          if (err) {
            console.log(err);
            reject(false);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  /**
   * データ数を返す.
   */
  public async count(searchInfo: SearchInfo): Promise<number> {
    return new Promise((resolve, reject) => {
      todoDb.find(
        searchInfo === null ? {} : this.toQuery(searchInfo),
        function(err: any, docs: any) {
          if (err) {
            console.log(err);
            resolve(0);
            return;
          }
          resolve(docs.length);
        }.bind(this)
      );
    });
  }

  /**
   * DBのデータをパースして返す.
   * TODO 扱うデータに合わせる.
   * @param objects
   */
  private parseTodoList(objects: Array<any>): Array<TodoEntity> {
    if (!objects || objects.length === 0) {
      return [];
    }
    let todos = [];
    objects.forEach((object: any) => {
      todos.push(
        new TodoEntity(
          object.id,
          object.title,
          object.checked,
          object.createdAt
        )
      );
    });
    return todos;
  }

  /**
   * 全データのIDの最大値を返す.
   */
  private async maxId(): Promise<number> {
    return new Promise((resolve, reject) => {
      todoDb
        .find({})
        .sort({
          id: -1
        })
        .exec(function(err: any, docs: any) {
          if (err || !docs || docs.length === 0 || !docs[0]) {
            resolve(1);
            return;
          }
          resolve(docs[0].id + 1);
        });
    });
  }

  /**
   * 検索情報をDBで使えるクエリに変換する
   * TODO 扱うデータに合わせる
   * @param searchInfo 検索情報
   */
  private toQuery(searchInfo: SearchInfo): { [key: string]: any } {
    let result = {};
    if (searchInfo.keyword !== null && searchInfo.keyword !== "") {
      result["title"] = new RegExp(searchInfo.keyword);
    }
    if (searchInfo.checked !== null) {
      result["checked"] = searchInfo.checked;
    }
    let createdAtQuery = {};
    if (searchInfo.startDate !== null) {
      createdAtQuery["$gte"] = searchInfo.startDate.getTime();
    }
    if (searchInfo.endDate !== null) {
      createdAtQuery["$lte"] = searchInfo.endDate.getTime();
    }
    if (Object.keys(createdAtQuery).length !== 0) {
      result["createdAt"] = createdAtQuery;
    }
    return result;
  }
}
