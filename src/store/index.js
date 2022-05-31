import Vue from 'vue'
import Vuex from 'vuex'
// import user from './modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        firstLogin: true,//第一次登录
        forcedLogin: true,//是否强制登陆
        hasLogin: false,
        userName: 'xiaomei',
        userId: '111',
        token: '',
        permissionLevel: '2',
        password: '123456',
        frontUrl:'http://192.168.137.1:8080',
		classificationUrl: 'http://192.168.137.1:5000',
		detectionUrl: 'http://192.168.137.1:5000',
		mySocket: {
		    socketTask: null,
		    socketOpen: false,
		    socketMsgQueue: [],
		    timeoutObj: null,
		    timeout: 10000,
		    socketUrl: 'ws://192.168.137.1:8001/news',
		},
		news: [],
		chatFrames: [],
		currentChatFrame: {},
		friends: [],
		verifications: [],
		agentVerifications: [],
		avatar: '',
		nickname: ''
    },
    mutations: {
        login(state, user) {
            state.hasLogin = true;
            state.userName = user.userName || '';
            state.userId = user.userId || '';
            state.token = user.token || '';
            state.avatar = user.avatar;
            state.nickname = user.nickname;
            state.permissionLevel = user.permissionLevel || '';
        },
        logout(state) {
            state.hasLogin = false;
            state.userName = "";
            state.userId = '';
            state.token = '';
            state.permissionLevel = '';
            state.firstLogin = false;
            uni.removeStorage({
                key: 'token'
            })
        },
        setChatFrames(state, chatFrames) {
            state.chatFrames = chatFrames;
        },
        setNews(state, news) {
            state.news = news;
        },
        setCurrentChatFrame(state, currentChatFrame) {
            state.currentChatFrame = currentChatFrame;
        },
        setFriends(state, friends) {
            state.friends = friends;
        },
        setVerifications(state, verifications) {
            state.verifications = verifications;
        },
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