<template>
	<view class="grab-order-hall">
		<z-nav-bar backState="2000" title="帮我买取送"></z-nav-bar>
		
		<!-- 大厅类型切换 -->
		<view class="hall-type-switch">
			<view 
				class="hall-type-item"
				:class="{ 'active': currentHallType === 'normal' }"
				@click="switchHallType('normal')"
			>
				<text class="hall-type-text">帮帮抢单大厅</text>
			</view>
			<view 
				class="hall-type-item"
				:class="{ 'active': currentHallType === 'delivery' }"
				@click="switchHallType('delivery')"
			>
				<text class="hall-type-text">配送抢单大厅</text>
			</view>
		</view>
		
		<!-- 筛选标签 (只在普通抢单大厅显示) -->
		<view v-if="currentHallType === 'normal'" class="filter-tabs">
			<view 
				class="tab-item" 
				:class="{ 'active': currentTab === index }"
				v-for="(tab, index) in tabs" 
				:key="index"
				@click="switchTab(index)"
			>
				<view class="tab-icon" :class="tab.iconClass"></view>
				<text class="tab-text">{{ tab.name }}</text>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<scroll-view class="order-list" scroll-y="true" @scrolltolower="loadMore">
			<view class="order-item" v-for="order in filteredOrders" :key="order.id" @click="viewOrderDetail(order)">
				<!-- 订单内容 -->
				<view class="order-content">
					<view class="order-header">
						<view class="order-title-wrapper">
							<text class="order-title" :class="order.typeClass">{{ order.typeName }}</text>
						</view>
						<view class="order-price">
							<view class="price-wrapper">
								<text class="price-symbol">¥</text>
								<text class="price-amount">{{ order.price }}</text>	
							</view>
						</view>
					</view>
					
					<view class="order-detail">
						<text class="detail-text">{{ order.description }}</text>
					</view>
					
					<view class="order-location">
						<view class="location-item">
							<view class="location-left">
								<view class="location-label pickup-label">{{ order.type === 'buy' ? '买' : '取' }}</view>
								<text class="location-distance">{{ order.pickupDistance }}km</text>
							</view>
							<view class="location-info">
								<text class="location-name">{{ order.startLocation }}</text>
								<text class="location-address">{{ order.startAddress }}</text>
							</view>
						</view>
						<view class="location-item" v-if="order.endLocation">
							<view class="location-left">
								<view class="location-label delivery-label">送</view>
								<text class="location-distance">{{ order.deliveryDistance }}km</text>
							</view>
							<view class="location-info">
								<text class="location-name">{{ order.endAddress }}</text>
							</view>
						</view>
					</view>
					
					<view class="order-footer">
						<view class="order-time">
							<text class="time-text">{{ order.timeInfo }}</text>
						</view>
						<view class="order-distance">
							<text class="distance-text">总距离{{ order.totalDistance }}km</text>
						</view>
					</view>
				</view>
				
				<!-- 抢单按钮 -->
				<view class="grab-btn" @click.stop="grabOrder(order)">
					<text class="grab-text">立即抢单</text>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredOrders.length === 0">
				<image class="empty-icon" src="/static/icon/empty.png" mode="aspectFit"></image>
				<text class="empty-text">暂无{{ tabs[currentTab].name }}订单</text>
			</view>
		</scroll-view>
		
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentHallType: 'normal', // normal: 普通抢单大厅, delivery: 配送抢单大厅
			currentTab: 0,
			// 普通抢单大厅的标签
			normalTabs: [
				{ name: '全部', iconClass: 'icon-all', type: 'all' },
				{ name: '帮我送', iconClass: 'icon-send', type: 'send' },
				{ name: '帮我取', iconClass: 'icon-pick', type: 'pick' },
				{ name: '帮我买', iconClass: 'icon-buy', type: 'buy' }
			],
			// 配送抢单大厅的标签（只有外卖配送）
			deliveryTabs: [
				{ name: '外卖配送', iconClass: 'icon-food', type: 'food' }
			],
			orders: [
				{
					id: 1,
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					title: '外卖配送',
					description: '麦当劳套餐，请尽快送达',
					price: '15.00',
					startLocation: '麦当劳(万达店)',
					startAddress: '万达广场3楼美食街A区12号',
					endLocation: '阳光小区3栋2单元',
					endAddress: '阳光小区3栋2单元502室',
					timeInfo: '30分钟前发布',
					pickupDistance: '1.2',
					deliveryDistance: '1.3',
					totalDistance: '2.5'
				},
				{
					id: 2,
					type: 'pick',
					typeName: '帮我取',
					typeClass: 'type-pick',
					title: '快递代取',
					description: '菜鸟驿站包裹代取，取件码：8888',
					price: '8.00',
					startLocation: '菜鸟驿站(学府路店)',
					startAddress: '学府路128号底商菜鸟驿站',
					endLocation: '华府天地A座',
					endAddress: '华府天地A座1508室',
					timeInfo: '1小时前发布',
					pickupDistance: '0.8',
					deliveryDistance: '0.4',
					totalDistance: '1.2'
				},
				{
					id: 3,
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					title: '超市购物',
					description: '购买清单：牛奶2盒，面包1袋，鸡蛋1打',
					price: '25.00',
					startLocation: '永辉超市(中心店)',
					startAddress: '中心大街88号永辉超市1楼',
					endLocation: '绿城小区',
					endAddress: '绿城小区15栋1单元301室',
					timeInfo: '2小时前发布',
					pickupDistance: '2.1',
					deliveryDistance: '1.7',
					totalDistance: '3.8'
				},
				{
					id: 4,
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					title: '文件送达',
					description: '重要合同文件，需要本人签收',
					price: '20.00',
					startLocation: '中信大厦A座',
					startAddress: '中信大厦A座2306室',
					endLocation: '市政府办公楼',
					endAddress: '市政府办公楼行政服务中心',
					timeInfo: '45分钟前发布',
					pickupDistance: '3.2',
					deliveryDistance: '2.0',
					totalDistance: '5.2'
				},
				{
					id: 5,
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					title: '药店购药',
					description: '感冒药，需要带处方单',
					price: '12.00',
					startLocation: '同仁堂药店',
					startAddress: '健康路36号同仁堂大药房',
					endLocation: '金桂花园',
					endAddress: '金桂花园6栋2单元1201室',
					timeInfo: '20分钟前发布',
					pickupDistance: '1.1',
					deliveryDistance: '0.7',
					totalDistance: '1.8'
				},
				{
					id: 6,
					type: 'pick',
					typeName: '帮我取',
					typeClass: 'type-pick',
					title: '干洗店取衣',
					description: '西装2件，已洗好可取',
					price: '10.00',
					startLocation: '洁丽干洗店',
					startAddress: '书香路23号洁丽干洗连锁店',
					endLocation: '书香门第小区',
					endAddress: '书香门第小区8栋3单元602室',
					timeInfo: '3小时前发布',
					pickupDistance: '1.3',
					deliveryDistance: '0.8',
					totalDistance: '2.1'
				}
			],
			// 配送抢单大厅订单数据（只有外卖配送）
			deliveryOrders: [
				{
					id: 101,
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					title: '肯德基外卖',
					description: '全家桶套餐，请保温配送，客户已付款',
					price: '18.00',
					startLocation: '肯德基(天河店)',
					startAddress: '天河路88号肯德基餐厅',
					endLocation: '珠江新城',
					endAddress: '珠江新城花城大道123号写字楼A座1208',
					timeInfo: '15分钟前发布',
					pickupDistance: '0.5',
					deliveryDistance: '3.2',
					totalDistance: '3.7'
				},
				{
					id: 102,
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					title: '星巴克咖啡',
					description: '2杯拿铁，1份三明治，请尽快配送',
					price: '20.00',
					startLocation: '星巴克(购书中心店)',
					startAddress: '天河路购书中心星巴克',
					endLocation: '体育西路',
					endAddress: '体育西路维多利广场办公楼15楼',
					timeInfo: '8分钟前发布',
					pickupDistance: '0.7',
					deliveryDistance: '1.5',
					totalDistance: '2.2'
				},
				{
					id: 103,
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					title: '麦当劳外卖',
					description: '巨无霸套餐，薯条要热的，可乐要冰的',
					price: '25.00',
					startLocation: '麦当劳(万达店)',
					startAddress: '万达广场3楼美食街麦当劳',
					endLocation: '阳光小区',
					endAddress: '阳光小区15栋2单元1203室',
					timeInfo: '12分钟前发布',
					pickupDistance: '1.2',
					deliveryDistance: '2.8',
					totalDistance: '4.0'
				},
				{
					id: 104,
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					title: '必胜客披萨',
					description: '超级至尊披萨，趁热配送',
					price: '35.00',
					startLocation: '必胜客(中心店)',
					startAddress: '中心大街必胜客餐厅',
					endLocation: '华府天地',
					endAddress: '华府天地B座2208室',
					timeInfo: '18分钟前发布',
					pickupDistance: '0.8',
					deliveryDistance: '3.5',
					totalDistance: '4.3'
				},
				{
					id: 105,
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					title: '海底捞外卖',
					description: '番茄火锅底料，牛肉丸子，蔬菜拼盘',
					price: '45.00',
					startLocation: '海底捞(天河店)',
					startAddress: '天河路海底捞火锅店',
					endLocation: '珠江新城',
					endAddress: '珠江新城CBD写字楼A座1888',
					timeInfo: '5分钟前发布',
					pickupDistance: '1.5',
					deliveryDistance: '2.2',
					totalDistance: '3.7'
				}
			]
		};
	},
	computed: {
		// 当前使用的标签配置
		tabs() {
			return this.currentHallType === 'normal' ? this.normalTabs : this.deliveryTabs;
		},
		// 当前使用的订单数据
		currentOrders() {
			return this.currentHallType === 'normal' ? this.orders : this.deliveryOrders;
		},
		// 筛选后的订单
		filteredOrders() {
			// 如果是配送大厅，直接返回所有外卖配送订单（不需要筛选）
			if (this.currentHallType === 'delivery') {
				return this.currentOrders;
			}
			// 普通抢单大厅的筛选逻辑
			if (this.currentTab === 0) {
				return this.currentOrders;
			}
			const currentType = this.tabs[this.currentTab].type;
			return this.currentOrders.filter(order => order.type === currentType);
		}
	},
	onLoad(e) {
		
	},
	onShow() {
		
	},
	//方法
	methods: {
		// 切换大厅类型
		switchHallType(type) {
			this.currentHallType = type;
			this.currentTab = 0; // 重置到第一个标签
		},
		switchTab(index) {
			this.currentTab = index;
		},
		viewOrderDetail(order) {
			// 跳转到订单详情页
			this.onPageJump(`/pages/orderDetail/orderDetail?id=${order.id}`);
		},
		grabOrder(order) {
			uni.showModal({
				title: '确认抢单',
				content: `确定要抢取这个${order.typeName}订单吗？`,
				success: (res) => {
					if (res.confirm) {
						// 这里处理抢单逻辑
						uni.showToast({
							title: '抢单成功',
							icon: 'success'
						});
						// 可以跳转到订单详情页
						// this.onPageJump('/pages/order/orderDetail?id=' + order.id);
					}
				}
			});
		},
		loadMore() {
			// 加载更多订单数据
			console.log('加载更多');
		},
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	},
	//页面下来刷新
	onPullDownRefresh() {
		// 刷新数据
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	//页面上拉触底
	onReachBottom() {
		this.loadMore();
	},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';

.grab-order-hall {
	background-color: #f5f5f5;
	min-height: 100vh;
}

// 大厅类型切换样式
.hall-type-switch {
	display: flex;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 12rpx;
	padding: 8rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	
	.hall-type-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 10rpx;
		border-radius: 8rpx;
		transition: all 0.3s ease;
		
		&.active {
			background: linear-gradient(135deg, $themeColor, #ff8a65);
			box-shadow: 0 4rpx 12rpx rgba(234, 85, 45, 0.3);
			
			.hall-type-text {
				color: #fff;
				font-weight: bold;
			}
		}
		
		.hall-type-text {
			font-size: 28rpx;
			color: #666;
			transition: all 0.3s ease;
		}
	}
}

// 筛选标签样式
.filter-tabs {
	display: flex;
	background-color: #fff;
	padding: 20rpx 0;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	position: sticky;
	top: 0;
	z-index: 10;
	
	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 10rpx;
		position: relative;
		transition: all 0.3s ease;
		
		&.active {
			.tab-icon {
				transform: scale(1.1);
				
				&.icon-all::before {
					background-color: $themeColor;
				}
				&.icon-send::before {
					background-color: #ff6b35;
				}
				&.icon-pick::before {
					background-color: #4ecdc4;
				}
				&.icon-buy::before {
					background-color: #45b7d1;
				}
				
				// 配送大厅外卖配送图标激活状态
				&.icon-food::before {
					background-color: #ff9800;
				}
			}
			
			.tab-text {
				color: $themeColor;
				font-weight: bold;
			}
			
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 4rpx;
				background-color: $themeColor;
				border-radius: 2rpx;
			}
		}
	}
	
	.tab-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
		position: relative;
		transition: all 0.3s ease;
		
		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background-color: #ddd;
			transition: all 0.3s ease;
		}
		
		&.icon-all::before {
			background-color: #999;
		}
		&.icon-send::before {
			background-color: #ff6b35;
			opacity: 0.6;
		}
		&.icon-pick::before {
			background-color: #4ecdc4;
			opacity: 0.6;
		}
		&.icon-buy::before {
			background-color: #45b7d1;
			opacity: 0.6;
		}
		
		// 配送大厅外卖配送图标
		&.icon-food::before {
			background-color: #ff9800;
			opacity: 0.6;
		}
	}
	
	.tab-text {
		font-size: 26rpx;
		color: #666;
		transition: all 0.3s ease;
	}
}

// 订单列表样式
.order-list {
	flex: 1;
	padding: 20rpx;
}

.order-item {
	background-color: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
	position: relative;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.12);
	}
}


// 订单内容
.order-content {
	margin-top: 20rpx;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	
	.order-title-wrapper {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-wrap: wrap;
	}
	
	.order-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
		padding: 8rpx 20rpx;
		border-radius: 16rpx;
		
		&.type-send {
			background: linear-gradient(135deg, #ff6b35, #f7931e);
		}
		
		&.type-pick {
			background: linear-gradient(135deg, #4ecdc4, #44a08d);
		}
		
		&.type-buy {
			background: linear-gradient(135deg, #45b7d1, #96c93d);
		}
		
		// 配送大厅外卖配送类型
		&.type-food {
			background: linear-gradient(135deg, #ff9800, #ff5722);
		}
	}
	

	
	.order-price {
		display: flex;
		.price-wrapper{
			display: flex;
			align-items: center;
		}
		.price-symbol {
			font-size: 24rpx;
			color: $themeColor;
			font-weight: bold;
			margin-right: 4rpx;
		}
		
		.price-amount {
			font-size: 36rpx;
			color: $themeColor;
			font-weight: bold;
		}
		

	}
}

.order-detail {
	margin-bottom: 25rpx;
	
	.detail-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		@include bov(2);
	}
}

// 位置信息
.order-location {
	margin-bottom: 30rpx;
	background-color: #fafafa;
	border-radius: 12rpx;
	padding: 20rpx;
	
	.location-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		position: relative;
		
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.location-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 24rpx;
		flex-shrink: 0;
		gap: 8rpx;
	}
	
	.location-label {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		font-weight: bold;
		color: #fff;
		
		&.pickup-label {
			background: linear-gradient(135deg, #4ecdc4, #44a08d);
			box-shadow: 0 2rpx 8rpx rgba(78, 205, 196, 0.3);
		}
		
		&.delivery-label {
			background: linear-gradient(135deg, #ea552d, #f7931e);
			box-shadow: 0 2rpx 8rpx rgba(234, 85, 45, 0.3);
		}
	}
	
	.location-distance {
		font-size: 20rpx;
		color: #666;
		background-color: #f0f0f0;
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		text-align: center;
		min-width: 50rpx;
	}
	
	.location-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}
	
	.location-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.4;
	}
	
	.location-address {
		font-size: 24rpx;
		color: #666;
		line-height: 1.3;
	}
}

// 订单底部信息
.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
	
	.time-text, .distance-text {
		font-size: 24rpx;
		color: #999;
	}
}

// 抢单按钮
.grab-btn {
	@include theme('btn_bg');
	padding: 20rpx 40rpx;
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20rpx;
	box-shadow: 0 4rpx 15rpx rgba(234, 85, 45, 0.3);
	
	.grab-text {
		color: #fff;
		font-size: 28rpx;
		font-weight: bold;
	}
}

// 空状态
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 40rpx;
	
	.empty-icon {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 30rpx;
		opacity: 0.6;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
}
</style>
