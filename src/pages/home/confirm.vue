<template>
	<view>
		<view class="picture">
			<img
			style=" width: 100%;height:480rpx;padding: 0px;"
			:src="this.imagesrc" 
			alt="无法显示图片">
		</view>
		<view>
			<uni-row>
				<uni-col :offset="2">
					<text>病害等级</text>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :offset="2">
					<uni-data-checkbox v-model="level" :localdata="range"></uni-data-checkbox>
				</uni-col>
			</uni-row>
			<div style="height: 1vh;"></div>
			<uni-row>
				<uni-col :offset="2">
					<text>桥梁位置</text>
				</uni-col>
			</uni-row>
			<div style="height: 1vh;"></div>
			<uni-row>
				<uni-col :offset="2">
					<uni-easyinput
					suffixIcon="location-filled"  
					v-model="location" 
					placeholder="点击右侧图标可自动获取位置信息" 
					@iconClick="clickicon"
					style="width: 85vw;"></uni-easyinput>
				</uni-col>
			</uni-row>
			<div style="height: 2vh;"></div>
			<uni-row>
				<uni-col :offset="2">
					<text>备注信息</text>
				</uni-col>
			</uni-row>
			<div style="height: 1vh;"></div>
			<uni-row>
				<uni-col :offset="2">
					<uni-easyinput 
					v-model="comment" 
					placeholder="可为空"
					style="width: 85vw;"></uni-easyinput>
				</uni-col>
			</uni-row>
			<div style="height: 2vh;"></div>
			<uni-row>
				<uni-col :offset="2">
					<button type="primary" style="width: 85vw; margin: 0" @click="submit">确认提交</button>
				</uni-col>
			</uni-row>
		</view>
		<view>
			<uni-popup ref="popup" type="dialog">
				<uni-popup-dialog 
				ref="dialog"  
				type="warn"
				title="确认添加吗？" 
				content="添加后将无法自行修改!"
				confirmText="添加"
				cancelText="取消"
				@confirm="dialogConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uploadImage from "../../js_sdk/yushijie-ossutil/ossutil/uploadFile.js"
	export default {
		data() {
			return {
				level: 1,
				location: "",
				comment: "",
				range: [{"value": 1,"text": "1级病害"},{"value": 2,"text": "2级病害"},{"value": 3,"text": "3级病害"}],
				imagesrc: ""
			}
		},
		onLoad(option) {
			this.imagesrc = option.imagesrc;
		},
		methods: {
			clickicon() {
				console.log('clickon');
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function (res) {
						// console.log(res.address['provice'])
						that.location = res.address['city'] 
										+ res.address['district']
										+ res.address['street']
										+ res.address['streetNum'];
					}
				});
			},
			dialogConfirm() {				
				uploadImage('../../static/logo.png', 'images/',
				result => {
					console.log("it's ok!");
				},
				result => {
					console.log("it's fail!");
				})
				console.log(this.level + this.location + this.comment);
			},
			submit() {
				this.$refs.popup.open();
			}
		}
	}
</script>

<style>

</style>
