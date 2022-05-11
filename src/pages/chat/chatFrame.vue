<template>
    <view style="background-color:rgb(234,237,244);width:100%; font-size:18px; min-height:100%;" class="overflow-hidden stick" :style="{ 'margin-top': statusBarHeight + 'px' }">
        <scroll-view class="body" id="body">
            <view v-for="(item, index) in myNews" :key="index">
                <view class="message overflow-hidden" v-if="userId == item.fromId">
                    <image v-if="currentChatFrame.chatType == 0" :src="frontUrl+currentChatFrame.userPhoto" mode="aspectFill" class="float-right headPhoto"></image>
					<image v-else :src="frontUrl+item.headPhoto" mode="aspectFill" class="float-right headPhoto"></image>
					<view class="float-right" style="position: relative;">
						<view class="nickname" style="text-align: right;" v-if="currentChatFrame.chatType == 1"><text v-text="item.nickname"></text></view>
						<view class="float-right text" v-if="item.newsType == 'text'">
							<text v-text="item.msg" style="word-break:break-all;"></text>
						</view>
						<view class="float-right text" v-else-if="item.newsType == 'voice'">
							<image src="/static/icon/voiceNews.png" mode="aspectFill" class="float-right voiceNews ml" @tap="playVoice(item.msg)"></image>
							<text v-text="item.playTime"></text>
						</view>
						<view class="float-right imgContainer overflow-hidden" v-else-if="item.newsType == 'img'">
							<image :src="item.msg" mode="widthFix" @touchend="previewImage(item.msg)" class="newsImg"></image>
						</view>
					</view>
                    
                </view>
                <view v-else class="message overflow-hidden">
                    <image v-if="currentChatFrame.chatType == 0" :src="frontUrl+currentChatFrame.chatObjectPhoto" mode="aspectFill" class="float-left headPhoto"></image>
					<image v-else :src="frontUrl+item.headPhoto" mode="aspectFill" class="float-left headPhoto"></image>
					<view class="float-left" style="position: relative;">
						<view class="nickname" style="text-align: left;"><text v-text="item.nickname" v-if="currentChatFrame.chatType == 1"></text></view>
						<view class="float-left text" v-if="item.newsType == 'text'">
							<text v-text="item.msg" style="word-break:break-all;"></text>
						</view>
						<view class="float-left text" v-else-if="item.newsType == 'voice'">
							<image src="/static/icon/voiceNews.png" mode="aspectFill" class="float-left voiceNews mr" @tap="playVoice(item.msg)"></image>
							<text v-text="item.playTime"></text>
						</view>
						<view class="float-left imgContainer overflow-hidden" v-else-if="item.newsType == 'img'">
							<image :src="item.msg" mode="widthFix" @touchend="previewImage(item.msg)" class="newsImg"></image>
						</view>
					</view>
                </view>
            </view>
        </scroll-view>

        <view class="tabBar">
			<view :style="{ 'height': statusBarHeight + 'px', 'width': '100%' }"></view>
			<view style="position: relative;">
				<image class="arrowleft" mode="heightFix" src="/static/icon/arrowleft.png" @touchend="back"></image>
				<text v-text="title"></text>
				<image class="option" mode="heightFix" src="/static/icon/option.png" @touchend="enterManage"></image>
			</view>
        </view>

        <view style="position: fixed;bottom: 0; width: 100%;">
            <view class="sendFrame">
                <image class="voice" mode="heightFix" src="/static/icon/voice.png" @tap="voiceShow=!voiceShow"></image>
                <view class="inputFrame">
                    <textarea v-model="text" auto-height cursorSpacing="20" v-show="!voiceShow"/>
                    <view v-show="voiceShow" style="text-align:center;" @touchstart="startRecord" @touchend="endRecord">
                        <text v-show="!speak">按住说话</text>
                        <text v-show="speak">松开发送</text>
                    </view>
                </view>
                <button class="sendBtn" @touchend.prevent="sendToOther">发送</button>
                <image class="voice" mode="heightFix" src="/static/icon/other.png" @tap="showOther"></image>
            </view>
           <view class="func" v-show="otherShow" id="func">
				<view class="float-left item">
					<image class="img" mode="aspectFit" src="/static/icon/photoAlbum.png" @tap="selectImg"></image>
				</view>
				<view class="float-left item">
					<image class="img" mode="aspectFit" src="/static/icon/voiceCall.png"></image>
				</view>
				<view class="float-left item">
					<image class="img" mode="aspectFit" src="/static/icon/videoCall.png"></image>
				</view>
            </view>
        </view>

        <view style="height:60px;width:100%;"></view>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    components: {

    },
    data () {
        return {
            text: '',
            isChatFrame: false,
            recorderManager: null,
            innerAudioContext: null,
            voicePath: null,
            voiceShow: false,
            otherShow: false,
            speak: false,
			title: '',
			statusBarHeight: getApp().globalData.statusBarHeight
        }
    },
    onLoad () {
		if (this.currentChatFrame.chatType == 0) {
			this.title = this.currentChatFrame.nickname
		} else {
			this.title = this.currentChatFrame.groupName
			this.currentChatFrame.chatId = this.currentChatFrame.groupId
		}
        for (let i=0; i<this.chatFrames.length; i++) {
            if (this.chatFrames[i].chatId == this.currentChatFrame.chatId) {
                this.isChatFrame = true
                break
            }
        }
        this.recorderManager = uni.getRecorderManager()
        this.innerAudioContext = uni.createInnerAudioContext()
        this.recorderManager.onStop(res => {
            this.voicePath = res.tempFilePath
            uni.uploadFile({
                url: this.frontUrl + '/common/uploadNewsFile',
                filePath: this.voicePath,
                name: 'file',
				header: {
					'Authorization': this.token
				},
                formData: {
                    'fromId': this.userId,
                    'toId': this.currentChatFrame.chatId,
					'type': 0
                },
                success: (uploadFileRes) => {
					let r = JSON.parse(uploadFileRes.data)
					this.sendMedia('voice', r.data.filePath)
                },
                fail: e => {
                    console.log(e)
                }
            })
        })
    },
    methods: {
        ...mapMutations(['setNews', 'setChatFrames']),
		previewImage(src) {
			let array = []
			array.push(src)
			uni.previewImage({
			  urls: array,
			  current: array[0]
			})
		},
        sendMessage(msg, callback) {
            if (!msg.isFirst) {
                msg.isFirst = 0
            }
            if (this.mySocket.socketOpen) {
                this.mySocket.socketTask.send({
                    data: JSON.stringify(msg),
                    success: () => {
                        
                    },
                    fail: () => {
                        // this.mySocket.socketMsgQueue.push(msg)
                    }
                })
            } else {
                // this.mySocket.socketMsgQueue.push(msg)
            }
            if (callback) callback()
        },
        sendToOther() {
            let text = this.text
            this.text = ''
            this.sendMessage({
                msg: text,
                newsType: 'text',
                type: 'news',
                chatId: this.currentChatFrame.chatId,
                id: this.userId,
				source: this.currentChatFrame.chatType
            }, () => {
                let news = {
                    msg: text,
                    fromId: this.userId,
                    toId: this.currentChatFrame.chatId,
                    userId: this.userId,
                    time: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
                    newsType: 'text',
					source: this.currentChatFrame.chatType
                }
                this.news.push(news)
                if (!this.isChatFrame) {
                    this.currentChatFrame.lastNews = {
                        newsContent: text,
                        newsTime: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(11, 5).replace('T', ' ')
                    }
					uni.request({
					    url: this.frontUrl + '/chat/addChatFrame',
					    method: 'POST',
					    header: {
							'Authorization': this.token,
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					    },
					    data: {
							chatId: this.currentChatFrame.chatId,
							userId: this.userId,
							chatType: this.currentChatFrame.chatType
						},
					    success: (res) => {
							if (res.data.code == 200) {
								this.chatFrames.push(this.currentChatFrame)
							}
					    }
					})
                } else {
                    for (let i=0; i<this.chatFrames.length; i++) {
                        if (this.chatFrames[i].userId == this.currentChatFrame.userId && this.chatFrames[i].chatId == this.currentChatFrame.chatId) {
                            this.chatFrames[i].lastNews = {
                                newsContent: text,
                                newsTime: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(11, 5).replace('T', ' ')
                            }
                            break
                        }
                    }
                }
            })
        },
        sendMedia(type, text) {
            if (type == 'voice') {
                let innerAudioContext = uni.createInnerAudioContext()
                innerAudioContext.src = this.voicePath
                innerAudioContext.onCanplay(() => {
                    let playTime = innerAudioContext.duration.toFixed(0)
                    let news = {
                        msg: text,
                        fromId: this.userId,
                        toId: this.currentChatFrame.chatId,
                        userId: this.userId,
                        time: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
                        newsType: type,
                        playTime: playTime,
                        type: 'media',
						source: this.currentChatFrame.chatType
                    }
                    this.sendMessage(news, () => {
                        let news = {
                            msg: this.voicePath,
                            fromId: this.userId,
                            toId: this.currentChatFrame.chatId,
                            userId: this.userId,
                            time: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
                            newsType: type,
                            playTime: playTime,
                            type: 'media',
							source: this.currentChatFrame.chatType
                        }
                        this.updateNews(news, type, text)
                    })
                })
                return
            }
            this.sendMessage({
                msg: text,
                fromId: this.userId,
                toId: this.currentChatFrame.chatId,
                userId: this.userId,
                time: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
                newsType: type,
                playTime: 0,
                type: 'media',
				source: this.currentChatFrame.chatType
            }, () => {
                let news = {
                    msg: text,
                    fromId: this.userId,
                    toId: this.currentChatFrame.chatId,
                    userId: this.userId,
                    time: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' '),
                    newsType: type,
                    playTime: 0,
                    type: 'media',
					source: this.currentChatFrame.chatType
                }
                this.updateNews(news, type, text)
            })
        },
        back () {
            uni.navigateBack({
                delta: 1
            })
        },
        enterManage () {
			let url = ''
			if (this.currentChatFrame.chatType == 0) url = `/pages/chat/manage`
			else url = `/pages/chat/groupManage`
            uni.navigateTo({
                url: url,
                success: res => {
                    
                }
            })
        },
        startRecord() {
            this.speak = true
            this.recorderManager.start();
        },
        endRecord() {
            this.speak = false
            this.recorderManager.stop()
        },
        playVoice(voicePath) {
            if (voicePath) {
                this.innerAudioContext.src = voicePath
                this.innerAudioContext.play()
            }
        },
        getVoiceFileName() {
            if (this.voicePath) {
                var splits = this.voicePath.split('/')
                return splits[splits.length-1]
            }
        },
        updateNews(news, type, text) {
            this.news.push(news)
            if (!this.isChatFrame) {
                this.currentChatFrame.lastNews = {
                    newsContent: text,
                    newsTime: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(11, 5).replace('T', ' '),
					newsType: news.newsType,
					source: this.currentChatFrame.chatType
                }
				uni.request({
				    url: this.frontUrl + '/chat/addChatFrame',
				    method: 'POST',
				    header: {
						'Authorization': this.token,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    },
				    data: {
						chatId: this.currentChatFrame.chatId,
						userId: this.userId,
						chatType: this.currentChatFrame.chatType
					},
				    success: (res) => {
						if (res.data.code == 200) {
							this.chatFrames.push(this.currentChatFrame)
						}
				    }
				})
            } else {
                for (let i=0; i<this.chatFrames.length; i++) {
                    if (this.chatFrames[i].userId == this.currentChatFrame.userId && this.chatFrames[i].chatId == this.currentChatFrame.chatId) {
                        this.chatFrames[i].lastNews = {
                            newsContent: text,
                            newsTime: new Date(new Date().getTime() + 8*3600*1000).toJSON().substr(11, 5).replace('T', ' '),
							newsType: news.newsType,
							source: this.currentChatFrame.chatType
                        }
                        break
                    }
                }
            }
        },
		selectImg() {
			uni.chooseImage({
			    sizeType: ['original', 'compressed'],
			    sourceType: ['album'],
			    success: res => {
			        res.tempFilePaths.forEach(path => {
						this.sendImg(path)
					})
			    }
			});
		},
		sendImg(filePath, callback) {
			uni.uploadFile({
				url: this.frontUrl + '/common/uploadNewsFile',
				filePath: filePath,
				name: 'file',
				header: {
					'Authorization': this.token
				},
				formData: {
					'fromId': this.userId,
					'toId': this.currentChatFrame.chatId,
					'type': 1
				},
				success: (uploadFileRes) => {
					let r = JSON.parse(uploadFileRes.data)
					this.sendMedia('img', r.data.filePath)
				},
				fail: e => {
					console.log(e)
				}
			})
		},
		showOther() {
			this.otherShow=!this.otherShow
		}
    },
    watch: {
        news: {
            handler: newVal => {},
            immediate: true
        }
    },
    computed: {
        ...mapState(['userId', 'mySocket', 'news', 'currentChatFrame', 'chatFrames', 'frontUrl', 'token']),
        myNews() {
			if (this.currentChatFrame.chatType == 0)
				return this.news.filter(item => (item.fromId == this.currentChatFrame.chatId || item.toId == this.currentChatFrame.chatId) && this.userId == item.userId && this.currentChatFrame.chatType == item.source)
			return this.news.filter(item => item.toId == this.currentChatFrame.groupId && this.userId == item.userId && this.currentChatFrame.chatType == item.source)
							.map(item => {
								this.currentChatFrame.groupMembers.forEach(member => {
									if (member.userId == item.fromId) {
										item.headPhoto = member.avatar
										item.nickname = member.userNickname
									}
								})
								return item
							})
		}
    }
}
</script>

<style scoped>

.sendFrame {
    overflow: hidden;
    display: flex;
    padding: 10px 2%;
    padding-left: 3%;
	width: 96%;
    background-color: rgb(234,237,244);
}

.voice {
    height: 40px;
    width: 40px;
    margin-right: 5px;
}

.inputFrame {
    background-color: white;
    border-radius: 10px;
    width: 55%;
    padding: 0 5px;
    padding-top: 8px;
	overflow: hidden;
}

.inputFrame textarea {
	width: 100%;
}

.sendBtn {
    height: 40px;
    background-color: rgb(0,201,251);
    color: white;
    border-radius: 12px;
    font-size: 15px;
}

.tabBar {
    text-align: center;
    font-size: 20px;
    background-color: rgb(0,170,254);
    padding: 3% 11px;
    position: fixed;
    width: 94%;
    color: white;
    top: 0;
    min-height: 30px;
}

.tabBar .arrowleft {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
}

.tabBar .option {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
}

.headPhoto {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.float-left {
    float: left;
}

.float-right {
    float: right;
}

.overflow-hidden {
    overflow: hidden;
}

.body {
    margin-top: 50px;
    overflow: hidden;
}

.message {
    padding: 12px;
    position: relative;
}

.text {
    margin: 0 12px;
    background-color: rgb(168, 200, 243);
    max-width: 62%;
    white-space: pre-wrap;
    border-radius: 12px;
    padding: 5px 10px;
    line-height: 30px;
    min-height: 30px;
    min-width: 20px;
}

.voiceNews {
    height: 30px;
    width: 30px;
}

.ml {
	margin-left: 10rpx;
}

.mr {
	margin-right: 10rpx;
}

.func {
	width: 100%;
	overflow: hidden;
	background-color: rgb(234,237,244);
}

.func .item {
	width: 20%;
	margin-left: 5%;
}

.func .item .img {
	width: 80rpx;
	height: 200rpx;
}

.newsImg {
	width: 250rpx;
	height: auto;
}

.imgContainer {
    margin: 0 12px;
}

.nickname {
	font-size: 30rpx;
	margin: 0 12px;
	position: relative;
	top: -10rpx;
}

.stick {
	position: absolute;
	top: 0;
	left: 0;
}
</style>