<template>
	<view class="register_page">
		<z-nav-bar title="登录/注册" :shadow="false"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		
		<!-- 欢迎标题 -->
		<view class="welcome_title">欢迎使用 帮帮免跑腿</view>
		<view class="welcome_subtitle">登录即享优质服务</view>
		
		<!-- LOGO -->
		<view class="logo">
			<image :src="logo" mode="aspectFill"></image>
		</view>
		
		<!-- 隐私声明 -->
		<view class="privacy_text">
			获取用户手机号用于验证身份，以及数据同步
		</view>
		
		<!-- 协议勾选 -->
		<view class="protocol_box">
			<view class="select" :class="{active: agree}" @click="agree = !agree"></view>
			我已阅读并同意
			<text @click="onPageJump('/pages/user/protocol')">《用户协议》</text>
			<text @click="onPageJump('/pages/user/protocol')">《隐私政策》</text>
		</view>
		
		<!-- 登录按钮 -->
		<view class="btn_box">
			<!-- #ifdef MP-WEIXIN -->
			<button 
				open-type="getPhoneNumber" 
				@getphonenumber="onGetPhoneNumber" 
				class="login_btn" 
				:class="{active: agree}"
				:disabled="!agree">
				用户一键登录
			</button>
			<!-- #endif -->
			
			<!-- #ifndef MP-WEIXIN -->
			<button @click="onSubmit" class="login_btn" :class="{active: agree}">用户一键登录</button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logo: "",
				agree: false
			};
		},
		//第一次加载
		onLoad(e) {
			this.logo = this.$base.logoUrl;
		},
		//页面显示
		onShow() {},
		//方法
		methods: {
			onPageJump(url) {
				uni.navigateTo({
					url: url
				});
			},
					onSubmit() {
			if (!this.agree) {
				uni.showToast({
					title: '请先同意《用户协议》和《隐私政策》',
					icon: 'none'
				});
				return;
			}
			
			// 一键登录流程
			this.oneClickLogin();
		},
		
		// 一键登录方法（非微信小程序使用）
		oneClickLogin() {
			// #ifdef APP-PLUS
			// APP端一键登录
			uni.showToast({
				title: 'APP端一键登录功能待开发',
				icon: 'none'
			});
			// #endif
			
			// #ifdef H5
			// H5端提示
			uni.showToast({
				title: 'H5端暂不支持一键登录',
				icon: 'none'
			});
			// #endif
		},
		
		// 处理手机号授权回调（微信小程序专用）
		onGetPhoneNumber(e) {
			if (!this.agree) {
				uni.showToast({
					title: '请先同意《用户协议》和《隐私政策》',
					icon: 'none'
				});
				return;
			}
			
			if (e.detail.errMsg === 'getPhoneNumber:ok') {
				// 获取到手机号加密信息，发送到后端解密并登录
				this.loginWithPhoneNumber(e.detail);
			} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
				uni.showToast({
					title: '需要手机号授权才能登录',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: '获取手机号失败，请重试',
					icon: 'none'
				});
			}
		},
		
		// 使用手机号登录
		loginWithPhoneNumber(phoneDetail) {
			const that = this;
			
			uni.showLoading({
				title: '登录中...'
			});
			
			// 调用配置文件中的手机号登录方法
			this.$login.phoneLogin(phoneDetail, (res, err) => {
				uni.hideLoading();
				
				if (res) {
					// 登录成功
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});
					
					// 延迟跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/home/home'
						});
					}, 1500);
				} else {
					// 登录失败
					uni.showToast({
						title: err?.errMsg || '登录失败，请重试',
						icon: 'none'
					});
				}
			});
		}
		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
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
	.register_page {
		padding: calc(var(--status-bar-height) + 30rpx) 50rpx 50rpx 50rpx;
		background-color: #fff;
		min-height: 100vh;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		// 欢迎标题
		.welcome_title {
			font-size: 48rpx;
			font-weight: bold;
			color: #333;
			text-align: center;
			margin-top: 60rpx;
			margin-bottom: 20rpx;
		}
		
		// 副标题
		.welcome_subtitle {
			font-size: 28rpx;
			color: #999;
			text-align: center;
			margin-bottom: 80rpx;
		}
		
		// LOGO
		.logo {
			margin-bottom:50rpx;
			image {
				width: 330rpx;
				height: 330rpx;
				border-radius: 50%;
			}
		}
		
		// 隐私声明
		.privacy_text {
			font-size: 26rpx;
			color: #999;
			text-align: left;
			line-height: 1.5;
			margin-bottom: 60rpx;
			padding: 0 40rpx;
		}
		
		// 协议勾选
		.protocol_box {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			font-size: 26rpx;
			color: #333333;
			margin-bottom: 80rpx;
			
			.select {
				width: 32rpx;
				height: 32rpx;
				border: 2rpx solid #ddd;
				border-radius: 50%;
				margin-right: 15rpx;
				position: relative;
				
				&.active {
					border-color: #007aff;
					background-color: #007aff;
					
					&::after {
						content: '';
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 12rpx;
						height: 12rpx;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
			
			text {
				color: #007aff;
				margin: 0 8rpx;
			}
		}
		
		// 登录按钮
		.btn_box {
			width: 100%;
			
			.login_btn {
				width: 100%;
				height: 100rpx;
				background-color: #ccc;
				color: #fff;
				font-size: 32rpx;
				border-radius: 20rpx;
				border: none;
				line-height: 100rpx;
				
				&.active {
					background-color: #007aff;
				}
				
				&[disabled] {
					background-color: #ccc !important;
					color: #999 !important;
				}
			}
		}
	}
</style>
