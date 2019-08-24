import AppSettingData from "../entity/AppSettingData";

const KEY_ONE_PAGE_DATA_NUM: string = "app_setting_data/one_page_data_num"
export default class AppSettingRepository {
    setAppSetting(appSettingData: AppSettingData) {
        localStorage.setItem(KEY_ONE_PAGE_DATA_NUM, appSettingData.onePageDataNum.toString())
    }

    getAppSetting(): AppSettingData {
        try {
            let onePageDataNumStr = localStorage.getItem(KEY_ONE_PAGE_DATA_NUM)
            if (onePageDataNumStr === null || onePageDataNumStr === undefined) {
                let appSettingData = AppSettingData.default()
                this.setAppSetting(appSettingData)
                return appSettingData
            }
            return new AppSettingData(parseInt(onePageDataNumStr))
        } catch(e) {
            return AppSettingData.default()
        }
    }
}