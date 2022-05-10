<script>
import {mapMutations} from "vuex";

export default {
  methods: {
    ...mapMutations(['login'])
  },
  onLaunch: function () {
    const that = this;
    uni.getSystemInfo({
    	success(res) {
    		that.globalData.statusBarHeight = res.statusBarHeight;
    	}
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  onPageNotFound() {
    uni.navigateTo({
      url: 'pages/404/404'
    })
  },
  globalData:{
  	statusBarHeight:'',//手机顶部状态栏高度
  }
}
</script>

<style>
/*每个页面公共css */
	page {
		height: 100%;
	}
</style>
