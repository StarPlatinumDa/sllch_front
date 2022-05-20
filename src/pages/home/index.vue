<template>
	<uni-row class="photograph">
		<view class="content" @click="tosave">
			<img id="cameraimage" :src="this.cameraimg">
		</view>
		<button 
		@click="usealbum"
		style="margin: 50rpx 100rpx; font-size: 110%; background-color: #4F89F1; color: white;"
		>使用本地图片识别</button>
	</uni-row>
</template>

<script>
	export default {
		data() {
			return {
				imagesrc:'',
				cameraimg:'static/icon/camera.png',
				photosrc:''
			}
		},
		onLoad() {

		},
		methods: {
			tosave() {
				uni.chooseImage({
					count:1,
					sourceType:['camera'],
					crop:{
						quality:40
					},
					success:function(res){
						this.imagesrc = JSON.stringify(res.tempFilePaths[0])
						this.imagesrc = 'file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/' + res.tempFilePaths[0].substr(1)
						uni.navigateTo({
							url:`/pages/home/result?imagesrc=${this.imagesrc}&tratype=1`
						})
					}
				})
			},
			usealbum(){
				uni.chooseImage({
					count:1,
					sourceType:['album'],
					sizeType:['original'],
					success:function(res){
						this.imagesrc = JSON.stringify(res.tempFilePaths[0])
						uni.navigateTo({
							url:`/pages/home/result?imagesrc=${this.imagesrc}&tratype=2`
						})
					}
				})
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
