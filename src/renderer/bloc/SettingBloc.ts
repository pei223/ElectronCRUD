import AppSettingData from "../entity/AppSettingData";
import AppSettingRepository from "../repository/AppSettinRepository";


/**
 * ビジネスロジッククラス.
 * TODO 扱うデータに合わせる. 型だけ差し替えるのみでいい. 
 */
export default class SettingBloc {
    constructor() {
    }

    getAppData(): AppSettingData {
        return new AppSettingRepository().getAppSetting()
    }

    setAppData(appSettingData: AppSettingData): boolean {
        new AppSettingRepository().setAppSetting(appSettingData)
        return true
    }

    /**
     * 後処理
     */
    dispose() {
    }
}