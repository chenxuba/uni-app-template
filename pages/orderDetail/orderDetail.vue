<template>
	<view class="order-detail">
		<z-nav-bar backState="2000" :title="orderInfo.typeName + '详情'"></z-nav-bar>
		
		<!-- 订单状态 -->
		<view class="status-card">
			<view class="status-header">
				<view class="status-icon" :class="statusConfig.iconClass"></view>
				<view class="status-info">
					<text class="status-title">{{ statusConfig.title }}</text>
					<text class="status-desc">{{ statusConfig.desc }}</text>
				</view>
			</view>
			<view class="order-type-badge" :class="orderInfo.typeClass">
				{{ orderInfo.typeName }}
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="title-text">订单信息</text>
				<view class="price-info">
					<text class="price-symbol">¥</text>
					<text class="price-amount">{{ orderInfo.price }}</text>
				</view>
			</view>
			
			<view class="order-description">
				<text class="desc-title">订单描述：</text>
				<text class="desc-content">{{ orderInfo.description }}</text>
			</view>
			
			<view class="order-time">
				<text class="time-label">发布时间：</text>
				<text class="time-value">{{ orderInfo.timeInfo }}</text>
			</view>
		</view>
		
		<!-- 地址信息 -->
		<view class="address-card">
			<view class="card-title">
				<text class="title-text">地址信息</text>
			</view>
			
			<!-- 取货/购买地址 -->
			<view class="address-item">
				<view class="address-left">
					<view class="address-label pickup-label">{{ orderInfo.type === 'buy' ? '买' : '取' }}</view>
					<text class="address-distance">{{ orderInfo.pickupDistance }}km</text>
				</view>
				<view class="address-info">
					<text class="address-name">{{ orderInfo.startLocation }}</text>
					<text class="address-detail">{{ orderInfo.startAddress }}</text>
				</view>
				<view class="address-action" @click="openMap('start')">
					<text class="action-text">导航</text>
				</view>
			</view>
			
			<!-- 送货地址 -->
			<view class="address-item" v-if="orderInfo.endLocation">
				<view class="address-left">
					<view class="address-label delivery-label">送</view>
					<text class="address-distance">{{ orderInfo.deliveryDistance }}km</text>
				</view>
				<view class="address-info">
					<text class="address-name">{{ orderInfo.endAddress }}</text>
				</view>
				<view class="address-action" @click="openMap('end')">
					<text class="action-text">导航</text>
				</view>
			</view>
			
			<!-- 总距离 -->
			<view class="total-distance">
				<text class="distance-text">总距离：{{ orderInfo.totalDistance }}km</text>
			</view>
		</view>
		
		<!-- 联系信息 -->
		<view class="contact-card">
			<view class="card-title">
				<text class="title-text">联系方式</text>
			</view>
			
			<view class="contact-item" @click="callPhone">
				<view class="contact-icon phone-icon"></view>
				<view class="contact-info">
					<text class="contact-label">联系客户</text>
					<text class="contact-value">{{ orderInfo.customerPhone }}</text>
				</view>
				<view class="contact-arrow"></view>
			</view>
		</view>
		
		<!-- 备注信息 -->
		<view class="remark-card" v-if="orderInfo.remark">
			<view class="card-title">
				<text class="title-text">备注信息</text>
			</view>
			<view class="remark-content">
				<text class="remark-text">{{ orderInfo.remark }}</text>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="bottom-actions">
			<view class="action-btn secondary-btn" @click="goBack">
				<text class="btn-text">返回列表</text>
			</view>
			<view class="action-btn primary-btn" @click="grabOrder">
				<text class="btn-text">立即抢单</text>
			</view>
		</view>
		
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			orderInfo: {
				id: 1,
				type: 'send',
				typeName: '帮我送',
				typeClass: 'type-send',
				title: '外卖配送',
				description: '麦当劳套餐，请尽快送达',
				price: '15.00',
				startLocation: '麦当劳(万达店)',
				startAddress: '四川省宜宾市叙州区万达广场3楼美食街A区12号',
				startLatitude: 28.749875, // 示例坐标
				startLongitude: 104.648420,
				endLocation: '阳光小区3栋2单元',
				endAddress: '阳光小区3栋2单元502室',
				endLatitude: 39.918823, // 示例坐标
				endLongitude: 116.407470,
				timeInfo: '30分钟前发布',
				pickupDistance: '1.2',
				deliveryDistance: '1.3',
				totalDistance: '2.5',
				customerPhone: '138****8888',
				remark: '请在取餐时确认餐品完整，送达时请联系收货人。'
			},
			status: 'available' // available: 可抢单, grabbed: 已被抢, completed: 已完成
		};
	},
	computed: {
		statusConfig() {
			const configs = {
				available: {
					title: '等待接单',
					desc: '该订单暂无人接取，可立即抢单',
					iconClass: 'status-waiting'
				},
				grabbed: {
					title: '已被抢单',
					desc: '该订单已被其他人接取',
					iconClass: 'status-grabbed'
				},
				completed: {
					title: '订单完成',
					desc: '该订单已完成配送',
					iconClass: 'status-completed'
				}
			};
			return configs[this.status] || configs.available;
		}
	},
	onLoad(options) {
		if (options.id) {
			this.orderId = options.id;
			this.loadOrderDetail();
		}
	},
	methods: {
		loadOrderDetail() {
			// 这里应该根据orderId从服务器获取订单详情
			// 现在使用模拟数据
			console.log('加载订单详情:', this.orderId);
		},
		openMap(type) {
			const isStart = type === 'start';
			const name = isStart ? this.orderInfo.startLocation : this.orderInfo.endLocation;
			const address = isStart ? this.orderInfo.startAddress : this.orderInfo.endAddress;
			
			// 直接打开系统地图导航
			this.openSystemMap(name, address);
		},
		
		// 使用uni-app系统地图
		openSystemMap(name, address) {
			const isStart = name === this.orderInfo.startLocation;
			const latitude = isStart ? this.orderInfo.startLatitude : this.orderInfo.endLatitude;
			const longitude = isStart ? this.orderInfo.startLongitude : this.orderInfo.endLongitude;
			
			uni.openLocation({
				name: name,
				address: address,
				latitude: latitude,
				longitude: longitude,
				scale: 18, // 地图缩放级别
				success: () => {
					console.log('打开系统地图成功');
				},
				fail: (err) => {
					console.error('打开系统地图失败:', err);
					uni.showToast({
						title: '打开地图失败',
						icon: 'none'
					});
				}
			});
		},
		

		callPhone() {
			uni.makePhoneCall({
				phoneNumber: this.orderInfo.customerPhone.replace(/\*/g, '1') // 实际使用时应该是完整号码
			});
		},
		grabOrder() {
			if (this.status !== 'available') {
				uni.showToast({
					title: '该订单不可抢取',
					icon: 'none'
				});
				return;
			}
			
			uni.showModal({
				title: '确认抢单',
				content: `确定要抢取这个${this.orderInfo.typeName}订单吗？`,
				success: (res) => {
					if (res.confirm) {
						// 这里处理抢单逻辑
						uni.showToast({
							title: '抢单成功',
							icon: 'success'
						});
						// 可以跳转到我的订单页面
						setTimeout(() => {
							this.goBack();
						}, 1500);
					}
				}
			});
		},
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';

.order-detail {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

// 状态卡片
.status-card {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	position: relative;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	
	.status-header {
		display: flex;
		align-items: center;
	}
	
	.status-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		position: relative;
		
		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
		}
		
		&.status-waiting::before {
			background-color: #ff9500;
		}
		
		&.status-grabbed::before {
			background-color: #4ecdc4;
		}
		
		&.status-completed::before {
			background-color: #52c41a;
		}
	}
	
	.status-info {
		flex: 1;
		
		.status-title {
			display: block;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 8rpx;
		}
		
		.status-desc {
			font-size: 26rpx;
			color: #666;
		}
	}
	
	.order-type-badge {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		font-size: 24rpx;
		font-weight: bold;
		color: #fff;
		padding: 8rpx 16rpx;
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
	}
}

// 通用卡片样式
.info-card, .address-card, .contact-card, .remark-card {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.price-info {
		display: flex;
		align-items: baseline;
		
		.price-symbol {
			font-size: 28rpx;
			color: $themeColor;
			font-weight: bold;
		}
		
		.price-amount {
			font-size: 40rpx;
			color: $themeColor;
			font-weight: bold;
		}
	}
}

// 订单信息
.order-description, .order-time {
	margin-bottom: 20rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.desc-title, .time-label {
	font-size: 28rpx;
	color: #666;
	width: 160rpx;
	flex-shrink: 0;
}

.desc-content, .time-value {
	font-size: 28rpx;
	color: #333;
	flex: 1;
	line-height: 1.6;
}

// 地址信息
.address-item {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	padding: 20rpx;
	background-color: #fafafa;
	border-radius: 12rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.address-left {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 24rpx;
	flex-shrink: 0;
	gap: 8rpx;
}

.address-label {
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

.address-distance {
	font-size: 20rpx;
	color: #666;
	background-color: #f0f0f0;
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	text-align: center;
	min-width: 50rpx;
}

.address-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	
	.address-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.4;
	}
	
	.address-detail {
		font-size: 24rpx;
		color: #666;
		line-height: 1.3;
	}
}

.address-action {
	@include theme('btn_bg');
	padding: 12rpx 24rpx;
	border-radius: 20rpx;
	margin-left: 20rpx;
	
	.action-text {
		color: #fff;
		font-size: 24rpx;
		font-weight: bold;
	}
}

.total-distance {
	text-align: center;
	padding: 20rpx 0 10rpx;
	border-top: 1rpx solid #f0f0f0;
	
	.distance-text {
		font-size: 28rpx;
		color: #666;
		font-weight: 500;
	}
}

// 联系信息
.contact-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-radius: 12rpx;
	transition: background-color 0.3s;
	
	&:active {
		background-color: #f8f8f8;
	}
}

.contact-icon {
	width: 50rpx;
	height: 50rpx;
	margin-right: 20rpx;
	border-radius: 50%;
	position: relative;
	
	&.phone-icon::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30rpx;
		height: 30rpx;
		background-color: #52c41a;
		border-radius: 50%;
	}
}

.contact-info {
	flex: 1;
	
	.contact-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 6rpx;
	}
	
	.contact-value {
		font-size: 24rpx;
		color: #666;
	}
}

.contact-arrow {
	width: 20rpx;
	height: 20rpx;
	border-top: 3rpx solid #ccc;
	border-right: 3rpx solid #ccc;
	transform: rotate(45deg);
}

// 备注信息
.remark-content {
	.remark-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
	}
}

// 底部操作按钮
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
	z-index: 100;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	transition: all 0.3s;
	
	&.secondary-btn {
		background-color: #f5f5f5;
		border: 2rpx solid #ddd;
		
		.btn-text {
			color: #666;
			font-size: 28rpx;
		}
		
		&:active {
			background-color: #ebebeb;
		}
	}
	
	&.primary-btn {
		@include theme('btn_bg');
		box-shadow: 0 4rpx 15rpx rgba(234, 85, 45, 0.3);
		
		.btn-text {
			color: #fff;
			font-size: 28rpx;
		}
		
		&:active {
			transform: scale(0.98);
		}
	}
}
</style>
