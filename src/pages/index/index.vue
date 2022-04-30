<template>
  <view>
    <div style="height: 10vh;"></div>
    <view id="logo">
      <image id="logo-img" src="../../static/logo2.png"></image>
    </view>
    <div style="height: 10vh;"></div>
    <view id="login">
      <input v-model="name" id="username" class="input-area" placeholder="输入用户名" maxlength=20/>
      <div style="height: 1.5vh;"></div>
      <input v-model="curpass" id="password" class="input-area" placeholder="输入密码" maxlength=25 password="true"/>
      <!-- <checkbox-group>
        <checkbox id="autologin">自动登录</checkbox>
      </checkbox-group> -->
      <div style="height: 5vh;"></div>
      <button @click="tohome">
        &rarr;
      </button>
      <button @click="checkPass" v-bind:disabled="isLogin">
        &rarr;
      </button>
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
      autologin: false,
      name: '',
      curpass: '',
    }
  },
  onLoad() {
    // if (!this.hasLogin) {
    //   uni.showModal({
    //     title: '未登录',
    //     content: '您未登录，需要登陆后才能继续',
    //     showCancel: !this.forcedLogin,
    //     success: (result => {
    //       if (result.confirm) {
    //         if (this.forcedLogin) {
    //           uni.reLaunch({
    //             url: '/pages/index/index'
    //           })
    //         } else {
    //           uni.navigateTo({
    //             url: '/pages/index/index'
    //           })
    //         }
    //       }
    //     })
    //   })
    // }
  },
  computed: {
    ...mapState(['forcedLogin', 'hasLogin', 'userName', 'userId', 'password']),
    isLogin() {
      let flag = true
      if (this.name && this.curpass) {
        flag = false
      }
      return flag
    }
  },
  methods: {
    tohome: function () {
      uni.switchTab({
        url: '/pages/home/index'
      })
    },
    checkPass() {
      if (this.name === this.userName && this.curpass === this.password) {
        this.$message({
          message: '登陆成功！',
          type: 'success'
        })
        this.tohome()
      } else {
        uni.showModal({
          title: '登陆失败',
          content: '账号或密码错误，请重新输入。',
          showCancel: false,
          // success: (result => {
          //   console.log(result)
          // })
        })

      }

    }
  }
}
</script>

<style>
#logo {
  display: flex;
  justify-content: center;
}

#logo-img {
  width: 60%;
  height: 30vw;
}

.input-area {
  width: 65%;
  height: 60px;
  margin: auto;
  background-color: #f2f3f7;
  padding: 0;
  border-radius: 45px;
  text-align: center;
}

button {
  height: 80px;
  line-height: 80px;
  width: 80px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 50%;
  background-color: #5a9cf8; /* #4CAF50 */
  color: white;
  text-align: center;
  cursor: pointer;
}

/*#autologin {*/
/*  margin: auto;*/
/*}*/
</style>
