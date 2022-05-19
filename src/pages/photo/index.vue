<template>
	<view class="content">
		<view style="margin-top: 60rpx; padding: 30rpx;">
			<uni-row class="demo-uni-row" :gutter="20">
				<uni-col :span="21">
					<uni-easyinput 
					prefixIcon="search"
					@iconClick="searching"
					v-model="query" 
					placeholder="请输入检索文本" />
				</uni-col>
				<uni-col :span="3">
					<uni-icons 
					type="image" 
					size="40"
					@click="searchimgbyimg"></uni-icons>
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
					style="width: 32.2%; padding: 5rpx;"
					v-for="(composingImg, index) in composingImgs" 
					:src="composingImg.imageSrc"
					ref="img"
					v-on:click="toPictureDetail(composingImg)"
					alt="无法显示图片" />
			</uni-grid>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import drapBox from '@/components/drap-box/drap-box.vue';
	
	export default {
		components:{
			drapBox
		},
		data() {
			return {
				query: '',
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
				composingImgs:[],
				imagesrc:''
			}
		},
		onLoad() {
			uni.request({
				url:this.frontUrl + '/imageInfo/imagemanage/list',
				method:'GET',
				header: {
					'Authorization': this.token
				},
				success:(res) =>{
					this.composingImgs = res.data.rows
					console.log(this.composingImgs)
				}
			})
		},
		onReady() {
			this.setImages()
		},
		computed: {
			...mapState(['userId', 'token', 'frontUrl'])
		},
		methods: {
			toPictureDetail: function(composingImg) {
				uni.navigateTo({
					url:'/pages/photo/imgdetail?imgdtail='+JSON.stringify(composingImg)
				})
			},
			returnType(val){
				this.defaultType = val;
			},
			returnLevel(val){
				this.defaultLevel = val;
			},
			searching(){
				let url = this.frontUrl + `/imageInfo/imagemanage/getImageByText/${this.userId}?` +
					`level=&query=${this.query}&beginTime=${this.beginTime}&endTime=${this.endTime}`
				uni.request({
				    url: url,
				    method: 'GET',
				    header: {
						'Authorization': this.token
				    },
				    success: (res) => {
						let data = res.data
						this.composingImgs = data.data
						this.setImages()
				    }
				})
			},
			setImages() {
			},
			searchimgbyimg() {
				uni.chooseImage({
					count:1,
					sourceType:['album'],
					crop:{
						quality:40
					},
					success:(res) => {
						let imagesrc = JSON.stringify(res.tempFilePaths[0]);
						let n = imagesrc.length
						imagesrc = imagesrc.substr(1, n - 2);
						console.log(imagesrc)
						uni.uploadFile({
						  url: 'http://127.0.0.1:5000/getimage',
						  header: {
						    'Context-Type': "multipart/form-data"
						  },
						  filePath: imagesrc,
						  name: "img",
						  success: ((res) => {
						    console.log(res)
						  }),
						  fail:(res)=>{
							console.log(res)
						  }
						})
					}
				})
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
