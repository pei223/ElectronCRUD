import Stream from "./Stream";
import TodoRepository from "../repository/TodoRepository";
import TodoEntity from "../domain/TodoEntity";
import SearchInfo from "../domain/SearchInfo";
import BlocProvider from "./BlocProvider";
import PageInfo from "../domain/value_object/PageInfo";

/**
 * ビジネスロジッククラス.
 * TODO 扱うデータに合わせる. 型だけ差し替えるのみでいい.
 */
export default class TodoBloc {
  /**
   * データのリストを流すストリーム
   */
  todoStream: Stream<Array<TodoEntity>> = new Stream();
  /**
   * ページ情報を流すストリーム
   */
  pageInfoStream: Stream<PageInfo> = new Stream();

  /**
   * 保持しているページ情報
   */
  private pageInfo: PageInfo = null;
  /**
   * 保持している検索条件
   */
  private searchInfo: SearchInfo = SearchInfo.empty();

  /**
   * 最初の1ページ目をfetchする.
   */
  async fetchFirstPage() {
    await this.clearPageInfo();
    this.searchInfo = SearchInfo.empty();
    let data: Array<TodoEntity> = await new TodoRepository().read(
      this.pageInfo,
      this.searchInfo
    );
    if (data === null) {
      this.todoStream.error(0);
      return;
    }
    // this.todoStream.error(1);
    this.todoStream.stream(data);
    this.pageInfoStream.stream(this.pageInfo);
  }

  async fetchSelectedPage(pageNum: number) {
    // 通常ありえない
    if (this.pageInfo == null) {
      await this.clearPageInfo();
    }
    this.pageInfo.currentPageNum = pageNum;
    let data: Array<TodoEntity> = await new TodoRepository().read(
      this.pageInfo,
      this.searchInfo
    );
    if (data === null) {
      this.todoStream.error(0);
      return;
    }
    this.todoStream.stream(data);
    this.pageInfoStream.stream(this.pageInfo);
  }

  /**
   * 保持している検索条件、指定したページ数のデータリストをtodoStreamに流す.
   * @param pageNum ページ数. nullなら保持されているページ数になる.
   */
  async fetch() {
    // 通常ありえない
    if (this.pageInfo == null) {
      await this.clearPageInfo();
    }
    let data: Array<TodoEntity> = await new TodoRepository().read(
      this.pageInfo,
      this.searchInfo
    );
    if (data === null) {
      this.todoStream.error(0);
      return;
    }
    this.todoStream.stream(data);
    this.pageInfoStream.stream(this.pageInfo);
  }

  /**
   * 指定した検索条件のデータリストをtodoStreamに流す.
   * @param searchInfo 検索条件
   */
  async search(searchInfo: SearchInfo) {
    this.searchInfo = searchInfo;
    await this.clearPageInfo();
    let data: Array<TodoEntity> = await new TodoRepository().read(
      this.pageInfo,
      this.searchInfo
    );
    if (data === null) {
      this.todoStream.error(0);
      return;
    }
    this.todoStream.stream(data);
    this.pageInfoStream.stream(this.pageInfo);
  }

  /**
   * 指定したデータのIDを取得する. 取得後todoStreamにデータを流す.
   * @param id 取得したいデータのID
   */
  async find(id: number) {
    let data: Array<TodoEntity> = await new TodoRepository().find(id);
    if (data === null) {
      this.todoStream.error(0);
      return;
    }
    this.todoStream.stream(data);
  }

  /**
   * データ登録. 登録後todoStateStreamに追加したデータを流す.
   * @param newTodo 登録するデータ
   */
  async add(newTodo: TodoEntity): Promise<boolean> {
    return await new TodoRepository().create(newTodo);
  }

  /**
   * データ削除. 削除後todoStateStreamに削除したデータ(IDのみ)を流す.
   * @param id 削除したいデータのID
   */
  async delete(id: number) {
    return await new TodoRepository().delete(id);
  }

  /**
   * データを更新する. 更新後todoStateStreamに更新したデータを流す.
   * @param newTodo 更新するデータ
   */
  async update(newTodo: TodoEntity): Promise<boolean> {
    return await new TodoRepository().update(newTodo);
  }

  /**
   * 後処理
   */
  dispose() {
    this.todoStream.deleteAll();
    this.pageInfoStream.deleteAll();
  }

  /**
   * 全体のページ数を非同期で取得する.
   */
  private async getPageCount(): Promise<number> {
    let count: number = await new TodoRepository().count(this.searchInfo);
    return Math.ceil(count / this.getOnePageDataNum());
  }

  private getOnePageDataNum(): number {
    return BlocProvider.getInstance().settingBloc.getAppData().onePageDataNum;
  }

  private async clearPageInfo() {
    let pageCount = await this.getPageCount();
    let onePageDataNum = BlocProvider.getInstance().settingBloc.getAppData()
      .onePageDataNum;
    this.pageInfo = PageInfo.firstPage(pageCount, onePageDataNum);
  }
}
