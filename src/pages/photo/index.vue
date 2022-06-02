<template>
	<view class="content">
		<view style="margin-top: 60rpx; padding: 30rpx;">
			<uni-row class="demo-uni-row" :gutter="20">
				<uni-col :span="21">
					<uni-easyinput 
					prefixIcon="search"
					@iconClick="searching"
					v-model="query"
					@confirm="searching"
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
				<uni-col :span="24">
					<view class="example-body">
						<uni-datetime-picker 
						type="date" 
						:clear-icon="false" 
						v-model="beginTime"
						@change="returnTime"/>
					</view>
				</uni-col>
			</uni-row>
			<uni-grid
			v-show="!isLoading"
			 :column="3" ref='imgs' 
			 :showBorder="false" 
			 :square="false">
				<img
					style="width: 32.2%; padding: 5rpx;"
					v-for="(composingImg, index) in composingImgs" 
					:src="composingImg.imageSrc"
					ref="img"
					v-on:click="toPictureDetail(composingImg)"
					alt="无法显示图片" />
			</uni-grid>
			<img 
			v-show="isLoading"
			:src="this.loadingImg" 
			alt="加载icon未实现"
			style="width: 100%; height: 40%;"
			>
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
				isLoading: false,
				loadingImg:'static/img/loading.gif',
				defaultType:'病害类型',
				diseaseType: [{
				  value: '病害类型',
				  label: '全部类型'
				},{
				  value: 2,
				  label: '脱落'
				}, {
				  value: 3,
				  label: '露筋'
				}, {
				  value: 4,
				  label: '渗水'
				}],
				defaultLevel: '图片等级',
				levels: [{
					value: '图片等级' ,
					label: '所有可见等级'
				},{
					value: 1 ,
					label: '等级1'
				},{
					value: 2,
					label: '等级2'
				},{
					value: 3,
					label: '等级3'
				}],
				beginTime:'',
				endTime:'',
				composingImgs:[],
				imagesrc:'',
				data:{}
			}
		},
		onShow() {
			this.defaultType = '病害类型',
			this.defaultLevel = '图片等级',
			this.beginTime = '',
			this.getimagebyback();
		},
		computed: {
			...mapState(['userId', 'token', 'frontUrl', 'classificationUrl'])
		},
		methods: {
			formatDate:(date) => {
			date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Data();
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			return y + '-' + m + '-' + d;
			},
			getimagebyback:function(){
				uni.request({
					url:this.frontUrl + '/imageInfo/imagemanage/list',
					data:this.data,
					method:'GET',
					header: {
						'Authorization': this.token
					},
					success:(res) =>{
						this.composingImgs = res.data.rows
					}
				})
			},
			toPictureDetail: function(composingImg) {
				uni.navigateTo({
					url:'/pages/photo/imgdetail?imgdtail='+JSON.stringify(composingImg)
				})
			},
			getimagebycontent(){
				this.data = {
					imageTypeid: this.defaultType == '病害类型'? null: this.defaultType,
					imageCreatetime: this.beginTime,
					imagePerlevel: this.defaultLevel == '图片等级'? null : this.defaultLevel
				}
				console.log(this.data)
				this.getimagebyback()
			},
			returnTime(val){
				this.beginTime = val;
				this.getimagebycontent();
			},
			returnType(val){
				console.log(val)
				this.defaultType = val;
				this.getimagebycontent();
			},
			returnLevel(val){
				this.defaultLevel = val;
				this.getimagebycontent();
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
				    }
				})
			},
			searchimgbyimg() {
				uni.chooseImage({
					count:1,
					sourceType:['album'],
					sizeType:['original'],
					success:(res) => {
						this.isLoading = true;
						this.imagesrc = JSON.stringify(res.tempFilePaths[0]);
						let n = this.imagesrc.length
						this.imagesrc = this.imagesrc.substr(1, n - 2)
						uni.uploadFile({
						  url: this.classificationUrl + '/getimage',
						  header: {
						    'Context-Type': "multipart/form-data"
						  },
						  filePath: this.imagesrc,
						  name: "img",
						  success: ((res) => {
							res = JSON.parse(res.data)
							this.composingImgs = []
							res.forEach((imageinfo) =>{
								this.composingImgs.push({
									imageId: imageinfo[0],
									imageTypeid: imageinfo[1],
									imageSrc: imageinfo[2],
									imageCreatetime: this.formatDate(imageinfo[3]),
									imageShotplace: imageinfo[4],
									imagePerlevel: imageinfo[5],
									imageRemarks: imageinfo[7],
									userId:imageinfo[8]
								})
							})
						  }),
						  fail:(res)=>{
							console.log(res)
						  },
						  complete:()=>{
							  this.isLoading = false;
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
