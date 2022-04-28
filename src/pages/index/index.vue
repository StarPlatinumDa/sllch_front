<template>
	<view class="content">
		<view>
			<text>登陆页面</text>
			<el-row>
				<el-button type="primary" v-on:click="tohome">跳转到首页</el-button>
			</el-row>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			tohome: function() {
				uni.switchTab({
					url:'/pages/home/index'
				})
			}
		}
	}
</script>

<style>
</style>
