<template>
  <view style="text-align: center;">
    <img
        class="image"
        :src="this.imagesrc"
        alt=""
    >
    <view class="">
      <text style="float: left; margin: 0 30rpx;">识别结果：</text>
      <text>{{ this.diseasetype }}</text>
    </view>
	<img
	v-show = "isLoading"
	class="image"
	:src="this.loadingImg" 
	alt="加载图片加载失败">
    <img
		v-show = "!isLoading"
        class="image"
        :src="this.predictImgUrl"
        alt="图片加载失败"
        @click="previewImage(this.predictImgUrl)"
    >
    <uni-row
        class=" demo-uni-row"
        :gutter="50"
        style="margin: 190rpx 0 0 0;"
    >
      <uni-col :span="15">
        <button
            style="background-color: #4F89F1; color: white; font-size: 110%;"
            @click="toconfirm"
        >上传图片
        </button>
      </uni-col>
      <uni-col :span="9">
        <button
            style="background-color: #F14F4F; color: white; font-size: 110%;"
            @click="backtohome"
        >返回
        </button>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import {
  mapState
} from 'vuex'
import { translateapp } from '../../static/compress.js'
export default {
  data() {
    return {
		disType: {
			"裂缝":1,
			'剥落':2,
			"露筋":3,
			"渗水":4,
			"正在识别中……":6,
		},
        imagesrc: '',
		isLoading: true,
		loadingImg: 'static/img/loading.gif',
		swinImagesrc:'',
        predictImgUrl: '',
        diseasetype: '正在识别中……',
        detectionLabel: ''
    }
  },
  computed: {
    ...mapState(['classificationUrl', 'detectionUrl'])
  },
  onLoad(option) {
    let n = option.imagesrc.length;
    if (option.tratype == 1)
      this.imagesrc = option.imagesrc;
    else
      this.imagesrc = option.imagesrc.substr(1, n - 2);
	 this.preImage();
	this.classificationImage();
  },
  methods: {
    toconfirm() {
      uni.navigateTo({
        url: `/pages/home/confirm?imagesrc=${this.imagesrc}&damageType=${this.disType[this.diseasetype]}`
      })
    },
    backtohome() {
      uni.switchTab({
        url: '/pages/home/index'
      })
    },
    //  图像识别模块
    preImage() {
		console.log(this.imagesrc)
		console.log(this.detectionUrl + '/swinimg')
      uni.uploadFile({
        url: this.detectionUrl + '/swinimg',
        header: {
          'Context-Type': "multipart/form-data"
        },
        filePath: this.imagesrc,
        name: "img",
        success: (result => {
          let data = JSON.parse(result.data)
          this.detectionLabel = data.label
          console.log(data.label[0])
          this.predictImgUrl = 'data:image/jpeg;base64,' + data.img
        }),
		complete:()=>{
		  this.isLoading = false;
		}
      })
    },
	// 图像分类模块
	classificationImage() {
		uni.uploadFile({
		  url: this.classificationUrl + '/classification',
		  header: {
		    'Context-Type': "multipart/form-data"
		  },
		  filePath: this.imagesrc,
		  name: "img",
		  success: (result => {
		    let data = JSON.parse(result.data)
		    this.diseasetype = data.label
		    console.log(data.label)
		  })
		})
	},
    previewImage(src) {
      console.log('image')
      console.log(src)
      let array = []
      array.push(src)
      uni.previewImage({
        urls: array,
        current: array[0]
      })
    },
  }
}
</script>

<style>
.image {
  width: 95%;
  height: 500 rpx;
  margin: 30 rpx 0;
  border-radius: 20 rpx;
}

</style>
