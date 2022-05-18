import Vue from 'vue'
import Vuex from 'vuex'
// import user from './modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        forcedLogin: true,//是否强制登陆
        hasLogin: false,
        userName: 'xiaomei',
        userId: '111',
        token: '',
        permissionLevel: '2',
        password: '123456',
        frontUrl:'http://localhost:8080',
		classificationUrl: 'http://127.0.0.1:5000',
		detectionUrl: 'http://127.0.0.1:5000',
		mySocket: {
		    socketTask: null,
		    socketOpen: false,
		    socketMsgQueue: [],
		    timeoutObj: null,
		    timeout: 10000,
		    socketUrl: 'ws://localhost:8001/news',
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
		setNews(state, news) {
			state.news = news;
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