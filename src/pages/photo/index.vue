<template>
	<view class="content">
		<view style="margin-top: 60rpx; padding: 20rpx;">
			<uni-row class="demo-uni-row" gutter=20>
				<uni-col :span="20">
					<uni-easyinput 
					v-model="input" 
					placeholder="请输入检索文本" />
				</uni-col>
				<uni-col :span="4">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>
			<uni-row class="demo-uni-row">
				<uni-col :span="12">
					<view class="demo-uni-col dark"></view>
				</uni-col> 
				<uni-col :span="12">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>
			<uni-row class="demo-uni-row">
				<uni-col :span="12">
					<view class="demo-uni-col dark"></view>
				</uni-col>
				<uni-col :span="12">
					<view class="demo-uni-col light"></view>
				</uni-col>
			</uni-row>
			<uni-row class="demo-uni-row">
				<uni-col :span="24">
					<button type="primary">搜索</button>
				</uni-col>
			</uni-row>
		</view>
		<view id='imgs'>
			<img 
			  style=" width: 32%;height: 130px;padding: 2px;"
			  v-for="composingImg in composingImgs" 
			  :src="composingImg.image_src"
			  v-on:click="toPictureDetail(composingImg)"
			  alt="无法显示图片">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				input:'',
				types: [{
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
				type: '',
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
				level:'',
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
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/3.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/10.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/13.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/2.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/10.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/13.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/3.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'无',
					user_id:1
				},{
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
		methods: {
	
		}
	}
</script>

<style>
	.demo-uni-row {
		margin-bottom: 10px;
		/* QQ、字节小程序文档写有 :host，但实测不生效 */
		/* 百度小程序没有 :host，需要设置block */
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}
	
	/* 支付宝小程序没有 demo-uni-row 层级 */
	/* 微信小程序使用了虚拟化节点，没有 demo-uni-row 层级 */
	/* #ifdef MP-ALIPAY || MP-WEIXIN */
	/deep/ .uni-row {
		margin-bottom: 10px;
	}
	/* #endif */
	
	.demo-uni-col {
		height: 36px;
		border-radius: 4px;
	}
	
	.dark_deep {
		background-color: #99a9bf;
	}
	
	.dark {
		background-color: #d3dce6;
	}
	
	.light {
		background-color: #e5e9f2;
	}
</style>
