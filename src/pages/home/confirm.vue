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
					<text>图片等级</text>
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
					<text 
					style="font-size: 50%; color: #D8D8D8;"
					>(删除标签请点击标签)</text>
					<uni-icons 
					type="plusempty" 
					size="20"
					style="margin-left: 250rpx;"
					@click="addcomment"
					></uni-icons>
					<uni-popup ref="addlabel" type="dialog">
						<uni-popup-dialog 
						mode="input" 
						title="标签信息" 
						confirmText="添加标签"
						cancelText="返回"
						:duration="2000" 
						@close="closecomment" 
						@confirm="addlabel"
						></uni-popup-dialog>
					</uni-popup>
				</uni-col>
			</uni-row>
			<div style="height: 1vh;"></div>
			<uni-row>
				<!-- <uni-col :offset="2">
					<uni-easyinput 
					v-model="comment" 
					placeholder="可为空"
					style="width: 85vw;"></uni-easyinput>
				</uni-col> -->
			</uni-row>
			<uni-row style="margin: 0 70rpx;">
				<uni-col :span="5"
					v-for="(item, index) in this.comment">
					<uni-tag 
					:text="item" 
					type="primary" 
					:circle="true"
					@click="cancellabel(item)"></uni-tag>
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
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message type="error" message="提交失败,请检查网络设置" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
	  mapState
	} from 'vuex'
	export default {
		data() {
			return {
				level: 1,
				location: "",
				comment: [],
				range: [{"value": 1,"text": "1级图片"},{"value": 2,"text": "2级图片"},{"value": 3,"text": "3级图片"}],
				imagesrc: "",
				damageType: 6,
			}
		},
		computed: {
		  ...mapState(['forcedLogin', 'hasLogin', 'userName', 'userId', 'token', 'permissionLevel', 'frontUrl'])
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
				let that = this;
				uni.uploadFile({
					url: that.frontUrl + '/common/upload',
					header: {
					  'Authorization': that.token,
					  'Context-Type': "multipart/form-data"
					},
					filePath: that.imagesrc,
					name: "file",
					success: (res) => {
						let imageurl = JSON.parse(res.data).url;
						uni.request({
							url: that.frontUrl + '/imageInfo/imagemanage',
							method: 'POST',
							header: {
							  'Authorization': that.token,
							},
							data: {
								"imagePerlevel": that.level,
								"imageRemarks": that.comment.join('|'),
								"imageShotplace": that.location,
								"imageSrc": imageurl,
								"imageIsdelete": 0,
								"imageCreatetime": new Date(),
								"userId": that.userId,
								"imageTypeid": that.damageType,
							},
							fail: (res) => {
								that.$refs.message.open();
							}
						})
					},
					fail: (res) => {
						that.$refs.message.open();
					}
				})
				console.log(this.level + this.location + this.comment);
			},
			submit() {
				this.$refs.popup.open();
			},
			addcomment(){
				this.$refs.addlabel.open();	
			},
			closecomment(){
				this.$refs.addlabel.close();	
			},
			addlabel(value){
				this.comment.push(value);
			},
			cancellabel(value){
				const index = this.comment.indexOf(value);
				if(index != -1){
					this.comment.splice(index, 1);
				}
			}
		}
	}
</script>

<style>

</style>
