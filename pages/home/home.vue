<template>
	<view class="home-container">
		<z-nav-bar backState="2000" :titleCenter="false" :title="navTitle">
			<view class="nav-title-click" @click="openCampusPopup">
				<text class="nav-title-text">{{ navTitle }}</text>
				<image class="nav-title-icon" src="@/static/icon/icon_xiajiantou.png" mode="widthFix"></image>
			</view>
		</z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>

		<!-- 选择校区弹窗 -->
		<z-popup v-model="showCampusPopup" type="center" :hideOnBlur="false">
			<view class="campus-popup">
				<view class="campus-title">请选择校区</view>
				<view class="campus-list">
					<view class="campus-item" v-for="campus in campusList" :key="campus._id"
						:class="{ active: campus._id === selectedCampusId }" @click="onSelectCampus(campus)">
						{{ campus.name || campus.campusName }}
					</view>
				</view>
				<view class="campus-actions">
					<view class="btn confirm" :class="{ disabled: !selectedCampusId }" @click="confirmCampusSelection">确定</view>
				</view>
			</view>
		</z-popup>

		<!-- 轮播图 -->
		<view class="banner_swiper_box">
			<swiper class="banner_swiper" :autoplay="true" :interval="3000" circular previous-margin="30px" next-margin="30px"
				:duration="1000" @change="onSwiperChange">
				<swiper-item v-for="(item, index) of bannerList" :key="index">
					<view class="banner_img" :class="{ active: swiperIndex == index }">
						<image src="https://img0.baidu.com/it/u=252888832,3448728573&fm=253&app=138&f=JPEG?w=1824&h=570"
							mode="aspectFill" @click="onBanner(item)"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 滚动公告 -->
		<view class="notice-container">
			<view class="notice-icon">
				<text class="iconfont">📢</text>
			</view>
			<swiper class="notice-swiper" :vertical="true" :autoplay="true" :interval="3000" :duration="500">
				<swiper-item v-for="(notice, index) in noticeList" :key="index">
					<view class="notice-text" @click="onNoticeClick(notice)">
						{{ notice.content }}
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="takeout-pyramid-container">
			<!-- 校园外卖主入口 -->
			<view class="takeout-main-row">
				<view class="service-item takeout-main" @click="onServiceClick('takeout')">
					<view class="takeout-bg-decoration"></view>
					<view class="takeout-content">
						<view class="takeout-left-area">
							<view class="service-icon takeout-icon">
								<text class="icon-text">🍔</text>
							</view>
							<view class="takeout-text-area">
								<text class="service-title">校园外卖</text>
								<text class="service-desc">美食配送</text>
								<view class="takeout-tags">
									<text class="tag">热销</text>
									<text class="tag">快捷</text>
									<text class="tag">专送上寝</text>
								</view>
							</view>
						</view>
						<view class="takeout-image-area"></view>
					</view>
					<view class="takeout-corner-decoration"></view>
				</view>
			</view>
		</view>
		<!-- 外卖店铺列表 -->
		<view class="shop-container">
			<view class="section-title">
				<text class="title-text">外卖店铺</text>
				<text class="title-more" @click="onMoreShops">更多 ></text>
			</view>
			<view class="shop-list">
				<view class="shop-item" v-for="(shop, index) in shopList" :key="index" @click="onShopClick(shop)">
					<view class="shop-image">
						<image :src="shop.logo" mode="aspectFill"></image>
					</view>
					<view class="shop-info">
						<view class="shop-header">
							<view class="shop-name">{{ shop.shopName }}</view>
							<!-- 推荐标记 -->
							<view v-if="shop.isRecommended" class="recommend-badge">
								<text class="recommend-text">推荐</text>
							</view>
						</view>
						<view class="shop-desc">{{ shop.description }}</view>
						<view class="shop-tags">
							<text class="tag" v-for="tag in shop.tags" :key="tag">{{ tag }}</text>
						</view>
						<view class="shop-footer">
							<view class="shop-rating">
								<text class="rating-star">⭐</text>
								<text class="rating-text">{{ shop.rating || '5.0' }}</text>
								<text class="sales-text">月售{{ shop.sales || 0 }}</text>
							</view>
							<view class="delivery-info">
								<text class="delivery-fee">配送费¥{{ shop.deliveryFee || 0 }}</text>
								<text class="delivery-time">{{ shop.deliveryTime || 35 }}分钟 {{ shop.distanceKm !== null &&
									shop.distanceKm !== undefined ? shop.distanceKm : '2.0' }}km</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 服务模块 -->
		<view class="service-container">
			<view class="service-grid">
				<view class="service-item" @click="onServiceClick('buy')">
					<view class="service-icon buy-icon">
						<text class="icon-text">🛒</text>
					</view>
					<text class="service-title">帮我买</text>
					<text class="service-desc">代购服务</text>
				</view>
				<view class="service-item" @click="onServiceClick('delivery')">
					<view class="service-icon delivery-icon">
						<text class="icon-text">🚚</text>
					</view>
					<text class="service-title">帮我送</text>
					<text class="service-desc">配送服务</text>
				</view>
				<view class="service-item" @click="onServiceClick('pickup')">
					<view class="service-icon pickup-icon">
						<text class="icon-text">📦</text>
					</view>
					<text class="service-title">帮我取</text>
					<text class="service-desc">代取服务</text>
				</view>
				<view class="service-item" @click="onServiceClick('help')">
					<view class="service-icon help-icon">
						<text class="icon-text">🤝</text>
					</view>
					<text class="service-title">帮我办</text>
					<text class="service-desc">代办服务</text>
				</view>
			</view>
		</view>

		<!-- 校园外卖品字形布局 -->
		<view class="takeout-pyramid-container">


			<!-- 申请入口行 -->
			<view class="takeout-apply-row">
				<view class="option-item" @click="onTakeoutOptionClick('delivery')">
					<view class="option-icon">
						<text class="icon-text">🚚</text>
					</view>
					<text class="option-title">申请成为配送员</text>
					<text class="option-desc">配送任务</text>
				</view>
				<view class="option-item" @click="onTakeoutOptionClick('receiver')">
					<view class="option-icon">
						<text class="icon-text">📋</text>
					</view>
					<text class="option-title">申请成为接单员</text>
					<text class="option-desc">接单任务</text>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
import { getUserInfo } from '@/config/login';
import $http from '@/config/requestConfig';
import ZPopup from '@/uni_modules/z-popup/components/z-popup/z-popup.vue';
export default {
	components: { ZPopup },
	data() {
		return {
			videoUrl: '',
			videoShow: false,
			swiperIndex: 0,
			bannerList: [1, 1, 1, 1],
			navTitle: '首页',
			// 校区弹窗
			showCampusPopup: false,
			campusList: [],
			selectedCampusId: null,
			// 公告数据
			noticeList: [
				{ id: 1, content: '欢迎使用校园服务平台，为您提供便民服务！' },
				{ id: 2, content: '新用户注册即享首单优惠，快来体验吧！' },
				{ id: 3, content: '外卖配送时间：8:00-22:00，准时送达！' }
			],
			// 店铺数据
			shopList: [],
			// 模拟店铺数据（用于无数据或异常时回退展示）
			mockShopList: [
				{
					id: 1,
					shopName: '美味小厨',
					description: '精选食材，用心烹饪',
					logo: 'https://miaobi-lite.bj.bcebos.com/miaobi/5mao/b%27LV8xNzM1NjE2MzU4LjU3ODUwNzI%3D%27/0.png',
					rating: 4.8,
					sales: 1200,
					deliveryFee: 3,
					deliveryTime: 25,
					tags: ['快餐', '盖饭', '热销'],
					isRecommended: true,
					location: { latitude: 28.923638, longitude: 105.41624 }
				},
				{
					id: 2,
					shopName: '香辣川菜馆',
					description: '正宗川味，麻辣鲜香',
					logo: 'https://su.bcebos.com/b2b-jiameng/online/204e08f4-9558-4245-934f-c70ac9037a69',
					rating: 4.6,
					sales: 800,
					deliveryFee: 4,
					deliveryTime: 30,
					tags: ['川菜', '麻辣', '下饭'],
					isRecommended: true,
					location: { latitude: 28.918638, longitude: 105.40124 }
				},
				{
					id: 3,
					shopName: '清真兰州拉面',
					description: '手工拉面，汤鲜面劲',
					logo: 'https://miaobi-lite.bj.bcebos.com/miaobi/5mao/b%275LqR5Y2X546r55Gw6bKc6Iqx6aW85Zu%2B54mHXzE3MzMxMTI1NDcuODczMjIxXzE3MzMxMTI1NDguMDU0OTM3%27/1.png',
					rating: 4.7,
					sales: 600,
					deliveryFee: 2,
					deliveryTime: 20,
					tags: ['面食', '清真', '实惠'],
					isRecommended: true,
					location: { latitude: 28.909638, longitude: 105.39624 }
				}
			]
		};
	},

	//第一次加载
	onLoad(e) {
		// judgeLogin((userInfo, error) => {
		// 	if (userInfo) {
		// 		console.log('用户已登录:', userInfo);
		// 	} else {
		// 		console.log('未登录，已跳转到登录页面:', error);
		// 	}
		// });
	},
	//页面显示
	onShow: async function () {
		await this.checkDefaultCampusAndPrompt();
		this.refreshNavTitle();
		this.fetchShopList();
	},
	//方法
	methods: {
		async checkDefaultCampusAndPrompt() {
			const userInfo = getUserInfo();
			if (!userInfo || !userInfo.token) {
				this.showCampusPopup = false;
				this.navTitle = '首页';
				return;
			}
			const hasDefaultCampus = userInfo.defaultCampus !== undefined && userInfo.defaultCampus !== null && userInfo.defaultCampus !== '';
			if (!hasDefaultCampus) {
				await this.fetchCampusList();
				this.showCampusPopup = true;
			}
		},
		refreshNavTitle() {
			const userInfo = getUserInfo();
			const campusName = userInfo && (userInfo.defaultCampusName);
			this.navTitle = campusName ? campusName : '首页';
		},
		// 计算两个经纬度点之间的直线距离，返回公里数（保留1位小数）
		calculateDistanceKm(lat1, lon1, lat2, lon2) {
			if ([lat1, lon1, lat2, lon2].some(v => v === undefined || v === null || isNaN(Number(v)))) {
				return null;
			}
			const toRad = d => (Number(d) * Math.PI) / 180;
			const R = 6371; // 地球半径 km
			const dLat = toRad(lat2 - lat1);
			const dLon = toRad(lon2 - lon1);
			const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			const d = R * c;
			return Number(d.toFixed(1));
		},
		async fetchShopList() {
			const userInfo = getUserInfo();
			if (!userInfo || !userInfo.token) {
				this.shopList = this.mockShopList;
				return;
			}
			const hasDefaultCampus = userInfo.defaultCampus !== undefined && userInfo.defaultCampus !== null && userInfo.defaultCampus !== '';
			if (!hasDefaultCampus) {
				this.shopList = this.mockShopList;
				return;
			}
			try {
				const res = await $http.get('api/shop/campus/byId', { isRecommended: true });
				const list = Array.isArray(res?.shops) ? res.shops : [];
				const campusLoc = res?.campus?.location || {};
				const campusLat = campusLoc.latitude;
				const campusLng = campusLoc.longitude;
				const withDistance = (list.length ? list : this.mockShopList).map(s => {
					const shopLoc = s.location || {};
					const shopLat = shopLoc.latitude;
					const shopLng = shopLoc.longitude;
					const distanceKm = this.calculateDistanceKm(campusLat, campusLng, shopLat, shopLng);
					return Object.assign({}, s, { distanceKm });
				});
				this.shopList = withDistance;
			} catch (e) {
				console.log('获取店铺失败，使用模拟数据', e);
				// 失败时仍尝试用默认校区信息计算距离
				const userInfo2 = getUserInfo() || {};
				const campus = userInfo2.defaultCampusLocation || {};
				const campusLat = campus.latitude;
				const campusLng = campus.longitude;
				this.shopList = this.mockShopList.map(s => {
					const shopLoc = s.location || {};
					const distanceKm = this.calculateDistanceKm(campusLat, campusLng, shopLoc.latitude, shopLoc.longitude);
					return Object.assign({}, s, { distanceKm });
				});
			}
		},
		async fetchCampusList() {
			try {
				const res = await $http.get('api/campus');
				this.campusList = Array.isArray(res) ? res : (res?.list || []);
				const userInfo = getUserInfo() || {};
				const currentDefaultId = userInfo.defaultCampus;
				if (currentDefaultId && this.campusList.some(c => String(c._id) === String(currentDefaultId))) {
					this.selectedCampusId = currentDefaultId;
				} else if (this.campusList.length === 1) {
					this.selectedCampusId = this.campusList[0]._id;
				} else if (!this.selectedCampusId) {
					this.selectedCampusId = null;
				}
			} catch (e) {
				uni.showToast({ title: '获取校区失败', icon: 'none' });
			}
		},
		openCampusPopup() {
			const userInfo = getUserInfo();
			if (!userInfo || !userInfo.token) {
				uni.showToast({ title: '请先登录', icon: 'none' });
				return;
			}
			this.fetchCampusList().then(() => {
				this.showCampusPopup = true;
			});
		},
		onSelectCampus(campus) {
			this.selectedCampusId = campus._id;
		},
		async confirmCampusSelection() {
			if (!this.selectedCampusId) return;
			try {
				const result = await $http.post('api/user/update-default-campus', { campusId: this.selectedCampusId });
				const campus = (this.campusList || []).find(c => c._id === this.selectedCampusId);
				const campusName = campus?.name || campus?.campusName || '';
				const currentUserInfo = this.$store.state.userInfo || {};
				const updatedUserInfo = Object.assign({}, currentUserInfo, {
					defaultCampus: this.selectedCampusId,
					defaultCampusName: campusName,
					token: (result && result.token) ? result.token : currentUserInfo.token
				});
				this.$store.commit('setUserInfo', updatedUserInfo);
				try { uni.setStorageSync('userInfo', updatedUserInfo); } catch (e) { }
				this.showCampusPopup = false;
				this.navTitle = campusName || '首页';
				uni.showToast({ title: '设置成功', icon: 'success' });
				this.fetchShopList();
			} catch (e) {
				uni.showToast({ title: '设置失败，请重试', icon: 'none' });
			}
		},
		pageData() { },
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 轮播图点击
		onBanner(item) {
			if (item.jumpType == 1201) {
				// #ifdef H5
				window.open(item.jumpRecord.webViewUrl);
				// #endif 
				// #ifndef H5
				this.$store.commit("setWebViewUrl", item.jumpRecord.webViewUrl);
				uni.navigateTo({
					url: '/pages/home/webView'
				});
				// #endif
			} else if (item.jumpType == 1301) {
				this.videoUrl = item.jumpRecord.videoUrl;
				this.videoShow = true;
			}
		},
		// 轮播图变化
		onSwiperChange(e) {
			this.swiperIndex = e.detail.current;
		},
		// 公告点击
		onNoticeClick(notice) {
			uni.showToast({
				title: '公告详情',
				icon: 'none'
			});
		},
		// 服务模块点击
		onServiceClick(type) {
			switch (type) {
				case 'buy':
					uni.showToast({
						title: '帮我买服务',
						icon: 'none'
					});
					// 这里可以跳转到对应的服务页面
					break;
				case 'delivery':
					uni.showToast({
						title: '帮我送服务',
						icon: 'none'
					});
					break;
				case 'pickup':
					uni.showToast({
						title: '帮我取服务',
						icon: 'none'
					});
					break;
				case 'help':
					uni.showToast({
						title: '帮我办服务',
						icon: 'none'
					});
					break;
				case 'takeout':
					// 跳转到外卖页面或显示外卖店铺
					this.scrollToShops();
					break;
			}
		},
		// 外卖选项点击
		onTakeoutOptionClick(type) {
			switch (type) {
				case 'delivery':
					uni.showToast({
						title: '申请成为配送员',
						icon: 'none'
					});
					// 这里可以跳转到配送员申请页面
					break;
				case 'receiver':
					uni.showToast({
						title: '申请成为接单员',
						icon: 'none'
					});
					// 这里可以跳转到接单员申请页面
					break;
			}
		},
		// 店铺点击
		onShopClick(shop) {
			// 跳转到店铺详情页
			const shopId = shop._id || shop.id || '689f09afb4271c04d1c202d3'; // 使用正确的MongoDB ObjectId
			uni.navigateTo({
				url: `/pages/shopDetail/shopDetail?shopId=${shopId}&shopName=${encodeURIComponent(shop.shopName || shop.name || '')}`
			});
		},
		// 更多店铺
		onMoreShops() {
			uni.showToast({
				title: '查看更多店铺',
				icon: 'none'
			});
		},
		// 滚动到店铺列表
		scrollToShops() {
			// 可以使用页面滚动API滚动到店铺区域
			uni.pageScrollTo({
				selector: '.shop-container',
				duration: 300
			});
		},
		// 关闭视频
		onCloseVideo() {
			this.videoShow = false;
		}
	},
	//页面隐藏
	onHide() { },
	//页面卸载
	onUnload() { },
	//页面下来刷新
	onPullDownRefresh() { },
	//页面上拉触底
	onReachBottom() { },
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';

.home-container {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 40upx;

}

// 轮播图样式
.banner_swiper_box {
	padding: 15upx 0;
	background-color: #fff;
	margin-bottom: 15upx;

	.banner_swiper {
		height: 315upx;

		swiper-item {
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.banner_img {
				width: 100%;
				height: 100%;
				transform: scale(0.9);
				transition: all 0.4s;

				&.active {
					transform: scale(1);
				}

				image {
					width: 100%;
					height: 100%;
					box-shadow: 0upx 20upx 30upx 0upx rgba(0, 0, 0, 0.1);
					border-radius: 20upx;
				}
			}
		}
	}
}

// 自定义左侧标题及下拉图标
.nav-title-click {
	display: inline-flex;
	align-items: center;

	.nav-title-text {
		font-size: 32rpx;
		font-weight: 700;
	}

	.nav-title-icon {
		width: 24rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
}

// 公告样式
.notice-container {
	background-color: #fff;
	margin-bottom: 15upx;
	padding: 20upx 30upx;
	display: flex;
	align-items: center;
	border-radius: 20upx;
	margin: 0 20upx 15upx 20upx;
	box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.05);

	.notice-icon {
		margin-right: 20upx;
		font-size: 32upx;
	}

	.notice-swiper {
		flex: 1;
		height: 60upx;

		.notice-text {
			font-size: 28upx;
			color: #666;
			line-height: 60upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}

// 服务模块样式
.service-container {
	background-color: #fff;
	margin: 0 20upx 15upx 20upx;
	border-radius: 20upx;
	padding: 30upx;
	padding-bottom: 15upx;
	box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.05);

	.service-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.service-item {
			width: 48%;
			text-align: center;
			padding: 30upx 0;
			margin-bottom: 20upx;
			border-radius: 15upx;
			background: #f8f9ff;
			color: #5a67d8;
			border: 2upx solid #e2e8f0;
			box-shadow: 0 4upx 15upx rgba(0, 0, 0, 0.08);
			transition: all 0.3s ease;

			&:nth-child(2) {
				background: #fef5f8;
				color: #d53f8c;
				border-color: #fed7e2;
			}

			&:nth-child(3) {
				background: #f0f9ff;
				color: #0ea5e9;
				border-color: #bae6fd;
			}

			&:nth-child(4) {
				background: #f0fdf4;
				color: #16a34a;
				border-color: #bbf7d0;
			}

			&:active {
				transform: scale(0.98);
				box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.12);
			}

			.service-icon {
				width: 80upx;
				height: 80upx;
				margin: 0 auto 20upx;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 0.8);
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.1);

				.icon-text {
					font-size: 40upx;
				}
			}

			.service-title {
				display: block;
				font-size: 32upx;
				font-weight: 600;
				margin-bottom: 10upx;
			}

			.service-desc {
				display: block;
				font-size: 24upx;
				opacity: 0.7;
				font-weight: 400;
			}
		}
	}
}

// 校园外卖品字形布局样式
.takeout-pyramid-container {
	background-color: #fff;
	margin: 0 20upx 15upx 20upx;
	border-radius: 20upx;
	padding: 30upx;
	box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.05);

	// 校园外卖主入口行
	.takeout-main-row {
		display: flex;
		justify-content: center;

		.service-item {
			width: 100%;
			position: relative;
			padding: 25upx 20upx;
			border-radius: 20upx;
			background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #ff4757 100%);
			color: #fff;
			border: none;
			box-shadow:
				0 8upx 25upx rgba(255, 107, 53, 0.4),
				0 4upx 15upx rgba(255, 107, 53, 0.2),
				inset 0 1upx 0 rgba(255, 255, 255, 0.3);
			transition: all 0.3s ease;
			overflow: hidden;

			&:active {
				transform: translateY(2upx);
				box-shadow:
					0 6upx 20upx rgba(255, 107, 53, 0.5),
					0 2upx 10upx rgba(255, 107, 53, 0.3);
			}

			// 背景装饰
			.takeout-bg-decoration {
				position: absolute;
				top: -20upx;
				right: -20upx;
				width: 80upx;
				height: 80upx;
				background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
				border-radius: 50%;
			}

			// 角落装饰
			.takeout-corner-decoration {
				position: absolute;
				bottom: -10upx;
				left: -10upx;
				width: 40upx;
				height: 40upx;
				background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
				border-radius: 50%;
			}

			// 主要内容区域
			.takeout-content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				z-index: 2;
				height: 100%;

				// 左侧内容区域
				.takeout-left-area {
					display: flex;
					align-items: center;
					flex: 1;

					.service-icon {
						width: 60upx;
						height: 60upx;
						border-radius: 50%;
						background: rgba(255, 255, 255, 0.25);
						display: flex;
						align-items: center;
						justify-content: center;
						box-shadow:
							0 4upx 15upx rgba(0, 0, 0, 0.1),
							inset 0 1upx 0 rgba(255, 255, 255, 0.4);
						backdrop-filter: blur(10upx);
						flex-shrink: 0;

						.icon-text {
							font-size: 32upx;
						}
					}

					.takeout-text-area {
						flex: 1;
						text-align: left;
						margin-left: 20upx;

						.service-title {
							display: block;
							font-size: 32upx;
							font-weight: 700;
							margin-bottom: 5upx;
							text-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.1);
						}

						.service-desc {
							display: block;
							font-size: 22upx;
							opacity: 0.9;
							font-weight: 400;
							margin-bottom: 10upx;
						}

						.takeout-tags {
							display: flex;
							gap: 6upx;
							flex-wrap: wrap;

							.tag {
								background: rgba(255, 255, 255, 0.25);
								color: #fff;
								font-size: 16upx;
								font-weight: 500;
								padding: 3upx 10upx;
								border-radius: 12upx;
								backdrop-filter: blur(5upx);
								border: 1upx solid rgba(255, 255, 255, 0.2);
								white-space: nowrap;
							}
						}
					}
				}

				// 右侧图片区域
				.takeout-image-area {
					width: 100upx;
					height: 100%;
					margin-left: 15upx;
					flex-shrink: 0;
					position: relative;
					border-radius: 6upx;
					overflow: hidden;
					background-image: url('https://pcsys.admin.ybc365.com/6add1afa-29d0-4e6a-acec-92d4c0314591.png');
					background-size: cover;
					background-position: center;
					background-repeat: no-repeat;
					opacity: 0.9;
					box-shadow:
						0 4upx 15upx rgba(0, 0, 0, 0.15),
						inset 0 1upx 0 rgba(255, 255, 255, 0.2);

					// 添加一个半透明遮罩层，让背景图更好地融入设计
					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: linear-gradient(135deg,
								rgba(255, 154, 86, 0.3) 0%,
								rgba(255, 107, 53, 0.2) 50%,
								rgba(255, 71, 87, 0.3) 100%);
						mix-blend-mode: overlay;
					}

					// 添加边框高光效果
					&::after {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						border: 1upx solid rgba(255, 255, 255, 0.3);
						border-radius: 12upx;
						pointer-events: none;
					}
				}
			}
		}
	}

	// 申请入口行 - 改为与4个帮服务一致的卡片样式
	.takeout-apply-row {
		display: flex;
		justify-content: space-between;
		gap: 20upx;

		.option-item {
			flex: 1;
			text-align: center;
			padding: 30upx 0; // 改为与上面4个服务一致的高度
			border-radius: 15upx;
			background: #f8f9ff;
			color: #5a67d8;
			border: 2upx solid #e2e8f0;
			box-shadow: 0 4upx 15upx rgba(0, 0, 0, 0.08);
			transition: all 0.3s ease;

			&:nth-child(2) {
				background: #fef5f8;
				color: #d53f8c;
				border-color: #fed7e2;
			}

			&:active {
				transform: scale(0.98);
				box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.12);
			}

			.option-icon {
				width: 80upx; // 恢复到与4个帮服务一致的大小
				height: 80upx;
				margin: 0 auto 20upx; // 恢复到与4个帮服务一致的间距
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 0.8);
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.1);

				.icon-text {
					font-size: 40upx; // 恢复到与4个帮服务一致的大小
				}
			}

			.option-title {
				display: block;
				font-size: 32upx; // 改为与4个帮服务一致的标题大小
				font-weight: 600;
				margin-bottom: 10upx; // 添加底部间距
			}

			// 添加描述文字样式，保持与4个帮服务一致
			.option-desc {
				display: block;
				font-size: 24upx;
				opacity: 0.7;
				font-weight: 400;
			}
		}
	}
}

// 店铺列表样式
.shop-container {
	background-color: #fff;
	margin: 0 20upx;
	border-radius: 20upx;
	box-shadow: 0 4upx 20upx rgba(0, 0, 0, 0.05);

	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx;
		border-bottom: 1upx solid #f0f0f0;

		.title-text {
			font-size: 36upx;
			font-weight: bold;
			color: #333;
		}

		.title-more {
			font-size: 28upx;
			color: #999;
		}
	}

	.shop-list {
		.shop-item {
			display: flex;
			padding: 30upx;
			border-bottom: 1upx solid #f0f0f0;
			transition: background-color 0.3s;

			&:last-child {
				border-bottom: none;
			}

			&:active {
				background-color: #f8f8f8;
			}

			.shop-image {
				width: 220upx;
				height: 220upx;
				margin-right: 20upx;
				border-radius: 15upx;
				overflow: hidden;
				flex: 0 0 220upx; // 防止被压缩
				min-width: 220upx;

				image {
					width: 100%;
					height: 100%;
					display: block;
					object-fit: cover;
				}
			}

			.shop-info {
				flex: 1;
				min-width: 0;
				height: 220upx;

				// 店铺标题区域（包含名称和推荐标记）
				.shop-header {
					display: flex;
					align-items: center;
					margin-bottom: 10upx;
					position: relative;
					overflow: hidden;

					.shop-name {
						font-size: 32upx;
						font-weight: bold;
						color: #333;
						flex: 1;
						min-width: 0;
						padding-right: 50upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					// 推荐标记
					.recommend-badge {
						position: absolute;
						right: 0;
						top: 0;
						background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
						color: #fff;
						border: none;
						font-size: 22upx;
						font-weight: 600;
						padding: 6upx 10upx;
						border-radius: 8upx;
						box-shadow: 0 2upx 8upx rgba(255, 107, 53, 0.4);
						transition: all 0.2s ease;
						flex-shrink: 0;

						.recommend-text {
							line-height: 1;
							text-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.2);
						}

						// 悬停效果
						&:active {
							background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
							box-shadow: 0 4upx 12upx rgba(255, 107, 53, 0.5);
							transform: translateY(-1upx);
						}
					}
				}

				.shop-desc {
					font-size: 26upx;
					color: #666;
					margin-bottom: 15upx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.shop-tags {
					margin-bottom: 15upx;
					display: flex;
					flex-wrap: wrap;
					gap: 8upx;

					.tag {
						display: inline-flex;
						align-items: center;
						font-size: 20upx;
						padding: 4upx 10upx;
						border-radius: 10upx;
						font-weight: 400;
						transition: all 0.2s ease;

						// 默认样式（第一个标签 - 橙色系）
						&:nth-child(1) {
							background-color: #fff5f0;
							color: #ff6b35;
							border: 1upx solid #ffe4d6;
						}

						// 第二个标签样式（蓝色系）
						&:nth-child(2) {
							background-color: #f0f4ff;
							color: #5a67d8;
							border: 1upx solid #d6e3ff;
						}

						// 第三个标签样式（粉色系）
						&:nth-child(3) {
							background-color: #fef5f8;
							color: #d53f8c;
							border: 1upx solid #fed7e2;
						}

						// 第四个标签样式（绿色系）
						&:nth-child(4) {
							background-color: #f0fdf4;
							color: #16a34a;
							border: 1upx solid #bbf7d0;
						}

						// 第五个及以后标签样式（灰色系）
						&:nth-child(n+5) {
							background-color: #f8f9fa;
							color: #6c757d;
							border: 1upx solid #e9ecef;
						}
					}
				}

				.shop-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.shop-rating {
						display: flex;
						align-items: center;

						.rating-star {
							font-size: 24upx;
							margin-right: 15upx;
							margin-top: -5upx;
						}

						.rating-text {
							font-size: 26upx;
							color: #ff6b35;
							font-weight: bold;
							margin-right: 15upx;
						}

						.sales-text {
							font-size: 24upx;
							color: #999;
						}
					}

					.delivery-info {
						text-align: right;

						.delivery-fee {
							font-size: 24upx;
							color: #333;
							display: block;
						}

						.delivery-time {
							font-size: 22upx;
							color: #999;
						}
					}
				}
			}
		}
	}
}

// 选择校区弹窗样式
.campus-popup {
	width: 600rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;

	.campus-title {
		font-size: 32rpx;
		font-weight: 600;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.campus-list {
		max-height: 600rpx;
		overflow-y: auto;

		.campus-item {
			padding: 22rpx 20rpx;
			border: 1rpx solid #eee;
			border-radius: 12rpx;
			margin-bottom: 16rpx;
			text-align: center;

			&.active {
				border-color: #ff6b35;
				color: #ff6b35;
				background: #fff5f0;
			}
		}
	}

	.campus-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;

		.btn {
			flex: 1;
			text-align: center;
			padding: 22rpx 0;
			border-radius: 12rpx;
			font-size: 28rpx;

			&.cancel {
				background: #f5f5f5;
				margin-right: 16rpx;
			}

			&.confirm {
				background: #ff6b35;
				color: #fff;

				&.disabled {
					opacity: 0.5;
				}
			}
		}
	}
}
</style>
