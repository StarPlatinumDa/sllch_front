<template>
	<view style="text-align: center;">
		<img 
		class = "image"
		:src="this.imagesrc"  
		alt=""
		>
		<view class="">
			<text style="float: left; margin: 0 30rpx;">识别结果：</text>
			<text>{{this.diseasetype}}</text>
		</view>
		<img
		class = "image"
		:src="this.imagesrc"  
		alt=""
		>
		<uni-row 
		class="demo-uni-row" 
		:gutter="50"
		style="margin: 190rpx 0 0 0;"
		>
			<uni-col :span="15" >
				<button 
				style="background-color: #4F89F1; color: white; font-size: 110%;"
				@click="toconfirm"
				>上传图片</button>
			</uni-col>
			<uni-col :span="9">
				<button 
				style="background-color: #F14F4F; color: white; font-size: 110%;"
				@click="backtohome"
				>返回</button>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imagesrc: 'static/composing/2.jpg',
				diseasetype: '渗水'
			}
		},
		onLoad(option) {
			let n = option.imagesrc.length;
			if(option.tratype == 1)
				this.imagesrc = option.imagesrc;
			else
				this.imagesrc = option.imagesrc.substr(1, n-2);
		},
		methods: {
			toconfirm() {
				uni.navigateTo({
					url:`/pages/home/confirm?imagesrc=${this.imagesrc}`
				})
			},
			backtohome() {
				uni.switchTab({
				  url: '/pages/home/index'
				})
			}
		}
	}
</script>

<style>
	.image{
		width: 95%; 
		height: 500rpx; 
		margin: 30rpx 0; 
		border-radius: 20rpx;
	}

</style>
