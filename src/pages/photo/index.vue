<template>
	<view class="content">
		<view style="margin-top: 60rpx; padding: 30rpx;">
			<uni-row class="demo-uni-row" :gutter="20">
				<uni-col :span="21">
					<uni-easyinput 
					prefixIcon="search"
					@iconClick="searching"
					v-model="input" 
					placeholder="请输入检索文本" />
				</uni-col>
				<uni-col :span="3">
					<uni-icons type="image" size="40"></uni-icons>
				</uni-col>
			</uni-row>
			<uni-row class="demo-uni-row" :gutter="20">
				<uni-col :span="12">
					<drap-box
					:choiceIndex="defaultType"
					:choiceList="diseaseType"
					@returnDat='returnType'
					></drap-box>
				</uni-col> 
				<uni-col :span="12">
					<drap-box
					:choiceIndex = "defaultLevel"
					:choiceList="levels"
					@returnDat='returnLevel'
					></drap-box>
				</uni-col>
			</uni-row>
			<uni-row class="demo-uni-row" :gutter="20">
				<uni-col :span="11">
					<view class="example-body">
						<uni-datetime-picker type="date" :clear-icon="false" v-model="beginTime" />
					</view>
				</uni-col>
				<uni-col :span="2"> — </uni-col>
				<uni-col :span="11">
					<view class="example-body">
						<uni-datetime-picker type="date" :clear-icon="false" v-model="endTime" />
					</view>
				</uni-col>
			</uni-row>
			<uni-grid :column="3" ref='imgs' :showBorder="false" :square="false">
				<img
					style="width: 32%;"
					v-for="(composingImg, index) in composingImgs" 
					:src="composingImg.image_src"
					ref="img"
					v-on:click="toPictureDetail(composingImg)"
					alt="无法显示图片" />
			</uni-grid>
		</view>
	</view>
</template>

<script>
	import drapBox from '@/components/drap-box/drap-box.vue';
	export default {
		components:{
			drapBox
		},
		data() {
			return {
				input:'',
				defaultType:'病害类型',
				diseaseType: [{
				  value: '裂缝',
				  label: '裂缝'
				}, {
				  value: '脱落',
				  label: '脱落'
				}, {
				  value: '露筋',
				  label: '露筋'
				}, {
				  value: '渗水',
				  label: '渗水'
				}],
				defaultLevel: '图片等级',
				levels: [{
					value: 1 ,
					label: '等级1'
				},{
					value: 2,
					label: '等级2'
				},{
					value: 3,
					label: '等级3'
				},{
					value: 4,
					label: '等级4'
				}],
				beginTime:'',
				endTime:'',
				composingImgs:[{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/2.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				}, {
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/2.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				}, {
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/2.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				}, {
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/2.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				}],
				
			}
		},
		onLoad() {
			
		},
		onReady() {
			for (let i=0; i<this.$refs['img'].length; i++) {
				let mr = '2%'
				if ((i + 1) % 3 === 0) {
					mr = '0'
				}
				this.$refs['img'][i].style.marginRight = mr
				this.$refs['img'][i].style.marginTop = '10px'
			}
		},
		methods: {
			toPictureDetail: function(composingImg) {
				uni.navigateTo({
					url:`/pages/photo/imgdetail?imgdtail=${composingImg}`
				})
			},
			returnType(val){
				this.defaultType = val
			},
			returnLevel(val){
				this.defaultLevel = val
			},
			searching(){
				console.log(this.input, this.defaultType, this.defaultLevel, this.beginTime, this.endTime)
			}
		}
	}
</script>

<style>
	.demo-uni-row {
		margin-bottom: 10px;
		display: block;
	}
	
	/deep/ .uni-row {
		margin-bottom: 10px;
	}
</style>
