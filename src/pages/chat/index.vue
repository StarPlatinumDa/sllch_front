<template>
	<view class="myFont" v-if="userId != -1" :style="{ 'padding-top': statusBarHeight + 'px' }">
        <view class="text-center" style="position: relative">
            <text>消息</text>
			<uni-icons class="linkman" type="contact" size="30" @touchend.native.prevent="enterLinkman"></uni-icons>
        </view>
        
        <view v-for="(item, index) in chatFrames" :key="item.chatId">
            <view :class="{chatFrame: true, touchColor: item.isActive}"
            @touchstart="touchChatFrame(true, index)"
            @touchend="touchChatFrame(false, index)"
            @click="enterChatFrame(item.chatId, item.chatType)">
                <view class="image">
                    <image v-if="item.chatType == 0" mode="aspectFill" :src="frontUrl+item.chatObjectPhoto"></image>
					<image v-else mode="aspectFill" :src="item.groupPhoto"></image>
                </view>
                <view class="content">
                    <view>
                        <text v-if="item.chatType == 0" v-text="item.nickname"></text>
						<text v-else v-text="item.groupName"></text>
                        <text class="chatLastTime" v-text="item.lastNews.newsTime"></text>
                    </view>
                    <view class="message">
                        <text v-if="item.lastNews.newsType=='voice'" v-text="'[语音]'"></text>
						<text v-else-if="item.lastNews.newsType=='img'" v-text="'[图片]'"></text>
						<text v-else v-text="item.lastNews.newsContent"></text>
                    </view>
                </view>
            </view>
        </view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    components: { },
    data () {
        return {
            statusBarHeight: getApp().globalData.statusBarHeight
        }
    },
    onLoad () {
        this.getAllNews()
        this.getFrames(this.userId)
        this.openConnection()
        this.start()
    },
    methods: {
        ...mapMutations(['setChatFrames', 'setNews', 'setCurrentChatFrame']),
        sendMessage(msg, callback) {
            if (!msg.isFirst) {
                msg.isFirst = 0
            }
            msg.id = this.userId
            if (this.mySocket.socketOpen) {
                this.mySocket.socketTask.send({
                    data: JSON.stringify(msg),
                    success: () => {
                        if (callback) callback()
                    }
                })
            }
        },
        openConnection() {
            this.mySocket.socketTask = uni.connectSocket({
                url: this.mySocket.socketUrl,
                success: ()=> {},
                fail: (err) => {console.log(err)}
            })

            this.mySocket.socketTask.onMessage(res => {
                let data = JSON.parse(res.data)
				if (data.type == 'news' || data.type == 'media') {
					let news = {
					    msg: data.msg,
					    fromId: data.fromId,
					    toId: data.toId,
					    time: new Date(data.time + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
					    userId: this.userId,
					    newsType: data.newsType,
						playTime: data.playTime,
						source: data.source
					}
					if (news.source == 0) {
						let flag = false
						for (let i=0; i<this.chatFrames.length; i++) {
							if (this.chatFrames[i].chatId == data.toId && this.chatFrames[i].chatType == news.source) {
								let content = data.msg
								this.chatFrames[i].lastNews = {
									newsTime: this.formatDate(data.time),
									newsContent: content,
									newsType: data.newsType,
									source: data.source
								}
								flag = true
								break
							}
						}
						if (!flag) {
							uni.request({
							    url: this.frontUrl + '/chat/addChatFrame',
							    method: 'POST',
							    header: {
									'Authorization': this.token,
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							    },
							    data: {
									userId: this.userId,
									chatId: news.fromId,
									chatType: news.source
							    },
							    success: (res) => {
									if (res.data.code == 200) {
										this.getFrames(this.userId)
									}
							    }
							})
						}
					} else {
						let flag = false
						for (let i=0; i<this.chatFrames.length; i++) {
							if (this.chatFrames[i].chatId == data.toId && this.chatFrames[i].chatType == news.source) {
								let content = data.msg
								this.chatFrames[i].lastNews = {
									newsTime: this.formatDate(data.time),
									newsContent: content,
									newsType: data.newsType,
									source: data.source
								}
								flag = true
								break
							}
						}
						if (!flag) {
							uni.request({
							    url: this.frontUrl + '/chat/addChatFrame',
							    method: 'POST',
							    header: {
									'Authorization': this.token,
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							    },
							    data: {
									userId: this.userId,
									chatId: news.toId,
									chatType: news.source
								},
							    success: (res) => {
									if (res.data.code == 200) {
										this.getFrames(this.userId)
									}
							    }
							})
						}
						
					}
					this.news.push(news)
				} else if (data.type == 'agentVerification') {
					if (data.option == 'add') {
						this.agentVerifications.push(data)
					} else {
						for (let i=0; i<this.agentVerifications.length; i++) {
							if (this.agentVerifications[i].fromId == data.fromId && this.agentVerifications[i].toId == data.toId) {
								this.agentVerifications[i].verificationStatus = data.verificationStatus
								break
							}
						}
					}
				} else {
					if (data.type == 'add') {
						this.verifications.push(data)
					} else {
						for (let i=0; i<this.verifications.length; i++) {
							if (this.verifications[i].fromId == data.fromId && this.verifications[i].toId == data.toId) {
								this.verifications[i].verificationStatus = data.verificationStatus
								break
							}
						}
					}
				}
            })

            this.mySocket.socketTask.onClose(res => {
                console.log('WebSocket 已关闭！')
                this.mySocket.socketOpen = false
            })

            this.mySocket.socketTask.onOpen(res => {
                console.log('open...')
                this.mySocket.socketOpen = true
                this.sendMessage({
                    msg: '',
                    isFirst: 1,
					type: 'first'
                }, () => {
                    // for (var i = 0; i < this.mySocket.socketMsgQueue.length; i++) {
                    //     this.sendMessage({msg: this.mySocket.socketMsgQueue[i]})
                    // }
                    // this.mySocket.socketMsgQueue = []
                })

            })
        },
        start() {
			this.mySocket.timeoutObj = setInterval(() => {
				this.mySocket.socketTask.send({
                    data: JSON.stringify({
                        msg: 'ping',
						type: 'heartbeat'
                    }),
                    success: res => {
						// console.log('连接中....')
					},
					fail: err => {
						// console.log('连接失败重新连接....')
						this.openConnection()
					}
                })
			}, this.mySocket.timeout)
        },
        getFrames(id) {
			uni.request({
			    url: this.frontUrl + '/chat/getChatFrames',
			    method: 'POST',
			    header: {
			        'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			    },
			    data: {
					userId: this.userId
				},
			    success: (res) => {
					if (res.data.code == 200) {
						 res.data = res.data.data
					    let chatFrames = []
					    chatFrames = res.data.chatFrames
					    chatFrames.forEach(item => {
					        item.isActive = false
					        item.lastNews = JSON.parse(item.lastNews)
							if (item.groupId) {
								item.chatId = item.groupId
							}
					        if (!item.lastNews) {
					            item.lastNews = {}
					            item.lastNews.newsTime = ''
					            item.lastNews.newsContent = ''
								item.lastNews.source = ''
					        } else {
					            let time = new Date(item.lastNews.newsTime + 8*3600*1000)
					            if (new Date(item.lastNews.newsTime).getDate() == new Date().getDate()) {
					                item.lastNews.newsTime = time.toJSON().substr(11, 5)
					            } else {
					                item.lastNews.newsTime = time.toJSON().substr(0, 10)
					            }
					        }
					        
					    })
					    this.setChatFrames(chatFrames)
					}
			    }
			})
        },
        touchChatFrame(isActive, index) {
            this.chatFrames[index].isActive = isActive
        },
        enterChatFrame(chatId, chatType) {
            let chatFrame = {}
            for (let i=0; i<this.chatFrames.length; i++) {
				if (chatType == 0) {
					if (this.chatFrames[i].chatId == chatId) {
					    chatFrame = this.chatFrames[i]
					    break
					}
				} else {
					if (this.chatFrames[i].groupId == chatId) {
					    chatFrame = this.chatFrames[i]
					    break
					}
				}
            }
            this.setCurrentChatFrame(chatFrame)
            uni.navigateTo({
                url: '/pages/chat/chatFrame'
            })

        },
        enterLinkman() {
            uni.navigateTo({
                url: '/pages/chat/linkman'
            })
        },
        formatDate(newsTime) {
            let time = new Date(newsTime + 8*3600*1000)
            if (new Date(newsTime).getDate() == new Date().getDate()) {
                newsTime = time.toJSON().substr(11, 5)
            } else {
                newsTime = time.toJSON().substr(0, 10)
            }
            return newsTime
        },
        getAllNews() {
			uni.request({
			    url: this.frontUrl + '/chat/getAllNewsByUserId',
			    method: 'POST',
			    header: {
			        'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			    },
			    data: {
					userId: this.userId
			    },
			    success: (res) => {
					if (res.data.code == 200) {
						res.data = res.data.data
						let news = []
						res.data.news.map(item => {
						    let message = {
						        userId: item.newsId,
						        msg: item.newsContent,
						        fromId: item.newsSenderid,
						        toId: item.newsRecipienterid,
						        time: new Date(item.newsTime +  + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
						        newsType: item.newsType,
						        playTime: item.playTime,
								source: item.source
						    }
						    news.push(message)
						})
						this.setNews(news)
					}
			    }
			})
        }
    },
    computed: {
        ...mapState(['mySocket', 'news', 'chatFrames', 'currentChatFrame', 'verifications', 'token', 'frontUrl', 'userId'])
    },
    catch: {
        news: {
            handler: newVal => {
                
            },
            immediate: true
        },
        chatFrames: {
            handler: newVal => {},
            immediate: true
        }
    }
}
</script>

<style>
.text-center {
    text-align: center;
    padding: 3%;
    vertical-align: middle;
    font-weight: 700;
    border-bottom: 1px solid rgb(240, 239, 239);
}

.myFont {
    font-size: 18px;
}

.linkman {
    width: 26px;
    height: 26px;
    position: absolute;
    right: 10px;
}

.chatFrame {
    border-bottom: 1px solid rgb(240, 239, 239);
    overflow: hidden;
    /* width: 100%; */
    padding: 5px;
    height: 60px;
}

.chatFrame .image image {
    border-radius: 50%;
    height: 60px;
    width: 60px;
}

.chatFrame .image {
    float: left;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chatFrame .content {
    float: left;
    height: 100%;
}

.chatFrame .content .message {
    font-size: 15px;
    color: grey;
    margin-top: 8px;
}

.chatFrame .content .chatLastTime {
    position: absolute;
    right: 0;
    margin-right: 10px;
    color: grey;
    font-size: 14px;
}

.touchColor {
    background: rgb(211, 219, 226);
}

</style>
