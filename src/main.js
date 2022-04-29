import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
//加入Vuex
import store from "./store";
//定义为全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(ElementUI)

const app = new Vue({
    ...App,
    //挂载Vuex
    store

})
app.$mount()
