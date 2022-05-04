<template>
	<view >
		<img src="/static/img/404.png" alt="">
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(){
			console.log('wc?')
			let timer = setTimeout(()=>{
				clearTimeout(timer)
				uni.navigateTo({
					// 不在pages.json中需要再最前面加上/
					url:'/pages/index/index'
				})
				console.log('wcaaaaa?')
				
			},2100)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
