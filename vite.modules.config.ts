import path, { resolve } from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { BuildOptions, defineConfig } from 'vite'
// import viteCompression from 'vite-plugin-compression'
import fastGlob from 'fast-glob'

//  插件目录
const PATH = path.join(__dirname)

// components 目录
const COMPONENTS_PATH = path.join(PATH, 'src/uni_modules/wot-design-uni/components')

// dist模块打包目录
const OUTPUT_DIR_PATH = path.join(PATH, 'dist')

const getBuildConfig = async (): Promise<BuildOptions> => {
  const external = ['vue']

  return {
    target: 'modules',
    // 打包文件目录
    outDir: OUTPUT_DIR_PATH,
    // 压缩
    minify: true,
    lib: {
      entry: resolve(__dirname, './src/uni_modules/wot-design-uni/index.ts'), //指定组件编译入口文件
      name: 'wot-design-uni', //指定组件库名称
      formats: ['es', 'umd'], //指定组件库格式
      fileName: 'index'
    },
    rollupOptions: {
      external
    }
  }
}

export default defineConfig(async ({ command }) => {
  const isBuild = command === 'build'

  let buildConfig: BuildOptions | undefined

  if (isBuild) {
    // 打包时配置
    buildConfig = await getBuildConfig()
  }

  return {
    plugins: [
      Components(),
      uni(),
      {
        name: 'style',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        generateBundle(_config, bundle) {
          // 这里可以获取打包后的文件目录以及代码code
          const keys = Object.keys(bundle)

          for (const key of keys) {
            const bundler: any = bundle[key as any]
            // 将 主入口的 style 输出文件code中的.scss换成移除引用 xxx/style/index
            if (/style\.(js|jsx|ts|tsx)$/.test(key)) {
              this.emitFile({
                type: 'asset',
                fileName: key, // 文件名名不变
                source: bundler.code.replace(/\.scss/g, '')
              })
            }

            const moduleStylePattern = /.*\/style\/index\.(js|jsx|ts|tsx)$/
            if (moduleStylePattern.test(key)) {
              // 复制多一份css的js文件，替换为引用路径 scss结尾的修改成css
              this.emitFile({
                type: 'asset',
                fileName: key.replace(/index/g, 'css'), // 文件名为css
                source: bundler.code.replace(/\.scss/g, '.css')
              })
            }
          }
        }
      }
    ],
    build: buildConfig
  }
})
