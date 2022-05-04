<template>
	<view>
		<img :src="this.imagesrc" alt="无法显示图片">
		<button @click="looksrc">查看图片地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imagesrc: ''
			}
		},
		onLoad:function(option){
			let n = option.imagesrc.length;
			this.imagesrc = option.imagesrc.substr(1, n-2);
			console.log(this.imagesrc)
		},
		methods: {
			looksrc(){
				console.log(this.imagesrc, n)
			}
		}
	}
</script>

<style>

</style>
