import Vue from 'vue'
import Vuex from 'vuex'
// import user from './modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        forcedLogin: false,//是否强制登陆
        hasLogin: false,
        userName: 'xiaomei',
        userId: '111',
        token: '',
        permissionLevel: '2',
        password: '123456',
    },
    mutations: {
        login(state, user) {
            state.hasLogin = true
            state.userName = user.userName || '';
            state.userId = user.userId || '';
            state.token = user.token || '';
            state.permissionLevel = user.permissionLevel || '';
        },
        logout(state) {
            state.hasLogin = false;
            state.userName = "";
            state.userId = '';
            state.token = '';
            state.permissionLevel = '';
            uni.removeStorage({
                key: 'token'
            })
        }
    },
    actions: {},
    // getters: {
    //     userId(state, getters) {
    //         return state.userId
    //     },
    //     userName(state, getters) {
    //         return state.userName
    //     },
    // }
})
export default store