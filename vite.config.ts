import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import {mars3dPlugin} from 'vite-plugin-mars3d'

// https://vitejs.dev/config/
export default ({mode}: { mode: string }) => defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        mars3dPlugin()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
                entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
                assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等

                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // 让每个插件都打包成独立的文件
                        return id.toString().split('node_modules/')[2].split('/')[0].toString();
                    }
                }
            },

            plugins: [
                viteCompression({
                    verbose: true, // 是否在控制台中输出压缩结果
                    disable: false,
                    threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
                    algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
                    ext: '.gz',
                    deleteOriginFile: false // 源文件压缩后是否删除(我为了看压缩后的效果，先选择了true)
                })
            ]
        }
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/gisbim-api': {
                target: loadEnv(mode, process.cwd()).VITE_BASEURL,
                changeOrigin: false,
                rewrite: (path) => path.replace(/^\/gisbim-api/, '')
            }
        }
    }
})
