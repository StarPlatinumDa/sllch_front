<template>
    <view style="background-color:rgb(234,237,244); min-height:100%;" :style="{ 'margin-top': statusBarHeight + 'px' }">
        <view class="option">
            <view class="row margin-bottom10" style="padding:15px;">
                <view class="display-flex">
                    <image :src="frontUrl+currentChatFrame.chatObjectPhoto" mode="aspectFill" class="headPhoto"></image>
                    <text v-text="currentChatFrame.nickname" style="line-height: 50px"></text>
                </view>
            </view>
            <view
            :class="{row: true, touchColor: remarksTouch}"
            style="padding:15px;"
            @touchstart="remarksTouch=true" 
            @touchend="openModifyFrame('remarksTouch')">
                <view class="dispaly-flex">
                    <text>修改备注</text>
                </view>
            </view>
            <view
            :class="{row: true, touchColor: recordsTouch}"
            style="padding:15px;"
            @touchstart="recordsTouch=true" 
            @touchend="openCheckFrame('确定删除聊天记录？', 'recordsTouch')">
                <view class="dispaly-flex">
                    <text>删除聊天记录</text>
                </view>
            </view>
            <view class="row margin-bottom10" style="padding:15px;">
                <view class="dispaly-flex">
                    <text>加入黑名单</text>
                    <switch style="float:right;" @change="blackListChange"/>
                </view>
            </view>
            <view
            :class="{row: true, touchColor: delTouch}"
            style="padding:15px;"
            @touchstart="delTouch=true" 
            @touchend="openCheckFrame('确定删除该好友？', 'delTouch')">
                <view class="dispaly-flex text-center">
                    <text style="color:red;">删除好友</text>
                </view>
            </view>
        </view>
        
        <view class="tabBar" :style="{ 'margin-top': statusBarHeight + 'px' }">
            <image class="arrowleft" mode="heightFix" src="/static/icon/arrowleft.png" @touchend="back"></image>
            <text>聊天设置</text>
        </view>

        <tui-modal :show="checkFrameShow" title="提示" :content="content" @click="closeCheckframe"></tui-modal>
        <tui-modal :show="modifyFrameShow" custom>
            <view>
                <view style="text-align:center;font-size:22px;margin-bottom:15px;">修改备注</view>

                <view style="border-bottom:1px solid #eee;">
                    <input class="nicknameInput" type="text" :placeholder="'备注：' + modifyContent" v-model="nickname">
                </view>
                
                <view style="margin-top:20px;">
                    <button type="gray" @click="closeModifyframe(false)" style="float:left">取消</button>
                    <button type="primary" @click="closeModifyframe(true)" style="float:right">确定</button>
                </view>
            </view>
        </tui-modal>

        <tui-tips ref="toast" position="center" :backgroundColor="tipBc"></tui-tips>

    </view>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import tuiModal from "thorui-uni/lib/thorui/tui-modal/tui-modal"
import tuiButton from "thorui-uni/lib/thorui/tui-button/tui-button"
import tuiTips from 'thorui-uni/lib/thorui/tui-tips/tui-tips'
export default {
    components: {
        tuiModal,
        tuiButton,
        tuiTips
    },
    data () {
        return {
            remarksTouch: false,
            delTouch: false,
            recordsTouch: false,
            content: '',
            checkFrameShow: false,
            modifyFrameShow: false,
            modifyContent: '',
            checkFrame: '',
            tipBc: '',
            blackList: false,
            nickname: '',
			statusBarHeight: getApp().globalData.statusBarHeight
        }
    },
    onLoad () {
        this.modifyContent = this.currentChatFrame.nickname
    },
    methods: {
        ...mapMutations(['setNews', 'setChatFrames', 'setFriends']),
        back () {
            uni.navigateBack({
                delta: 1
            })
        },
        openCheckFrame (content, option) {
            if (option == 'delTouch') {
                this.checkFrame = 'del'
            } else if (option == 'recordsTouch') {
                this.checkFrame = 'records'
            }
            if (option&&this[option]) this[option]=false
            this.content = content
            this.checkFrameShow = true
        },
        closeCheckframe (option) {
            this.checkFrameShow = false
            if (option.index == 1) {
                if (this.checkFrame == 'del') {
					uni.request({
					    url: this.frontUrl + '/chat/delFriend',
					    method: 'POST',
					    header: {
							'Authorization': this.token,
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					    },
					    data: {
							userId: this.userId,
							friendId: this.currentChatFrame.chatId
						},
					    success: (res) => {
							if (res.data.code == 200) {
								res.data = res.data.data
								// this.setNews(this.news.filter(item => item.userId == this.userId && !(item.fromId == this.currentChatFrame.chatId || item.toId == this.currentChatFrame.chatId)))
								this.tipBc = 'rgb(99, 189, 35)'
								// this.setChatFrames(this.chatFrames.filter(item => !(item.chatId==this.currentChatFrame.chatId && item.chatType==this.currentChatFrame.chatType)))
								this.setFriends(this.friends.filter(item => item.firendId != this.currentChatFrame.chatId))
							} else {
								this.tipBc = 'rgb(193,108,117)'
							}
							let options = {
							    msg: res.data.msg,
							    duration: 2000
							}
							this.$refs.toast.showTips(options)
					    }
					})
                } else if (this.checkFrame == 'records') {
					uni.request({
					    url: this.frontUrl + '/chat/delRecords',
					    method: 'POST',
					    header: {
							'Authorization': this.token,
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					    },
					    data: {
							userId: this.userId,
							chatId: this.currentChatFrame.chatId,
							source: this.currentChatFrame.chatType
						},
					    success: (res) => {
							if (res.data.code == 200) {
								res.data = res.data.data
								this.setNews(this.news.filter(item => item.userId == this.userId && !(item.fromId == this.currentChatFrame.chatId || item.toId == this.currentChatFrame.chatId)))
								this.tipBc = 'rgb(99, 189, 35)'
							} else {
								this.tipBc = 'rgb(193,108,117)'
							}
							let options = {
							    msg: res.data.msg,
							    duration: 500
							}
							this.$refs.toast.showTips(options)
					    }
					})
                }
            } else {
                
            }
        },
        openModifyFrame (option) {
            this[option]=false
            this.modifyFrameShow = true
        },
        closeModifyframe (option) {
            this.modifyFrameShow = false
            if (option == true) {
				uni.request({
				    url: this.frontUrl + '/chat/updateNickname',
				    method: 'POST',
				    header: {
						'Authorization': this.token,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    },
				    data: {
						userId: this.userId,
						friendId: this.currentChatFrame.chatId,
						nickname: this.nickname
					},
				    success: (res) => {
						if (res.data.code == 200) {
							res.data = res.data.data
							this.setNews(this.news.filter(item => item.userId == this.userId && (item.fromId == this.currentChatFrame.chatId || item.toId == this.currentChatFrame.chatId)))
							this.tipBc = 'rgb(99, 189, 35)'
							this.currentChatFrame.nickname = this.nickname
							this.modifyContent = this.nickname
							for (let i=0; i<this.friends.length; i++) {
							    if (this.friends[i].friendId == this.currentChatFrame.chatId) {
							        this.friends[i].nickname = this.nickname
							        break
							    }
							}
							for (let i=0; i<this.chatFrames.length; i++) {
							    if (this.chatFrames[i].chatId == this.currentChatFrame.chatId) {
							        this.chatFrames[i].nickname = this.nickname
							        break
							    }
							}
							this.nickname = ''
						} else {
							this.tipBc = 'rgb(193,108,117)'
						}
						let options = {
						    msg: res.data.msg,
						    duration: 500
						}
						this.$refs.toast.showTips(options)
				    }
				})
            }
        },
        blackListChange (e) {
            let bool = e.target.value
			uni.request({
			    url: this.frontUrl + '/chat/updateBlackList',
			    method: 'POST',
			    header: {
					'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			    },
			    data: {
					userId: this.userId,
					chatId: this.currentChatFrame.chatId,
					black: bool == true ? 1 : 0
				},
			    success: (res) => {
					if (res.data.code == 200) {
						res.data = res.data.data
						let news = []
						this.news.forEach(item => {
						    if (item.userId == this.userId && item.fromId == this.currentChatFrame.chatId || item.toId == this.currentChatFrame.chatId) {
						        return
						    }
						    news.push(item)
						})
						this.setNews(news)
						this.tipBc = 'rgb(99, 189, 35)'
					} else {
						this.tipBc = 'rgb(193,108,117)'
					}
					let options = {
					    msg: res.data.msg,
					    duration: 500
					}
					this.$refs.toast.showTips(options)
			    }
			})
        }
    },
    computed: {
        ...mapState(['userId', 'currentChatFrame', 'friends', 'chatFrames', 'news', 'token', 'frontUrl', 'friends'])
    }
}
</script>

<style scoped>
.tabBar {
    text-align: center;
    font-size: 20px;
    background-color: rgb(0,170,254);
    padding: 11px 3%;
    position: fixed;
    width: 94%;
    color: white;
    top: 0;
}

.tabBar .arrowleft {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
}

.option {
    padding-top: 50px;
    overflow: hidden;
    font-size: 20px;
}

.headPhoto {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
}

.display-flex {
    display: flex;
}

.text-center {
    text-align: center;
}

.row {
    background-color: white;
    border-bottom: 1px solid #eee;
}

.margin-bottom10 {
    margin-bottom: 10px;
}

.touchColor {
    background-color: rgb(207, 203, 203);
}

.nicknameInput {
    font-size: 20px;
    padding: 10px;
}
</style>