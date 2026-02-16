import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

import App from './App.vue'
import router from '@/router'
import { i18n } from '@/components/Locale'
import Icon from '@/components/Icons/Icon.vue'
import Msg from '@/components/Msg'
import { commands } from '@/components/CommandManager/instance'
import TrayWorker from '@/workers/tray.worker?worker'

import '@/components/Theme/tailwind-output.css'
import '@/components/Theme/Index.scss'

const updateTray = async (payload) => {
  const { tray } = payload
  if (!tray) {
    return
  }

  const ab = await tray.arrayBuffer()
  window.electron.ipcRenderer.send('command', 'application:update-tray', ab)
}

function initTrayWorker() {
  const worker = new TrayWorker()

  worker.addEventListener('message', (event) => {
    const { type, payload } = event.data

    switch (type) {
    case 'initialized':
    case 'log':
      console.log('[imFile] Log from Tray Worker: ', payload)
      break
    case 'tray:drawed':
      updateTray(payload)
      break
    default:
      console.warn('[imFile] Tray Worker unhandled message type:', type, payload)
    }
  })

  return worker
}

function init(config) {
  const app = createApp(App)
  const pinia = createPinia()

  app.config.globalProperties.$http = axios

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.use(ElementPlus, { size: 'mini' })
  app.use(Msg)
  app.component('mo-icon', Icon)

  app.mount('#app')

  window.app = app
  window.app.commands = commands
  require('./commands')

  window.app.trayWorker = initTrayWorker()
}

import { usePreferenceStore } from '@/store/modules/preference'

const preferenceStore = usePreferenceStore()
preferenceStore.fetchPreference()
  .then((config) => {
    console.info('[imFile] load preference:', config)
    init(config)
  })
  .catch((err) => {
    alert(err)
  })
