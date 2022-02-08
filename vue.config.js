
const CompressionWebpackPlugin = require('compression-webpack-plugin');
var webpack = require('webpack')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = {
	devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
      
    },
	lintOnSave: false,
	chainWebpack: config => {
		// 移除 prefetch 插件
		config.plugins.delete('prefetch')
		config.plugins.delete('preload')

	},
	productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
	configureWebpack: {
		devtool: "cheap-module-source-map",
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',         // 创建 '$'、'jQuery'、'window.jQuery' 三个变量指向依赖jquery
				jQuery: 'jquery',
				'window.jQuery': 'jquery'
			}),
			new CompressionWebpackPlugin({
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				test: /\.(js|css)(\?.*)?$/i, 
				threshold: 1024, // 只有大小大于该值的资源会被处理 10240
				deleteOriginalAssets: false // 删除原文件true=删
			  }),
			AutoImport({
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()]
			}),
		],

	}

}
// module.exports = {
//     //webpack配置
// 	productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
// 	configureWebpack: {
// 		'externals': {
// 			vue: 'Vue',
// 			'vue-router': 'VueRouter',
// 			'element-plus': 'ElementPlus'
// 		 },
// 	    //关闭 webpack 的性能提示
// 	    performance: {
// 		    hints:false
// 	    },
// 		plugins: [
// 			new webpack.ProvidePlugin({
// 			  $: 'jquery',         // 创建 '$'、'jQuery'、'window.jQuery' 三个变量指向依赖jquery
// 			  jQuery: 'jquery',
// 			  'window.jQuery': 'jquery'
// 			}),
// 			new webpack.optimize.LimitChunkCountPlugin({
//                 maxChunks: 5,
//                 minChunkSize: 100
//             })
// 		],
// 	    performance: {
// 	    	hints:'warning',
// 	    	//入口起点的最大体积
// 	    	maxEntrypointSize: 800,
// 	    	//生成文件的最大体积
// 	    	maxAssetSize: 800,
// 	    	//只给出 js 文件的性能提示
// 	    	assetFilter: function(assetFilename) {
// 	    		return assetFilename.endsWith('.js');
// 	    	}
// 	    }
//     }
// }