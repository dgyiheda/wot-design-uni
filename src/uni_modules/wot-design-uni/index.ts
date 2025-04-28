import type { App } from 'vue'
import * as components from './components'

export const install = function (app: App) {
  Object.keys(components).forEach((key) => {
    const component = components[key as keyof typeof components]
    if (component.install) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      app.use(component)
    }
  })

  return app
}

export * from './components'

export { useToast } from './components/wd-toast'
export { useMessage } from './components/wd-message-box'
export { useQueue } from './components/composables/useQueue'
export { useUpload } from './components/composables/useUpload'
export { useTouch } from './components/composables/useTouch'
export * from './components/wd-notify'

export { dayjs } from './components/common/dayjs'

export * as CommonUtil from './components/common/util'
export * as clickOut from './components/common/clickoutside'

export * from './locale'
export type { ConfigProviderThemeVars } from './components/wd-config-provider/types'

export default {
  install
}
