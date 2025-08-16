<template>
	<view>
		<z-nav-bar backState="2000" title="订单"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
	</view>
</template>

<script>
import { judgeLogin } from '@/config/login';
export default {
	data() {
		return {
			
		};
	},
	onLoad(e) {
		
	},
	onShow() {
		 // 登录检查（未登录会自动跳转到登录页面）
		 judgeLogin((userInfo, error) => {
			if (userInfo) {
				console.log('用户已登录:', userInfo);
				// 执行需要登录后的操作
			} else {
				console.log('未登录，已跳转到登录页面:', error);
				// 用户未登录，已自动跳转到登录页面
			}
		});
	},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
