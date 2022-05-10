<template>
	<view>
		<view v-for="(item, index) in groupMembers" :key="item.userId" :style="{ 'margin-top': statusBarHeight + 'px' }">
			<view class="rowItem">
				<image :src="item.userPhoto" class="leftImg"></image>
				<text class="text" v-text="item.nickName"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['currentChatFrame']),
			groupMembers() {
				console.log(this.currentChatFrame.groupMembers)
				return this.currentChatFrame.groupMembers
			}
		},
		data () {
			return {
				statusBarHeight: getApp().globalData.statusBarHeight
			}
		}
	}
</script>

<style>
	.leftImg {
	    height: 45px;
	    width: 45px;
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
	    line-height: 45px;
	}
</style>
