import { createApp } from 'vue'
import App from './App.vue'
// import installElementPlus from './plugins/element'el-
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/base.css';
import 'element-plus/lib/theme-chalk/el-notification.css';
import 'element-plus/lib/theme-chalk/el-loading.css';
import 'element-plus/lib/theme-chalk/el-message.css';
import router from './router'
import "./styles/index.scss"
const $ = require('jquery');
window.$ = $;
const app = createApp(App).use(router).use(router)
// installElementPlus(app,{
//     locale: zhCn,
//   })
 app.mount('#app')
router.beforeEach((to, from, next)=>{
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})