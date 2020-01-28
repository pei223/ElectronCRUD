const ONE_PAGE_DATA_NUM_MAX = 30;
/**
 * アプリ全域の設定データのクラス.
 */
export default class AppSettingData {
  readonly onePageDataNum: number;

  constructor(onePageDataNum: number) {
    if (!AppSettingData.isValidOnePageDataNum(onePageDataNum)) {
      throw new RangeError();
    }
    this.onePageDataNum = onePageDataNum;
  }

  /**
   * 1ページの表示データ数の入力値チェック.
   * エラーがあればエラーメッセージ, なければnullを返す.
   */
  static validationMessageOfOnePageDataNum(onePageDataNum: number) {
    if (!AppSettingData.isValidOnePageDataNum(onePageDataNum)) {
      return (
        "1〜" + ONE_PAGE_DATA_NUM_MAX.toString() + "の値を入力してください."
      );
    }
    return null;
  }

  private static isValidOnePageDataNum(onePageDataNum: number): boolean {
    return !(
      !Number.isInteger(onePageDataNum) ||
      onePageDataNum > ONE_PAGE_DATA_NUM_MAX ||
      onePageDataNum < 1
    );
  }

  static default(): AppSettingData {
    return new AppSettingData(2);
  }

  equals(appSettingData: AppSettingData): boolean {
    return this.onePageDataNum === appSettingData.onePageDataNum;
  }
}
