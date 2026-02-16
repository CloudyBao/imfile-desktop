import { defineStore } from 'pinia'
import api from '@/api'
import { getLangDirection } from '@shared/utils'

export const usePreferenceStore = defineStore('preference', {
  state: () => ({
    engineMode: 'MAX',
    config: {}
  }),
  
  getters: {
    theme: (state) => state.config.theme,
    locale: (state) => state.config.locale,
    direction: (state) => getLangDirection(state.config.locale)
  },
  
  actions: {
    async fetchPreference() {
      const config = await api.fetchPreference()
      this.updatePreference(config)
      return config
    },
    
    updatePreference(config) {
      this.config = { ...this.config, ...config }
    },
    
    async save(config) {
      this.updatePreference(config)
      return api.savePreference(config)
    }
  }
})
