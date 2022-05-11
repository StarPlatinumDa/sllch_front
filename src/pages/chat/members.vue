<template>
	<view :style="{ 'margin-top': statusBarHeight + 'px' }">
		<view v-for="(item, index) in groupMembers" :key="item.userId">
			<view class="rowItem">
				<image :src="frontUrl+item.avatar" class="leftImg"></image>
				<text class="text" v-text="item.nickName"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['currentChatFrame', 'frontUrl']),
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
