<template>
	<uni-row class="photograph">
		<view class="content" @click="tosave">
			<img id="cameraimage" :src="this.cameraimg">
		</view>
	</uni-row>
</template>

<script>
	export default {
		data() {
			return {
				imagesrc:'',
				cameraimg:'static/icon/camera.png'
			}
		},
		onLoad() {
	
		},
		methods: {
			tosave() {
				uni.chooseImage({
					count:1,
					crop:{
						quality:40
					},
					success:function(res){
						this.imagesrc = JSON.stringify(res.tempFilePaths[0])
						console.log(res)
						uni.navigateTo({
							url:`/pages/home/result?imagesrc=${this.imagesrc}`
						})
					}
				})
			},
			lookimagesrc() {
				console.log(this.cameraimg)
			}
		} 
	}
</script>

<style>
.photograph{
	
}
.content{
	margin: 30% 0 0 18%;
	height: 480rpx;
	width: 480rpx;
	background-color: #4F89F1;
	text-align: center;
	border-radius: 50%;

}
#cameraimage{
		padding-top: 27%;
	}
</style>
