<template>
  <view>
    <div style="height: 10vh;"></div>
    <view id="logo">
      <image id="logo-img" src="../../static/logo2.png"></image>
    </view>

    <p style="text-align: center;color: red">基于深度学习的混凝土</p>
    <p style="text-align: center">桥梁表观病害图像分类检索工具</p>

    <div style="height: 10vh;"></div>
    <view id="login">
      <input v-model="account" id="username" class="input-area" placeholder="输入用户名" maxlength=20/>
      <div style="height: 1.5vh;"></div>
      <input v-model="curpass" id="password" class="input-area" placeholder="输入密码" maxlength=25 password="true"/>
      <!-- <checkbox-group>
        <checkbox id="autologin">自动登录</checkbox>
      </checkbox-group> -->
      <div style="height: 5vh;"></div>

      <button @click="checkPass" v-bind:disabled="isLogin">
        &rarr;
      </button>

    </view>

    <view>
      <!-- 提示信息弹窗 -->
      <uni-popup style="top:30px" ref="message" type="message">
        <uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
      </uni-popup>
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
      autologin: false,
      account: '',
      curpass: '',
      msgType: 'success',
      messageText: '这是一条成功提示',
      temptoken: ''
    }
  },
  onShow() {

    this.account = ''
    this.curpass = ''
    if (!this.hasLogin && !this.firstLogin) {
      uni.showModal({
        title: '未登录',
        content: '您未登录，需要登陆后才能继续',
        showCancel: !this.forcedLogin,
      })
    } else if (this.hasLogin) {
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/user/index'
        })
      }, 1000)

    }
  },
  computed: {
    ...mapState(['forcedLogin', 'hasLogin', 'userName', 'userId', 'token', 'permissionLevel', 'frontUrl', 'firstLogin']),
    isLogin() {
      let flag = true
      if (this.account && this.curpass) {
        flag = false
      }
      return flag
    }
  },
  methods: {
    ...mapMutations(['login']),
    tohome: function () {
      uni.switchTab({
        url: '/pages/user/index'
      })
    },
    checkPass() {
      if (this.account && this.curpass) {
        let temp = {
          "userName": this.account,
          "passWord": this.curpass
        }
        new Promise((resolve) => {
          //请求登陆
          uni.request({
            url: this.frontUrl + '/mobilelogin',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: temp,
            success: (res) => {
              // console.log(res.data)
              if (res.data.code == 200) {
                // console.log(res.data.token)
                this.msgType = 'success'
                this.messageText = `登陆成功！`
                this.$refs.message.open()

                this.temptoken = res.data.token
                // this.login({
                //   'userName': '小美',
                //   'userId': this.account,
                //   'token': res.data.token
                // })
                uni.setStorage({
                  key: 'token',
                  data: res.data.token
                })
                // console.log('起飞！')
                resolve()
              } else {
                uni.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
                // resolve()
              }
            }
          })

        }).then((res) => {
          //获取登陆信息
          uni.request({
            url: this.frontUrl + '/system/user/profile',
            method: 'GET',
            header: {
              'Authorization': this.temptoken
            },
            success: (res) => {
              let data = res.data.data
              this.login({
                'userName': data.nickName,
                'userId': data.userId,
                'token': this.temptoken,
                'permissionLevel': data.imgPerlevel
              })
              let timer = setTimeout(() => {
                this.tohome()
                clearInterval(timer)
              }, 1000)
            }
          })
        })


      } else {
        uni.showModal({
          title: '登陆失败',
          content: '账号或密码错误，请重新输入。',
          showCancel: false,

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
