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
      <uni-grid :column="2" :showBorder="false" :square="false">
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
        <image class="innerimage" :src="item.src"></image>
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


    <view class="bottomview">
      <button class="btn" @click="logout">
        <!--        <span id="ripple" ref="ripple" :style="showripple ? '' : 'display:none;'"></span>-->
        退出登录
      </button>
      <!--      <a href="javascript:void(0)" onclick="logout()">修改</a>-->
      <!--      <text class="btn" onclick="logout()">退出登录</text>-->
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
      msgType: 'error',
      showripple: false,
      name: 'xiaomei',
      imglist: [{
        'src': '../../static/logo2.png',
        'id': 1
      }, {
        'src': '../../static/logo2.png',
        'id': 2
      }, {
        'src': '../../static/logo2.png',
        'id': 3
      }, {
        'src': '../../static/logo2.png',
        'id': 4
      }]
    }
  },
  onLoad() {

  },
  computed: {
    ...mapState(['forcedLogin', 'hasLogin', 'userName', 'userId', 'password', 'permissionLevel']),

  },
  methods: {
    logout() {
      // console.log(e)
      // let x = e.target.x
      // let y = e.target.y
      // this.$refs.ripple.style.left = x + 'px'
      // this.$refs.ripple.style.top = y + 'px'
      // // console.log(this.$refs.ripple.style.left)
      // this.showripple = true

      // this.msgType = type
      this.$refs.alertDialog.open()


    },
    dialogClose() {
      console.log('点击关闭')
    },
    dialogConfirm() {
      console.log('点击确认')
      uni.navigateTo({
        url: '/pages/index/index'
      })
      // this.messageText = `点击确认了 ${this.msgType} 窗口`
      // this.$refs.message.open()
    },
    // start() {
    //   console.log('wcnm')
    // },
    // end() {
    //   console.log('我服了')
    // }

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
}

.innerimage {
  height: 100px;
  width: 150px;
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


