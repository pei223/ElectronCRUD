import AppSettingData from "../domain/AppSettingData";
import AppSettingRepository from "../repository/AppSettinRepository";

/**
 * アプリ設定のビジネスロジッククラス.
 */
export default class SettingBloc {
  constructor() {}

  getAppData(): AppSettingData {
    return new AppSettingRepository().getAppSetting();
  }

  setAppData(appSettingData: AppSettingData): boolean {
    new AppSettingRepository().setAppSetting(appSettingData);
    return true;
  }

  /**
   * 後処理
   */
  dispose() {}
}
