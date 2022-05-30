<template>
  <view class="content">
    <view class="">
      <br>
      <br>
      <br>
      <uni-grid :column="3" :showBorder="false" :square="false">
        <uni-grid-item>
          <uni-icons type="contact" size="90" color="aqua"></uni-icons>
        </uni-grid-item>
        <uni-grid-item>
          <br>
          <view class="">
            <text style="font-size: 30px" class="text">{{ userName }}</text>
          </view>
          <view class="">
            <text style="font-size: 18px" class="text">id：{{ userId }}</text>
          </view>

        </uni-grid-item>
        <uni-grid-item>
          <br>
          <br>
          <br>
          <text class="text">{{ permissionLevel }}级权限</text>
        </uni-grid-item>
      </uni-grid>
    </view>
    <br>
    <view>
      <uni-grid :column="1" :showBorder="false" :square="false">
        <uni-grid-item>
          <view class="vcenter">
            <text class="text">历史记录</text>
          </view>
        </uni-grid-item>

      </uni-grid>
    </view>
    <!--    要把flex写在for外面-->
    <view class="img">
      <view v-for="item in imglist" :key="item.id">
        <image class="innerimage" :src="item.src" mode="aspectFill" @click="previewImage(item.src)"></image>
      </view>
    </view>

    <view>
      <!-- 提示窗示例 -->
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="退出登录" content="确定要退出当前账号吗？"
                          @confirm="dialogConfirm"
                          @close="dialogClose"></uni-popup-dialog>
      </uni-popup>
    </view>

    <view style="height: 100px;">

    </view>


    <view class="bottomview">
      <button class="btn" @click="thisLogout">
        退出登录
      </button>
    </view>


  </view>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  data() {
    return {
      msgType: 'error',
      showripple: false,
      name: 'xiaomei',
      imglist: []
    }
  },
  onShow() {
    this.getImageList()
  },
  computed: {
    ...mapState(['forcedLogin', 'hasLogin', 'userName', 'userId', 'permissionLevel', 'token', 'frontUrl']),

  },
  methods: {
    ...mapMutations(['logout']),
    thisLogout() {
      this.$refs.alertDialog.open()


    },
    dialogClose() {
      // console.log('点击关闭')
    },
    dialogConfirm() {
      // console.log('点击确认')
      this.logout()

      let pages = getCurrentPages();
      let beforePage = pages[pages.length - 2]

      uni.navigateTo({
        url: '/pages/index/index',
      })
    },
    previewImage(src) {
      // console.log('image')
      // console.log(src)
      let array = []
      array.push(src)
      uni.previewImage({
        urls: array,
        current: array[0]
      })
    },
    getImageList() {
      new Promise((resolve, reject) => {
        uni.request({
          url: this.frontUrl + '/imageInfo/imagemanage/list',
          method: 'GET',
          header: {
            'Authorization': this.token
          },
          success: (res) => {
            // console.log('imgdata')
            let list = res.data.rows
            // console.log(res.data.rows[0].imageSrc)
            this.imglist = []
            for (let i = 0; i < list.length; i++) {
              this.imglist.push({
                src: list[i].imageSrc,
                id: i
              })
            }

          }
        })
      })
    }


  }
}
</script>

<style>
/* .content {
  display: flex;
  align-items: center;
  justify-content: center;
} */
.vcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  /*height: 300px;*/
  overflow: auto;

}

.img:after {
  content: none;
  flex: auto;
}

.innerimage {
  margin: 10px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  /*float: left;*/
  height: 150px;
  width: 150px;
  border-radius: 27px;


}

.bottomview {
  width: 100%;
  position: fixed;
  /*bottom: 100px;*/
  text-align: center;
  bottom: calc(var(--window-bottom))
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  color: red;
  background-color: #ffffff;
}

.btn:active {
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 0.7;
}


</style>


