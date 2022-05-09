<template>
	<view class="example-body">
		<uni-row class="demo-uni-row">
				<view class="picture">
					<img
					style=" width: 100%;height:480rpx;padding: 0px;"
					:src="this.imgdtail.image_src" 
					alt="无法显示图片">
				</view>
		</uni-row>

		<uni-row 
		class="demo-uni-row"
		style="text-align: center;"
		>
			<uni-col :span="6" class="card">
				<uni-row>
					<text class="value">{{this.imgdtail.image_typeid}}</text>
				</uni-row>
				<uni-row>
					<text class="key">病害类型</text>
				</uni-row>
				
			</uni-col >
			<uni-col :span="6" class="card">
				<uni-row>
					<text class="value">1级图片</text>
				</uni-row>
				<uni-row>
					<text class="key">图片等级</text>
				</uni-row>
			</uni-col>
			<uni-col :span="10" class="card">
				<uni-row>
					<text class="value">{{this.imgdtail.image_createtime}}</text>
				</uni-row>
				<uni-row>
					<text class="key">拍摄时间</text>
				</uni-row>
			</uni-col>
		</uni-row>

		<uni-row class="demo-uni-row">
			<uni-col>
				<uni-row>
					桥梁位置:
				</uni-row>
				<uni-row>
					<uni-col :offset="2">
						{{this.imgdtail.image_shotplace}}
					</uni-col>
				</uni-row>
			</uni-col>
		</uni-row>

		<uni-row class="demo-uni-row">
			<uni-col>
				<uni-row class="">
					拍摄人员:
				</uni-row>
				<uni-row>
					<uni-col :offset="2">
						{{this.imgdtail.user_id}}
					</uni-col>
				</uni-row>
			</uni-col>
		</uni-row>

		<uni-row class="demo-uni-row">
			<uni-col>
				<uni-row>
					备注信息:
				</uni-row>
				<uni-row>
					<uni-col :span="2"></uni-col>
					<uni-col :span="4"
					v-for="(item, index) in this.imgdtail.remarklist">
						<uni-tag :text="item" type="primary" :circle="true"></uni-tag>
					</uni-col>
				</uni-row>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gutter: 0,
				imgdtail:{
					image_id:1,
					image_typeid:1,
					image_src:'static/composing/2.jpg',
					image_createtime:'2022-11-01',
					image_isdelete:1,
					image_remarks:'渗水|漏水|渗漏',
					user_id:1,
					image_shotplace:"重庆市渝北区"
				}
			}
		},
		onLoad(option) {
			console.log(option)
			this.imgdtail.remarklist = this.imgdtail.image_remarks.split('|')
			// this.imgdtail = option.imgdtail
			// console.log(this.imgdtail)
			console.log(this.imgdtail.remarklist)
		},
		methods: {
			
		}
	}
</script>

<style>
	.demo-uni-row {
		margin-bottom: 50rpx;
	}
	.demo-uni-col {
		height: 36px;
		border-radius: 5px;
	}

	.card {
		background-color: #D8D8D8;
		border-radius: 5%;
		margin: 0 10rpx;
	}
	
	.value{
		font-size: 120%;
	}
	
	.key{
		font-size: 70%;
		opacity: 0.5;
	}
</style>
