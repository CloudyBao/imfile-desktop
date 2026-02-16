import { createI18n } from 'vue-i18n'
import resources from '@shared/locales/all'

export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: resources
})

export function getLocaleManager() {
  return {
    changeLanguage: (lng) => {
      i18n.global.locale.value = lng
    },
    changeLanguageByLocale: (locale) => {
      const langMap = {
        'zh-CN': 'zh-CN',
        'zh-TW': 'zh-TW',
        'en-US': 'en-US'
      }
      const lng = langMap[locale] || 'en-US'
      i18n.global.locale.value = lng
    },
    getI18n: () => i18n
  }
}
