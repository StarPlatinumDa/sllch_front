<template>
	<!-- 组件整体 -->
		<view class="select">
			<!-- 组件头部 -->
			<view class="select_header" @click="showDownMenu">
				<!-- 提示文字部分 -->
				<text class="select_text">{{this.option}}</text>
				<!-- 图标 -->
				<uni-icons class="select_drop" type="bottom" size="30"></uni-icons>
			</view>
			<!-- 下拉显示区域 -->
			<view class="select_contents" v-show="showMenu">
				<view 
				class="select_constent"
				v-for="(item, index) in list"
				@click="selectChonice(list[index])">
					<text class="select_text" >{{list[index].label}}</text>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		props: ['choiceList', 'choiceIndex'],
		data(){
	  			return{
	  				showMenu:false,
					list:this.choiceList,
					option:this.choiceIndex
	  			}
	  		},
	  		methods:{
				showDownMenu: function (){
					this.showMenu = !this.showMenu
				},
				selectChonice: function(list) {
					console.log(list)
					this.option = list.label;
					this.showMenu = false;
					this.$emit("returnDat", list.label);
				},
	  		},
	}
</script>

<style>
.select{
	width: 100%;
	height: 100%;
	text-align: center;
}
.select_header{
	width: 100%;
	padding: 0 0 5rpx 0;
	border-radius: 10rpx;
	border: 1rpx solid #e9e9eb;
}
.select_drop{
	float: right;
}
.select_contents{
	padding: 10rpx 0;
	border: 1rpx solid #e9e9eb;
	border-radius:10rpx;
	background: white;
	width: 48%;
	z-index: 2;
	text-align: center;
	display: block;
	position: absolute;
}
.select_constent{
	border-bottom: 1rpx solid #e9e9eb;
}
.select_choseText{
	background-color: #e9e9eb;
}
</style>