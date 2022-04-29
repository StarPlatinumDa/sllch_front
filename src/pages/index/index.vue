<template>
  <view class="content">
    <view>
      <text>登陆页面</text>
      <el-row>
        <el-button type="primary" v-on:click="tohome">跳转到首页</el-button>
      </el-row>
      <h1>{{ userName }}</h1>
    </view>
  </view>
</template>

<script>
import {
  mapState
} from 'vuex'
// import store from "@/store/index";

export default {
  data() {
    return {
      test: 'aaa'
    }
  },
  computed: {
    ...mapState([
      'forcedLogin',
      'hasLogin',
      'userName',//映射 this.userName 为 store.state.userName
      'userId',
    ]),
  },
  onLoad() {
    if (!this.hasLogin) {
      uni.showModal({
        title: '未登录',
        content: '您未登录，需要登录后才能继续',
        showCancel: !this.forcedLogin,
        success: (result => {
          if (result.confirm) {
            if (this.forcedLogin) {
              uni.reLaunch({
                url: '/pages/index/index'
              })
            } else {
              uni.navigateTo({
                url: '/pages/index/index'
              })
            }
          }
        })
      })
    }
  },
  methods: {
    tohome: function () {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }
  }
}
</script>

<style>
</style>
