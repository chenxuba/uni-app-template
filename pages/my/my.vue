<template>
	<view class="my-container">
		<z-nav-bar backState="2000" title="我的"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		
		<!-- 用户信息区域 -->
		<view class="user-info-section">
			<view class="user-header">
				<view class="user-avatar" @click="onAvatarClick">
					<image v-if="userInfo.avatar" :src="userInfo.avatar" mode="aspectFill"></image>
					<view v-else class="default-avatar">
						<text class="avatar-text">{{ userInfo.nickname ? userInfo.nickname.charAt(0) : '赵' }}</text>
					</view>
				</view>
				<view class="user-details">
					<view class="user-name">
						<text v-if="userInfo.nickname">{{ userInfo.nickname }}</text>
						<text v-else class="login-text" @click="onLogin">点击登录</text>
					</view>
					<view class="user-phone" v-if="userInfo.phone">
						<text>{{ formatPhone(userInfo.phone) }}</text>
					</view>
					<view class="user-level" v-if="userInfo.level">
						<text class="level-tag">{{ userInfo.level }}</text>
					</view>
				</view>
				<view class="user-actions">
					<view class="edit-btn" @click="onEditProfile">
						<text class="iconfont">✏️</text>
					</view>
				</view>
			</view>
			
			<!-- 用户数据统计 -->
			<view class="user-stats">
				<view class="stat-item" @click="onPageJump('/pages/wallet/wallet')">
					<text class="stat-number">{{ userStats.balance || '0.00' }}</text>
					<text class="stat-label">余额</text>
				</view>
				<view class="stat-item" @click="onPageJump('/pages/points/points')">
					<text class="stat-number">{{ userStats.points || 0 }}</text>
					<text class="stat-label">积分</text>
				</view>
				<view class="stat-item" @click="onPageJump('/pages/coupon/coupon')">
					<text class="stat-number">{{ userStats.coupons || 0 }}</text>
					<text class="stat-label">优惠券</text>
				</view>
				<view class="stat-item" @click="onPageJump('/pages/favorite/favorite')">
					<text class="stat-number">{{ userStats.favorites || 0 }}</text>
					<text class="stat-label">收藏</text>
				</view>
			</view>
		</view>
		
		<!-- 个人资产区域 -->
		<view class="assets-section">
			<view class="section-title">
				<text>个人资产</text>
			</view>
			<view class="assets-grid">
				<view class="asset-item" @click="onPageJump('/pages/wallet/wallet')">
					<view class="asset-icon wallet-icon">
						<text class="icon-text">💰</text>
					</view>
					<text class="asset-title">我的钱包</text>
					<text class="asset-desc">余额管理</text>
				</view>
				<view class="asset-item" @click="onPageJump('/pages/points/points')">
					<view class="asset-icon points-icon">
						<text class="icon-text">⭐</text>
					</view>
					<text class="asset-title">我的积分</text>
					<text class="asset-desc">积分兑换</text>
				</view>
				<view class="asset-item" @click="onPageJump('/pages/coupon/coupon')">
					<view class="asset-icon coupon-icon">
						<text class="icon-text">🎫</text>
					</view>
					<text class="asset-title">优惠券</text>
					<text class="asset-desc">优惠管理</text>
				</view>
				<view class="asset-item" @click="onPageJump('/pages/membership/membership')">
					<view class="asset-icon membership-icon">
						<text class="icon-text">👑</text>
					</view>
					<text class="asset-title">会员中心</text>
					<text class="asset-desc">特权服务</text>
				</view>
			</view>
		</view>
		
		<!-- 个人管理区域 -->
		<view class="personal-section">
			<view class="section-title">
				<text>个人管理</text>
			</view>
			<view class="personal-grid">
				<view class="personal-item" @click="onPageJump('/pages/address/address')">
					<view class="personal-icon address-icon">
						<text class="icon-text">📍</text>
					</view>
					<text class="personal-title">收货地址</text>
				</view>
				<view class="personal-item" @click="onPageJump('/pages/favorite/favorite')">
					<view class="personal-icon favorite-icon">
						<text class="icon-text">❤️</text>
					</view>
					<text class="personal-title">我的收藏</text>
				</view>
				<view class="personal-item" @click="onPageJump('/pages/history/history')">
					<view class="personal-icon history-icon">
						<text class="icon-text">🕒</text>
					</view>
					<text class="personal-title">浏览历史</text>
				</view>
				<view class="personal-item" @click="onPageJump('/pages/invite/invite')">
					<view class="personal-icon invite-icon">
						<text class="icon-text">🎁</text>
					</view>
					<text class="personal-title">邀请好友</text>
				</view>
			</view>
		</view>
		

		<!-- 服务功能区域 -->
		<view class="service-section">
			<view class="service-list">
				<view class="service-item" @click="onPageJump('/pages/feedback/feedback')">
					<view class="service-icon">
						<text class="icon-text">💬</text>
					</view>
					<view class="service-content">
						<text class="service-title">意见反馈</text>
						<text class="service-desc">您的建议是我们改进的动力</text>
					</view>
					<image src="@/static/icon/icon_xiajiantou.png" class="arrow-icon"></image>
				</view>
				
				<view class="service-item" @click="onPageJump('/pages/help/help')">
					<view class="service-icon">
						<text class="icon-text">❓</text>
					</view>
					<view class="service-content">
						<text class="service-title">帮助中心</text>
						<text class="service-desc">常见问题解答</text>
					</view>
					<image src="@/static/icon/icon_xiajiantou.png" class="arrow-icon"></image>
				</view>
				
				<view class="service-item" @click="onPageJump('/pages/about/about')">
					<view class="service-icon">
						<text class="icon-text">ℹ️</text>
					</view>
					<view class="service-content">
						<text class="service-title">关于我们</text>
						<text class="service-desc">了解更多应用信息</text>
					</view>
					<image src="@/static/icon/icon_xiajiantou.png" class="arrow-icon"></image>
				</view>
				
				<view class="service-item" @click="onPageJump('/pages/settings/settings')">
					<view class="service-icon">
						<text class="icon-text">⚙️</text>
					</view>
					<view class="service-content">
						<text class="service-title">设置</text>
						<text class="service-desc">个性化设置</text>
					</view>
					<image src="@/static/icon/icon_xiajiantou.png" class="arrow-icon"></image>
				</view>
			</view>
		</view>
		
		<!-- 退出登录按钮 -->
		<view class="logout-section" v-if="userInfo.nickname">
			<button class="logout-btn" @click="onLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
import { onLogin } from '@/config/login';
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			userStats: {
				balance: '0.00',
				points: 0,
				coupons: 0,
				favorites: 0
			}
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	//第一次加载
	onLoad(e) {
		// #ifdef MP-WEIXIN
		// onLogin(() => {
		// 	this.getUserStats();
		// });
		// #endif
		console.log(this.userInfo);
		
	},
	onShow() {
		this.getUserStats();
	},
	//方法
	methods: {
		...mapMutations(['emptyUserInfo', 'setUserInfo']),
		
		// 页面跳转
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		
		// 点击头像
		onAvatarClick() {
			if (!this.userInfo.nickname) {
				this.onLogin();
				return;
			}
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					// 这里可以上传头像
					console.log('选择的图片:', res.tempFilePaths[0]);
					this.uploadAvatar(res.tempFilePaths[0]);
				}
			});
		},
		
		// 上传头像
		uploadAvatar(filePath) {
			uni.showLoading({
				title: '上传中...'
			});
			// 这里添加上传头像的逻辑
			// 暂时模拟上传成功
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '头像上传成功',
					icon: 'success'
				});
			}, 2000);
		},
		
		// 格式化手机号
		formatPhone(phone) {
			if (!phone) return '';
			return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		},
		
		// 登录
		onLogin() {
			uni.navigateTo({
				url: '/pages/user/login'
			});
		},
		
		// 编辑个人资料
		onEditProfile() {
			if (!this.userInfo.nickname) {
				this.onLogin();
				return;
			}
			uni.navigateTo({
				url: '/pages/user/profile'
			});
		},
		
		// 获取用户统计数据
		getUserStats() {
			if (!this.userInfo.nickname) {
				return;
			}
			
			// 这里添加获取用户统计数据的API调用
			// 暂时使用模拟数据
			this.userStats = {
				balance: '128.50',
				points: 1580,
				coupons: 3,
				favorites: 12
			};
		},
		
		// 退出登录
		onLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						this.emptyUserInfo();
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						});
						// 可以跳转到登录页面或首页
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/home/home'
							});
						}, 1500);
					}
				}
			});
		}
	},
	//页面下拉刷新
	onPullDownRefresh() {
		this.getUserStats();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
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

.my-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 用户信息区域 */
.user-info-section {
	background: linear-gradient(135deg, $themeColor 0%, #f19837 100%);
	padding: 20px;
	margin-bottom: 10px;
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 0;
		right: 0;
		height: 20px;
		background: linear-gradient(135deg, $themeColor 0%, #f19837 100%);
		border-radius: 0 0 20px 20px;
	}
}

.user-header {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.user-avatar {
	@include ic(80px, 80px);
	border-radius: 50%;
	margin-right: 15px;
	background-color: rgba(255, 255, 255, 0.2);
	border: 3px solid rgba(255, 255, 255, 0.3);
	
	image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.default-avatar {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		
		.avatar-text {
			font-size: 32px;
			color: white;
			font-weight: bold;
		}
	}
}

.user-details {
	flex: 1;
}

.user-name {
	// margin-bottom: 8px;
	
	text {
		font-size: 20px;
		font-weight: bold;
		color: white;
	}
	
	.login-text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 16px;
	}
}

.user-phone {
	margin-bottom: 8px;
	
	text {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.8);
	}
}

.user-level {
	.level-tag {
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
}

.user-actions {
	.edit-btn {
		@include ic(40px, 40px);
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		
		text {
			font-size: 18px;
		}
	}
}

/* 用户统计数据 */
.user-stats {
	display: flex;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	padding: 15px 0;
	backdrop-filter: blur(10px);
}

.stat-item {
	flex: 1;
	text-align: center;
	
	.stat-number {
		display: block;
		font-size: 20px;
		font-weight: bold;
		color: white;
		margin-bottom: 4px;
	}
	
	.stat-label {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.8);
	}
}

/* 区域标题 */
.section-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
	padding: 0 20px;
}

/* 个人资产区域 */
.assets-section {
	background-color: white;
	margin-bottom: 10px;
	padding: 20px 0;
}

.assets-grid {
	display: flex;
	padding: 0 20px;
}

.asset-item {
	flex: 1;
	text-align: center;
	
	.asset-icon {
		@include ic(50px, 50px);
		margin: 0 auto 8px;
		background-color: #f8f8f8;
		border-radius: 12px;
		
		.icon-text {
			font-size: 24px;
		}
	}
	
	.asset-title {
		display: block;
		font-size: 12px;
		color: #333;
		margin-bottom: 2px;
		font-weight: 500;
	}
	
	.asset-desc {
		font-size: 10px;
		color: #999;
		display: flex;
		justify-content: center;
	}
}

/* 个人管理区域 */
.personal-section {
	background-color: white;
	margin-bottom: 10px;
	padding: 20px 0;
}

.personal-grid {
	display: flex;
	padding: 0 20px;
}

.personal-item {
	flex: 1;
	text-align: center;
	
	.personal-icon {
		@include ic(45px, 45px);
		margin: 0 auto 8px;
		background-color: #f8f8f8;
		border-radius: 12px;
		
		.icon-text {
			font-size: 20px;
		}
	}
	
	.personal-title {
		font-size: 12px;
		color: #666;
	}
}



/* 服务功能区域 */
.service-section {
	background-color: white;
	margin-bottom: 10px;
}

.service-list {
	padding: 0 20px;
}

.service-item {
	display: flex;
	align-items: center;
	padding: 18px 0;
	border-bottom: 1px solid #f0f0f0;
	
	&:last-child {
		border-bottom: none;
	}
	
	.service-icon {
		@include ic(40px, 40px);
		background-color: #f8f8f8;
		border-radius: 10px;
		margin-right: 15px;
		
		.icon-text {
			font-size: 20px;
		}
	}
	
	.service-content {
		flex: 1;
		
		.service-title {
			display: block;
			font-size: 16px;
			color: #333;
			margin-bottom: 4px;
		}
		
		.service-desc {
			font-size: 12px;
			color: #999;
		}
	}
	
	.arrow-icon {
		width: 12px;
		height: 12px;
		opacity: 0.4;
		transform: rotate(90deg);
	}
}

/* 退出登录区域 */
.logout-section {
	padding: 20px;
	margin-top: 20px;
}

.logout-btn {
	width: 100%;
	height: 50px;
	background-color: white;
	border: 1px solid #ddd;
	border-radius: 25px;
	color: #666;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&:active {
		background-color: #f5f5f5;
	}
}

/* 特定图标颜色 */
.wallet-icon {
	background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%) !important;
}

.points-icon {
	background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%) !important;
}

.coupon-icon {
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%) !important;
}

.membership-icon {
	background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%) !important;
}

.address-icon {
	background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%) !important;
}

.favorite-icon {
	background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%) !important;
}

.history-icon {
	background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%) !important;
}

.invite-icon {
	background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%) !important;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
	.user-avatar {
		@include ic(70px, 70px);
	}
	
	.user-name text {
		font-size: 18px;
	}
	
	.asset-item .asset-icon {
		@include ic(45px, 45px);
	}
	
	.personal-item .personal-icon {
		@include ic(40px, 40px);
	}
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
	.my-container {
		background-color: #1a1a1a;
	}
	
	.assets-section,
	.personal-section,
	.service-section {
		background-color: #2d2d2d;
	}
	
	.section-title {
		color: #fff;
	}
	
	.asset-title,
	.personal-title {
		color: #fff;
	}
	
	.service-item {
		border-bottom-color: #3d3d3d;
		
		.service-title {
			color: #fff;
		}
		
		.service-desc {
			color: #999;
		}
	}
	
	.logout-btn {
		background-color: #2d2d2d;
		border-color: #3d3d3d;
		color: #fff;
	}
}
</style>
