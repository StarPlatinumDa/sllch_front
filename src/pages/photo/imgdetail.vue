<template>
	<view class="example-body">
		<uni-row class="demo-uni-row">
				<view class="picture">
					<img
					style=" width: 100%;height:480rpx;padding: 0px;"
					:src="this.imgdtail.imageSrc" 
					alt="无法显示图片">
				</view>
		</uni-row>

		<uni-row 
		class="demo-uni-row"
		style="text-align: center;"
		>
			<uni-col :span="6" class="card">
				<uni-row>
					<text class="value">{{this.disType[this.imgdtail.imageTypeid]}}</text>
				</uni-row>
				<uni-row>
					<text class="key">病害类型</text>
				</uni-row>
				
			</uni-col >
			<uni-col :span="6" class="card">
				<uni-row>
					<text class="value">{{this.imgdtail.imagePerlevel}}级</text>
				</uni-row>
				<uni-row>
					<text class="key">图片等级</text>
				</uni-row>
			</uni-col>
			<uni-col :span="10" class="card">
				<uni-row>
					<text class="value">{{this.imgdtail.imageCreatetime}}</text>
				</uni-row>
				<uni-row>
					<text class="key">拍摄时间</text>
				</uni-row>
			</uni-col>
		</uni-row>

		<uni-row class="demo-uni-row">
			<uni-col>
				<uni-row style="margin-left: 20rpx;">
					桥梁位置:
				</uni-row>
				<uni-row>
					<uni-col :offset="2">
						{{this.imgdtail.imageShotplace}}
					</uni-col>
				</uni-row>
			</uni-col>
		</uni-row>

		<uni-row class="demo-uni-row">
			<uni-col>
				<uni-row style="margin-left: 20rpx;">
					拍摄人员:
				</uni-row>
				<uni-row>
					<uni-col :offset="2">
						{{this.nick_name[this.imgdtail.userId]}}
					</uni-col>
				</uni-row>
			</uni-col>
		</uni-row>

		<uni-row class="demo-uni-row">
			<uni-col>
				<uni-row style="margin-left: 20rpx;">
					图片标签:
				</uni-row>
				<uni-row style="margin: 0 50rpx;">
					<uni-col :span="5"
					v-for="(item, index) in this.imgdtail.imageRemarks">
						<uni-tag 
						:text="item" 
						type="primary" 
						size="normal"
						></uni-tag>
					</uni-col>
				</uni-row>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gutter: 0,
				nickname: '',
				imgdtail:{
				},
				disType: {
					2:'脱落',
					3:"露筋",
					4:"渗水",
					6:"无",
				},
				nick_name:{
					1:'Ouch',
					100:'Gush'
				}
			}
		},
		onLoad(option) {
			this.imgdtail = JSON.parse(option.imgdtail)
			this.imgdtail.imageRemarks = this.imgdtail.imageRemarks.split('|')
			uni.request({
				url:this.frontUrl + '/system/user/' + this.imgdtail.userId,
				method:'GET',
				header: {
					'Authorization': this.token
				},
				success:(res) =>{
					console.log(res)
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style>
	.demo-uni-row {
		margin-bottom: 50rpx;
	}
	.demo-uni-col {
		height: 36px;
		border-radius: 5px;
	}

	.card {
		background-color: #D8D8D8;
		border-radius: 5%;
		margin: 0 10rpx;
	}
	
	.value{
		font-size: 120%;
	}
	
	.key{
		font-size: 70%;
		opacity: 0.5;
	}
</style>
