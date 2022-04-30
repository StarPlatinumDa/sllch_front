import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        forcedLogin: false,//是否强制登陆
        hasLogin: false,
        userName: 'xiaomei',
        userId: '111',
        token: '',
        password: '123456',
    },
    mutations: {
        login(state, user) {
            state.userName = user.userName || '';
            state.userId = user.userId || '';
            state.token = user.token || '';
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
            state.userId = '';
            state.token = '';
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