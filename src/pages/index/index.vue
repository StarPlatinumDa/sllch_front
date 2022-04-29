<template>
	<view>
		<div style="height: 10vh;"></div>
		<view id="logo">
			<image id="logo-img" src="../../static/logo2.png"></image>
		</view>
		<div style="height: 10vh;"></div>
		<view id="login">
			<input id="username" class="input-area" placeholder="输入用户名" maxlength=20 />
			<div style="height: 1.5vh;"></div>
			<input id="password" class="input-area" placeholder="输入密码" maxlength=25 password="true"/>
			<!-- <checkbox-gro<!-- up>
				<checkbox id="autologin">自动登录</checkbox>
			</checkbox-group> -->
			<div style="height: 5vh;"></div>
			<button @click="tohome">
				&rarr;
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autologin: false
			}
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
	#logo {
		display: flex;
		justify-content: center;
	}
	#logo-img {
		width: 60%;
		height: 30vw;
	}
	.input-area {
		width: 65%;
		height: 60px;
		margin: auto;
		background-color: #f2f3f7;
		padding: 0px;
		border-radius: 45px;
		text-align: center; 
	}
	
	button {
		height: 80px;
		line-height: 80px;  
		width: 80px;  
		font-size: 1em;
		font-weight: bold;
		border-radius: 50%;
		background-color: #5a9cf8;/* #4CAF50 */
	    color: white;
		text-align: center;
		cursor: pointer;
	}
	
	#autologin {
		margin: auto;
	}
</style>
