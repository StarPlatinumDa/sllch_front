<template>
    <view style="background:#eee; min-height:100%;">
		<view class="body" :style="{ 'margin-top': statusBarHeight + 'px' }">
			<view v-if="verificationType == 0">
				<view v-for="(item, index) in friendVerifications" :key="item.fromId + '' + item.toId + index">
					<view class="rowItem">
						<image :src="item.headPhoto" class="leftImg"></image>
						<text class="text" v-text="item.nickname"></text>
						<view v-if="item.fromId == userId" class="rightContent">
							<text v-if="item.verificationStatus == 0">等待验证</text>
							<text v-else-if="item.verificationStatus == 1">验证通过</text>
							<text v-else>对方已拒绝</text>
						</view>
						<view v-else class="rightContent">
							<text v-if="item.verificationStatus == 1">已同意</text>
							<text v-else-if="item.verificationStatus == 2">已拒绝</text>
							<view v-else style="overflow: hidden;">
								<button class="leftBtn" @click="accept(item)">同意</button>
								<button class="rightBtn" @click="refuse(item)">拒绝</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<view v-for="(item, index) in groupVerifications" :key="item.fromId + '' + item.toId + index + item.groupId">
					<view class="rowItem">
						<image v-if="item.fromId == userId" :src="item.groupPhoto" class="leftImg"></image>
						<image v-else :src="item.headPhoto" class="leftImg"></image>
						<text v-if="item.fromId == userId" class="text" v-text="item.groupName"></text>
						<text v-else class="text" v-text="item.nickname"></text>
						<view v-if="item.fromId == userId" class="rightContent">
							<text v-if="item.verificationStatus == 0">等待验证</text>
							<text v-else-if="item.verificationStatus == 1">验证通过</text>
							<text v-else>您已被拒绝！</text>
						</view>
						<view v-else class="rightContent">
							<text v-if="item.verificationStatus == 1">已同意</text>
							<text v-else-if="item.verificationStatus == 2">已拒绝</text>
							<view v-else style="overflow: hidden;">
								<button class="leftBtn" @click="accept(item)">同意</button>
								<button class="rightBtn" @click="refuse(item)">拒绝</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="text-align: center; padding-top: 100px;" v-if="friendVerifications.length == 0">暂无通知</view>
		</view>
		<view class="tabBar" :style="{ 'margin-top': statusBarHeight + 'px' }">
		    <image class="arrowleft" mode="heightFix" src="/static/icon/arrowleft.png" @touchend="back"></image>
		    <text v-text="title"></text>
		    <text class="option" @tap="enterAdd">添加</text>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
	onLoad(option) {
		if (option.option == 0) {
			this.title = '新朋友'
		} else if (option.option == 1) {
			this.title = '群通知'
		}
		this.verificationType = option.option
		this.getAllVerification()
	},
	data() {
		return {
			title: '',
			verificationType: -1,
			statusBarHeight: getApp().globalData.statusBarHeight
		}
	},
	methods: {
		...mapMutations(['setVerifications']),
		back () {
		    uni.navigateBack({
		        delta: 1
		    })
		},
		enterAdd () {
		    uni.navigateTo({
		        url: `/pages/chat/add?type=${this.verificationType}`
		    })
		},
		getAllVerification() {
			if (this.verificationType == 0) {
				uni.request({
				    url: this.frontUrl + '/chat/selectAllByUserId',
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
							this.setVerifications(res.data.friendVerifications)
							console.log(res.data)
						}
				    }
				})
				return
			}
			uni.request({
			    url: this.frontUrl + '/chat/selectAllGroupVerificationByUserId',
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
						this.setVerifications(res.data.groupVerifications)
					}
			    }
			})
		},
		accept(item) {
			let groupId = -1
			if (this.verificationType == 1) {
				groupId = item.groupId
			}
			this.sendMessage({
				userId: item.userId,
				fromId: item.fromId,
				toId: item.toId,
				verificationStatus: 1,
				option: 'accept',
				verificationType: this.verificationType,
				groupId: groupId
			}, () => {
				for (let i=0; i<this.verifications.length; i++) {
					if (this.verifications[i].fromId == item.fromId && this.verifications[i].toId == item.toId) {
						this.verifications[i].verificationStatus = 1
						break
					}
				}
			})
		},
		refuse(item) {
			let groupId = -1
			if (this.verificationType == 1) {
				groupId = item.groupId
			}
			this.sendMessage({
				userId: item.userId,
				fromId: item.fromId,
				toId: item.toId,
				verificationStatus: 2,
				option: 'refuse',
				verificationType: this.verificationType,
				groupId: groupId
			}, () => {
				for (let i=0; i<this.verifications.length; i++) {
					if (this.verifications[i].fromId == item.fromId && this.verifications[i].toId == item.toId) {
						this.verifications[i].verificationStatus = 2
						break
					}
				}
			})
		},
		sendMessage(msg, callback) {
		    msg.type = 'verification'
		    if (this.mySocket.socketOpen) {
		        this.mySocket.socketTask.send({
		            data: JSON.stringify(msg)
		        })
		    } else {
		        // this.mySocket.socketMsgQueue.push(msg)
		    }
		    if (callback) callback()
		}
	},
    computed: {
        ...mapState(['mySocket', 'verifications', 'userId', 'frontUrl', 'token']),
		friendVerifications() {
		    return this.verifications.filter(item => item.verificationType == this.verificationType)
		},
		groupVerifications() {
			return this.verifications.filter(item => item.verificationType == this.verificationType)
		}
    }
}
</script>

<style scoped>
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
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
}

.body {
	padding-top: 50px;
}

.rowItem {
    padding: 10px;
    border: 1px solid #eee;
    background-color: white;
    display: flex;
	position: relative;
}

.rowItem .rightContent {
	position: absolute;
	top: 50%;
	right: 15px;
	transform: translateY(-50%);
}

.leftImg {
    height: 45px;
    width: 45px;
    border-radius: 5px;
    margin-right: 20px;
}

.text {
    line-height: 45px;
}

.leftBtn {
	height: 40px;
	background-color: rgb(0,201,251);
	border-radius: 30px 0 0 30px;
	font-size: 13px;
	float: left;
	height: 30px;
	line-height: 30px;
}

.rightBtn {
	height: 40px;
	background-color: rgb(237, 243, 251);
	border-radius: 0 30px 30px 0;
	font-size: 13px;
	float: left;
	height: 30px;
	line-height: 30px;
}
</style>