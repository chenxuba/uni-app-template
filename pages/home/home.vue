<template>
	<view class="home-container">
		<z-nav-bar backState="2000" title="首页"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		
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
				<view class="service-item" @click="onServiceClick('takeout')">
					<view class="service-icon takeout-icon">
						<text class="icon-text">🍔</text>
					</view>
					<text class="service-title">校园外卖</text>
					<text class="service-desc">美食配送</text>
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
						<image :src="shop.image" mode="aspectFill"></image>
					</view>
					<view class="shop-info">
						<view class="shop-name">{{ shop.name }}</view>
						<view class="shop-desc">{{ shop.description }}</view>
						<view class="shop-tags">
							<text class="tag" v-for="tag in shop.tags" :key="tag">{{ tag }}</text>
						</view>
						<view class="shop-footer">
							<view class="shop-rating">
								<text class="rating-star">⭐</text>
								<text class="rating-text">{{ shop.rating }}</text>
								<text class="sales-text">月售{{ shop.sales }}+</text>
							</view>
							<view class="delivery-info">
								<text class="delivery-fee">配送费¥{{ shop.deliveryFee }}</text>
								<text class="delivery-time">{{ shop.deliveryTime }}分钟</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { judgeLogin } from '@/config/login';
export default {
	data() {
		return {
			videoUrl: '',
			videoShow: false,
			swiperIndex: 0,
			bannerList: [1, 1, 1, 1],
			// 公告数据
			noticeList: [
				{ id: 1, content: '欢迎使用校园服务平台，为您提供便民服务！' },
				{ id: 2, content: '新用户注册即享首单优惠，快来体验吧！' },
				{ id: 3, content: '外卖配送时间：8:00-22:00，准时送达！' }
			],
			// 店铺数据
			shopList: [
				{
					id: 1,
					name: '美味小厨',
					description: '精选食材，用心烹饪',
					image: 'https://public-obs-cdn.anjulian.com.cn/2024-07-01/ab664d9a-6573-4456-9643-657a7bba8800.png',
					rating: 4.8,
					sales: 1200,
					deliveryFee: 3,
					deliveryTime: 25,
					tags: ['快餐', '盖饭', '热销']
				},
				{
					id: 2,
					name: '香辣川菜馆',
					description: '正宗川味，麻辣鲜香',
					image: 'https://public-obs-cdn.anjulian.com.cn/2024-07-01/ab664d9a-6573-4456-9643-657a7bba8800.png',
					rating: 4.6,
					sales: 800,
					deliveryFee: 4,
					deliveryTime: 30,
					tags: ['川菜', '麻辣', '下饭']
				},
				{
					id: 3,
					name: '清真兰州拉面',
					description: '手工拉面，汤鲜面劲',
					image: 'https://public-obs-cdn.anjulian.com.cn/2024-07-01/ab664d9a-6573-4456-9643-657a7bba8800.png',
					rating: 4.7,
					sales: 600,
					deliveryFee: 2,
					deliveryTime: 20,
					tags: ['面食', '清真', '实惠']
				}
			]
		};
	},
	
	//第一次加载
	onLoad(e) {
		judgeLogin((userInfo, error) => {
			if (userInfo) {
				console.log('用户已登录:', userInfo);
			} else {
				console.log('未登录，已跳转到登录页面:', error);
			}
		});
	},
	//页面显示
	onShow() {
	},
	//方法
	methods: {
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
			switch(type) {
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
				case 'takeout':
					// 跳转到外卖页面或显示外卖店铺
					this.scrollToShops();
					break;
			}
		},
		// 店铺点击
		onShopClick(shop) {
			uni.showToast({
				title: `进入${shop.name}`,
				icon: 'none'
			});
			// 这里可以跳转到店铺详情页
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

				image {
					width: 100%;
					height: 100%;
				}
			}

			.shop-info {
				flex: 1;
				height: 220upx;
				.shop-name {
					font-size: 32upx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10upx;
				}

				.shop-desc {
					font-size: 26upx;
					color: #666;
					margin-bottom: 15upx;
				}

				.shop-tags {
					margin-bottom: 15upx;

					.tag {
						display: inline-block;
						background-color: #f0f0f0;
						color: #666;
						font-size: 22upx;
						padding: 5upx 15upx;
						border-radius: 15upx;
						margin-right: 10upx;
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
							margin-top: -6upx;
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


</style>
