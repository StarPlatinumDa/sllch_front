<template>
    <view :style="{ 'margin-top': statusBarHeight + 'px', 'background':'#eee', 'min-height':'100%' }">
		<view class="body">
			<uni-search-bar :radius="100" v-model="searchContent" @confirm="search" :placeholder="searchPlaceholder"></uni-search-bar>
			<view v-if="type == 0">
				<view class="rowItem" v-for="item in searchUsers" :key="item.userId">
				    <image :src="frontUrl + item.userPhoto" class="leftImg"></image>
				    <text class="text" v-text="item.userNickname"></text>
					<button class="addBtn" @click="addFriend(item)" v-if="item.type == 2">添加</button>
					<text class="rightText" v-else-if="item.type == 1">等待验证</text>
				</view>
			</view>
			<view v-if="type == 1">
				<view class="rowItem" v-for="item in searchGroups" :key="item.userId">
				    <image :src="frontUrl + item.groupPhoto" class="leftImg"></image>
				    <text class="text" v-text="item.groupName"></text>
					<button class="addBtn" @click="addGroup(item)" v-if="item.type == 2">添加</button>
					<text class="rightText" v-else-if="item.type == 1">等待验证</text>
				</view>
			</view>
		</view>
		<view class="tabBar" :style="{ 'margin-top': statusBarHeight + 'px' }">
		    <image class="arrowleft" mode="heightFix" src="/static/icon/arrowleft.png" @touchend="back"></image>
		    <text v-text="title"></text>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import { uniSearchBar } from '@dcloudio/uni-ui'
export default {
	components: {
		uniSearchBar
	},
	data() {
		return {
			users: [],
			searchContent: '',
			searchUsers: [],
			type: -1,
			title: '',
			searchPlaceholder: '',
			searchGroups: [],
			statusBarHeight: getApp().globalData.statusBarHeight
		}
	},
	onLoad(option) {
		this.type = option.type
		if (this.type == 0) {
			this.title = '找人'
			this.searchPlaceholder = '输入手机号/昵称'
		} else {
			this.title = '找群'
			this.searchPlaceholder = '输入群号/群名称'
		}
	},
	methods: {
		back() {
		    uni.navigateBack({
		        delta: 1
		    })
		},
		searchUser() {
			this.searchUsers = []
			uni.request({
			    url: this.frontUrl + '/system/user/getUserByPhone',
			    method: 'POST',
			    header: {
					'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			    },
			    data: {
					userPhone: this.searchContent
				},
			    success: (res) => {
					if (res.data.code == 200) {
						res.data = res.data.data
						if (!res.data) return
						let user = {
							userId: res.data.userId,
							userNickname: res.data.nickName,
							userPhoto: res.data.avatar,
							type: -1
						}
						this.pushTosearchUsers(user)
					}
			    }
			})
			
			uni.request({
			    url: this.frontUrl + '/system/user/getUsersByNickname',
			    method: 'POST',
			    header: {
					'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			    },
			    data: {
					userNickname: this.searchContent
				},
			    success: (res) => {
					if (res.data.code == 200) {
						res.data = res.data.data
						res.data.forEach(item => {
							let user = {
								userId: item.userId,
								userNickname: item.nickName,
								userPhoto: item.avatar,
								type: -1
							}
							this.pushTosearchUsers(user)
						})
					}
			    }
			})
		},
		pushTosearchUsers(item) {
			uni.request({
			    url: this.frontUrl + '/chat/selectOneFriend',
			    method: 'POST',
			    header: {
					'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			    },
			    data: {
					userId: this.userId,
					friendId: item.userId
				},
			    success: (r1) => {
					if (r1.data.code == 200) {
						r1.data = r1.data.data
						if (r1.data.friend == null) {
							uni.request({
								url: this.frontUrl + '/chat/selectOneVerification',
								method: 'POST',
								header: {
									'Authorization': this.token,
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								},
								data: {
									userId: this.userId,
									fromId: this.userId,
									toId: item.userId,
									verificationStatus: 0
								},
								success: (r2) => {
									if (r2.data.code == 200) {
										r2.data = r2.data.data
										if (r2.data.friendVerification != null) {
											// 1: 等待验证
											item.type = 1
											this.searchUsers.push(item)
										} else {
											// 2: 添加按钮
											item.type = 2
											this.searchUsers.push(item)
										}
									}
								}
							})
						} else {
							// 3: 不显示
							item.type = 3
							this.searchUsers.push(item)
						}
					}
			    }
			})
		},
		addFriend(user) {
			this.sendMessage({
				userId: this.userId,
				fromId: this.userId,
				toId: user.userId,
				verificationStatus: 0,
				option: 'add',
				verificationType: 0,
				nickname: user.nickname
			})
		},
		sendMessage(msg, callback) {
		    msg.type = 'verification'
		    if (this.mySocket.socketOpen) {
		        this.mySocket.socketTask.send({
		            data: JSON.stringify(msg),
                    success: () => {
						if (this.type == 0) {
							for (let i=0; i<this.searchUsers.length; i++) {
								if (this.searchUsers[i].userId == msg.toId) {
									this.searchUsers[i].type = 1
									break
								}
							}
						} else {
							for (let i=0; i<this.searchGroups.length; i++) {
								if (this.searchGroups[i].groupId == msg.groupId) {
									this.searchGroups[i].type = 1
									break
								}
							}
						}
						uni.request({
							url: this.frontUrl + '/system/user/getUserById',
							method: 'POST',
							header: {
								'Authorization': this.token,
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							},
							data: {
								userId: msg.toId
							},
							success: (res) => {
								if (res.data.code == 200) {
									res.data = res.data.data
									msg.headPhoto = res.data.userPhoto
									this.verifications.push(msg)
								}
							}
						})
                    }
		        })
		    } else {
		        // this.mySocket.socketMsgQueue.push(msg)
		    }
		    if (callback) callback()
		},
		search() {
			this.searchGroups = []
			this.searchUser = []
			if (this.type == 0) this.searchUser()
			else this.searchGroup()
		},
		searchGroup() {
			uni.request({
				url: this.frontUrl + '/chat/selectGroupByIdOrName',
				method: 'POST',
				header: {
					'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: {
					content: this.searchContent
				},
				success: (res) => {
					if (res.data.code == 200 && res.data.data.groups != null) {
						res.data = res.data.data
						res.data.groups.forEach(g => {
							let group = {
								groupId: g.groupId,
								groupName: g.groupName,
								groupPhoto: g.groupPhoto,
								ownerId: g.ownerId,
								type: -1
							}
							this.pushTosearchGroups(group)
						})
					}
				}
			})
		},
		pushTosearchGroups(group) {
			uni.request({
				url: this.frontUrl + '/chat/selectAllMember',
				method: 'POST',
				header: {
					'Authorization': this.token,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: {
					groupId: group.groupId
				},
				success: (res) => {
					if (res.data.code == 200) {
						res.data = res.data.data
						let members = res.data.users
						let flag = false
						members.forEach(member => {
							if (member.userId == this.userId) {
								flag = true
							}
						})
						if (flag) {
							group.type = 3
							this.searchGroups.push(group)
						} else {
							uni.request({
								url: this.frontUrl + '/chat/selectGroupVerifications',
								method: 'POST',
								header: {
									'Authorization': this.token,
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								},
								data: {
									userId: this.userId,
									groupId: group.groupId,
									fromId: this.userId
								},
								success: (r) => {
									if (r.data.code == 200) {
										r.data = r.data.data
										if (r.data.groupVerifications.length != 0) {
											group.type = 1
										} else {
											group.type = 2
										}
										this.searchGroups.push(group)
									}
								}
							})
						}
					}
				}
			})
		},
		addGroup(group) {
			this.sendMessage({
				userId: this.userId,
				fromId: this.userId,
				toId: group.ownerId,
				verificationStatus: 0,
				option: 'add',
				verificationType: 1,
				source: 'apply',
				groupId: group.groupId,
				groupPhoto: group.groupPhoto,
				groupName: group.groupName
			})
		}
	},
    computed: {
        ...mapState(['userId', 'mySocket', 'verifications', 'token', 'frontUrl'])
    },
	catch: {
        searchUsers: {
            handler: newVal => {},
            immediate: true
        }
    }
}
</script>

<style>
.tabBar {
    text-align: center;
    font-size: 20px;
    background-color: rgb(0,170,254);
    padding: 11px 3%;
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

.body {
    padding-top: 50px;
    overflow: hidden;
}

.rowItem {
    padding: 10px;
    border: 1px solid #eee;
    background-color: white;
    display: flex;
	position: relative;
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

.rightText {
	line-height: 45px;
	position: absolute;
	right: 15px;
}

.addBtn {
	background-color: rgb(0,170,254);
	border-radius: 20px;
	font-size: 13px;
	height: 30px;
	line-height: 30px;
	width: 60px;
	position: absolute;
	top: 50%;
	right: 15px;
	transform: translateY(-50%);
}
</style>