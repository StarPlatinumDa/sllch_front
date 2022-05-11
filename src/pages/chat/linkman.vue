<template>
    <view :style="{ 'padding-top': statusBarHeight + 'px', 'background':'#eee', 'min-height':'100%' }">

        <view style="text-align:center;">
            <text style="line-height:50px; font-weight:700;">通讯录</text>
        </view>

        <view :class="{rowItem:true, touchColor:touchNewActive}"
        @touchstart="touchNewActive=true"
        @touchend="touchNew(0)">
            <image src="/static/icon/addLinkman.png" class="leftImg"></image>
            <text class="text">新朋友</text>
        </view>
		<view :class="{rowItem:true, touchColor:touchGroupActive}"
		@touchstart="touchGroupActive=true"
		@touchend="touchNew(1)">
		    <image src="/static/icon/groupInform.png" class="leftImg"></image>
		    <text class="text">群通知</text>
		</view>
		<view :class="{rowItem:true, touchColor:touchCreateGroupActive}" style="margin-bottom:20px;"
		@touchstart="touchCreateGroupActive=true"
		@touchend="createGroup">
		    <image src="/static/icon/createGroup.png" class="leftImg"></image>
		    <text class="text">创建群</text>
		</view>

		<view>
			<view style="padding: 0 20rpx;">
				<text :class="{listOption: true, bgWhite: listOption==0}" @tap="reLoadList(0)">好友</text>
				<text :class="{listOption: true, bgWhite: listOption==1}" @tap="reLoadList(1)">群聊</text>
			</view>
			<view v-show="listOption == 0">
				<view v-for="(item, index) in friends" :key="item.friendId">
					<view :class="{rowItem:true, touchColor:item.isActive}"
					@touchstart="touchFriend(true, index)"
					@touchend="touchFriend(false, index)">
						<image :src="frontUrl+item.headPhoto" class="leftImg"></image>
						<text class="text" v-text="item.nickname"></text>
					</view>
				</view>
			</view>
			<view v-show="listOption == 1">
				<view v-for="(item, index) in groups" :key="item.groupId">
					<view :class="{rowItem:true, touchColor:item.isActive}"
					@touchstart="touchGroup(true, index)"
					@touchend="touchGroup(false, index)">
						<image :src="item.groupPhoto" class="leftImg"></image>
						<text class="text" v-text="item.groupName"></text>
					</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    components: {
        
    },
    data() {
        return {
            touchNewActive: false,
			touchGroupActive: false,
			touchCreateGroupActive: false,
			// 0.好友列表 1.群列表
			listOption: 0,
			groups: [],
			statusBarHeight: getApp().globalData.statusBarHeight
        }
    },
    onLoad() {
        this.getFriends()
		
		this.getGroups()
    },
    methods: {
        ...mapMutations(['setFriends', 'setCurrentChatFrame']),
        touchNew(option) {
			// option: 0->好友  1->群
			if (option == 0) {
				this.touchNewActive = false
			} else if (option == 1) {
				this.touchGroupActive = false
			}
            uni.navigateTo({
            	url: `/pages/chat/newFriend?option=${option}`
            })
        },
        touchFriend(isActive, index) {
            if (isActive == false) {
                this.friends[index].isActive = isActive
                this.setCurrentChatFrame({
                    chatId: this.friends[index].friendId,
                    chatObjectPhoto: this.friends[index].headPhoto,
                    nickname: this.friends[index].nickname,
                    isFriend: 1,
                    blackList: this.friends[index].friendBlackList,
                    userPhoto: this.avatar,
					chatType: 0
                })
                uni.navigateTo({
                    url: '/pages/chat/chatFrame'
                })
            } else {
                this.friends[index].isActive = isActive
            }
        },
		createGroup() {
			this.touchCreateGroupActive = false
			uni.navigateTo({
				url: `/pages/chat/createGroup`
			})
		},
		reLoadList(option) {
			this.listOption = option
		},
		getFriends() {
			uni.request({
			    url: this.frontUrl + '/chat/getFriends',
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
						res.data = res.data.data;
						let friends = res.data.friends;
						friends = friends.map(item => {
						    item.isActive = false;
						    return item;
						})
						this.setFriends(friends);
					}
			    }
			})
		},
		getGroups() {
			uni.request({
			    url: this.frontUrl + '/chat/selectAllGroup',
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
						res.data = res.data.data;
						let groups = res.data.groupList;
						this.groups = groups.map(item => {
						    item.isActive = false;
						    return item;
						})
					}
			    }
			})
		},
		touchGroup(isActive, index) {
			if (isActive == false) {
			    this.groups[index].isActive = isActive;
				uni.request({
				    url: this.frontUrl + '/chat/selectAllMember',
				    method: 'POST',
				    header: {
						'Authorization': this.token,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    },
				    data: {
						groupId: this.groups[index].groupId
					},
				    success: (res) => {
						if (res.data.code == 200) {
							res.data = res.data.data;
							this.setCurrentChatFrame({
							    userPhoto: this.avatar,
								chatType: 1,
								groupPhoto: this.groups[index].groupPhoto,
								groupName: this.groups[index].groupName,
								groupMembers: res.data.users,
								groupId: this.groups[index].groupId,
								ownerId: this.groups[index].ownerId
							})
							uni.navigateTo({
							    url: '/pages/chat/chatFrame'
							})
						}
				    }
				})
			} else {
			    this.groups[index].isActive = isActive
			}
		}
    },
    computed: {
        ...mapState(['friends', 'userId', 'frontUrl', 'token', 'avatar'])
    },
    catch: {
        friends: {
            handler: newVal => {},
            immediate: true
        }
    }
}
</script>

<style>

.leftImg {
    height: 40px;
    width: 40px;
    border-radius: 5px;
    margin-right: 20px;
}

.rowItem {
    padding: 10px;
    border: 1px solid #eee;
    background-color: white;
    display: flex;
}

.text {
    line-height: 40px;
}

.touchColor {
    background-color: rgb(199, 199, 199);
}

.listOption {
	display: inline-block;
	padding: 5rpx 20rpx;
	font-size: 40rpx;
	border-radius: 15rpx;
}

.bgWhite {
	background-color: white;
}
</style>