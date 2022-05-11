<template>
	<view style="width: 90%; height: 100%; background-color: #eee; padding: 0 5%;">
		<view class="groupInfo">
			<view style="margin-bottom: 40rpx;">
				<view style="margin-bottom: 15rpx;"><text>群名称</text></view>
				<input class="groupNameFrame" v-model="groupName" />
			</view>
		</view>
		<checkbox-group style="margin-bottom: 110rpx;" @change="checkboxChange">
			<view v-for="(item, index) in friends" :key="item.friendId">
				<view class="rowItem">
					<image :src="frontUrl+item.headPhoto" class="leftImg"></image>
					<text class="text" v-text="item.nickname"></text>
					<checkbox :value="String(item.friendId)" :checked="item.checked" class="checkbox text"/>
				</view>
			</view>
		</checkbox-group>
		
		<button class="createBtn" @tap="createGroup()">立即创建</button>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				groupName: '',
				selectFriends: []
			}
		},
		onLoad() {
			this.friends.forEach(item => {
				item.checked = false
			})
		},
		methods: {
			...mapMutations(['setCurrentChatFrame']),
			createGroup() {
				if (this.selectFriends.length == 0) {
					console.log('至少要选择一个朋友！')
					return
				}
				uni.request({
				    url: this.frontUrl + '/chat/addGroup',
				    method: 'POST',
				    header: {
						'Authorization': this.token,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    },
				    data: {
						ownerId: this.userId,
						groupName: this.groupName
					},
				    success: (res) => {
						if (res.data.code == 200) {
							res.data = res.data.data
							let count = 0
							this.selectFriends.forEach(friendId => {
								let memberName = ''
								this.friends.forEach(item => {
									if (item.friendId == friendId) {
										memberName = item.nickname
									}
								})
								uni.request({
								    url: this.frontUrl + '/chat/addMember',
								    method: 'POST',
								    header: {
										'Authorization': this.token,
										'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								    },
								    data: {
										groupId: res.data.groupId,
										memberId: friendId,
										memberName: memberName
									},
								    success: (r) => {
										count++
										if (count == this.selectFriends.length) {
											uni.request({
											    url: this.frontUrl + '/chat/selectAllMember',
											    method: 'POST',
											    header: {
													'Authorization': this.token,
													'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
											    },
											    data: {
													groupId: res.data.groupId
												},
											    success: (r) => {
													if (r.data.code == 200) {
														r.data = r.data.data
														let lastNews = {}
														lastNews.newsTime = ''
														lastNews.newsContent = ''
														lastNews.source = ''
														let currentChatFrame = {
															groupId: res.data.groupId,
															groupMembers: r.data.users,
															chatType: 1,
															groupName: this.groupName,
															lastNews: lastNews,
															groupPhoto: this.frontUrl + '/profile/defaultGroupPhoto.png',
															chatId: res.data.groupId,
															ownerId: this.userId
														}
														this.setCurrentChatFrame(currentChatFrame)
														this.chatFrames.push(currentChatFrame)
														uni.redirectTo({
															url: '/pages/chat/chatFrame'
														})
													}
											    }
											})
										}
								    }
								})
							})
						}
				    }
				})
			},
			checkboxChange(e) {
				this.selectFriends = e.detail.value
			}
		},
		computed: {
			...mapState(['friends', 'userId', 'chatFrames', 'token', 'frontUrl'])
		}
	}
</script>

<style>
.groupInfo {
	padding: 10% 0;
}

.groupNameFrame {
	background-color: white;
	font-size: 40rpx;
	padding: 15rpx 10rpx;
	border-radius: 10rpx;
}

.createBtn {
	background-color: #007AFF;
	color: white;
	text-align: center;
	position: fixed;
	bottom: 20rpx;
	width: 90%;
	line-height: 90rpx;
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

.checkbox {
	position: absolute;
	right: 10rpx;
}
</style>
