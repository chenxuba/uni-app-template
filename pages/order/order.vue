<template>
	<view class="order-page">
		<z-nav-bar backState="2000" title="我的订单"></z-nav-bar>

		<!-- 用户角色切换 -->
		<view class="role-switch">
			<view class="role-item" :class="{ 'active': currentRole === 'customer' }" @click="switchRole('customer')">
				<text class="role-text">我发的订单</text>
			</view>
			<view class="role-item" :class="{ 'active': currentRole === 'provider' }" @click="switchRole('provider')">
				<text class="role-text">我接的订单</text>
			</view>
		</view>

		<!-- 订单状态标签 -->
		<view class="order-tabs">
			<view class="tab-item" :class="{ 'active': currentTab === index }" v-for="(tab, index) in currentTabs"
				:key="index" @click="switchTab(index)">
				<text class="tab-text">{{ tab.name }}</text>
				<view class="tab-count">{{ tab.count }}</view>
			</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view class="order-list" scroll-y="true" @scrolltolower="loadMore">
			<view class="order-item" v-for="order in filteredOrders" :key="order.id">
				<!-- 订单头部 -->
				<view class="order-header">
					<view class="order-info">
						<text class="order-number">订单号：{{ order.orderNumber }}</text>
						<text class="order-time">{{ order.createTime }}</text>
					</view>
					<view class="order-status" :class="order.statusClass">
						<text class="status-text">{{ order.statusText }}</text>
					</view>
				</view>

				<!-- 订单内容 -->
				<view class="order-content">
					<view class="content-header">
						<view class="order-type-wrapper">
							<text class="order-type" :class="order.typeClass">{{ order.typeName }}</text>
						</view>
						<view class="order-price">
							<text class="price-symbol">¥</text>
							<text class="price-amount">{{ order.price }}</text>
						</view>
					</view>

					<view class="order-description">
						<text class="desc-text">{{ order.description }}</text>
					</view>

					<!-- 地址信息 -->
					<view class="order-address">
						<view class="address-item">
							<view class="address-label pickup-label">{{ order.type === 'buy' ? '买' : order.type === 'food' ? '取' : '取'
							}}</view>
							<view class="address-info">
								<text class="address-name">{{ order.startLocation }}</text>
								<text class="address-detail">{{ order.startAddress }}</text>
							</view>
						</view>
						<view class="address-item" v-if="order.endLocation">
							<view class="address-label delivery-label">送</view>
							<view class="address-info">
								<text class="address-name">{{ order.endAddress }}</text>
							</view>
						</view>
					</view>

					<!-- 订单底部信息 -->
					<view class="order-footer">
						<view class="footer-left">
							<text class="distance-text">总距离{{ order.totalDistance }}km</text>
						</view>
						<view class="footer-right">
							<view class="action-btn secondary-btn" @click="viewOrderDetail(order)">
								<text class="btn-text">查看详情</text>
							</view>

							<!-- 配送员视角的操作按钮 -->
							<template v-if="currentRole === 'provider'">
								<view class="action-btn primary-btn" v-if="order.status === 'in_progress'"
									@click="contactCustomer(order)">
									<text class="btn-text">联系客户</text>
								</view>
								<view class="action-btn success-btn" v-if="order.status === 'in_progress'"
									@click="completeOrder(order)">
									<text class="btn-text">完成订单</text>
								</view>
							</template>

							<!-- 顾客视角的操作按钮 -->
							<template v-if="currentRole === 'customer'">
								<view class="action-btn primary-btn" v-if="order.status === 'delivering' && order.providerPhone"
									@click="contactProvider(order)">
									<text class="btn-text">联系配送员</text>
								</view>
								<view class="action-btn warning-btn" v-if="order.status === 'pending'" @click="cancelOrder(order)">
									<text class="btn-text">取消订单</text>
								</view>
								<view class="action-btn success-btn" v-if="order.status === 'completed'" @click="rateOrder(order)">
									<text class="btn-text">评价</text>
								</view>
							</template>
						</view>
					</view>
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
import { judgeLogin } from '@/config/login';
export default {
	data() {
		return {
			currentRole: 'customer', // provider: 配送员视角, customer: 顾客视角
			currentTab: 0,
			// 配送员视角的标签
			providerTabs: [
				{ name: '全部', type: 'all', count: 0 },
				{ name: '进行中', type: 'in_progress', count: 0 },
				{ name: '已完成', type: 'completed', count: 0 },
				{ name: '已取消', type: 'cancelled', count: 0 }
			],
			// 顾客视角的标签
			customerTabs: [
				{ name: '全部', type: 'all', count: 0 },
				{ name: '待接单', type: 'pending', count: 0 },
				{ name: '配送中', type: 'delivering', count: 0 },
				{ name: '已完成', type: 'completed', count: 0 },
				{ name: '已取消', type: 'cancelled', count: 0 }
			],
			// 配送员视角的订单数据（我接的订单）
			providerOrders: [
				// 进行中的订单
				{
					id: 1,
					orderNumber: 'ORD202412151001',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '肯德基全家桶套餐，请保温配送，客户已付款',
					price: '18.00',
					startLocation: '肯德基(天河店)',
					startAddress: '天河路88号肯德基餐厅',
					endLocation: '珠江新城',
					endAddress: '珠江新城花城大道123号写字楼A座1208',
					totalDistance: '3.7',
					createTime: '2024-12-15 14:30',
					status: 'in_progress',
					statusText: '进行中',
					statusClass: 'status-progress',
					customerPhone: '138****8888'
				},
				{
					id: 2,
					orderNumber: 'ORD202412151002',
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					description: '麦当劳套餐，请尽快送达',
					price: '15.00',
					startLocation: '麦当劳(万达店)',
					startAddress: '万达广场3楼美食街A区12号',
					endLocation: '阳光小区3栋2单元',
					endAddress: '阳光小区3栋2单元502室',
					totalDistance: '2.5',
					createTime: '2024-12-15 14:15',
					status: 'in_progress',
					statusText: '进行中',
					statusClass: 'status-progress',
					customerPhone: '139****9999'
				},
				{
					id: 3,
					orderNumber: 'ORD202412151003',
					type: 'pick',
					typeName: '帮我取',
					typeClass: 'type-pick',
					description: '菜鸟驿站包裹代取，取件码：8888',
					price: '8.00',
					startLocation: '菜鸟驿站(学府路店)',
					startAddress: '学府路128号底商菜鸟驿站',
					endLocation: '华府天地A座',
					endAddress: '华府天地A座1508室',
					totalDistance: '1.2',
					createTime: '2024-12-15 13:20',
					status: 'in_progress',
					statusText: '进行中',
					statusClass: 'status-progress',
					customerPhone: '139****9999'
				},
				{
					id: 4,
					orderNumber: 'ORD202412151004',
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					description: '购买清单：牛奶2盒，面包1袋，鸡蛋1打',
					price: '25.00',
					startLocation: '永辉超市(中心店)',
					startAddress: '中心大街88号永辉超市1楼',
					endLocation: '绿城小区',
					endAddress: '绿城小区15栋1单元301室',
					totalDistance: '3.8',
					createTime: '2024-12-15 12:10',
					status: 'in_progress',
					statusText: '进行中',
					statusClass: 'status-progress',
					customerPhone: '137****7777'
				},
				// 已完成的订单
				{
					id: 5,
					orderNumber: 'ORD202412141001',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '星巴克咖啡，2杯拿铁，1份三明治',
					price: '20.00',
					startLocation: '星巴克(购书中心店)',
					startAddress: '天河路购书中心星巴克',
					endLocation: '体育西路',
					endAddress: '体育西路维多利广场办公楼15楼',
					totalDistance: '2.2',
					createTime: '2024-12-14 16:45',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					customerPhone: '136****6666'
				},
				{
					id: 6,
					orderNumber: 'ORD202412141002',
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					description: '重要合同文件，需要本人签收',
					price: '20.00',
					startLocation: '中信大厦A座',
					startAddress: '中信大厦A座2306室',
					endLocation: '市政府办公楼',
					endAddress: '市政府办公楼行政服务中心',
					totalDistance: '5.2',
					createTime: '2024-12-14 15:45',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					customerPhone: '135****5555'
				},
				{
					id: 7,
					orderNumber: 'ORD202412141003',
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					description: '感冒药，需要带处方单',
					price: '12.00',
					startLocation: '同仁堂药店',
					startAddress: '健康路36号同仁堂大药房',
					endLocation: '金桂花园',
					endAddress: '金桂花园6栋2单元1201室',
					totalDistance: '1.8',
					createTime: '2024-12-14 15:30',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					customerPhone: '134****4444'
				},
				{
					id: 8,
					orderNumber: 'ORD202412131001',
					type: 'pick',
					typeName: '帮我取',
					typeClass: 'type-pick',
					description: '干洗店取衣，西装2件，已洗好可取',
					price: '10.00',
					startLocation: '洁丽干洗店',
					startAddress: '书香路23号洁丽干洗连锁店',
					endLocation: '书香门第小区',
					endAddress: '书香门第小区8栋3单元602室',
					totalDistance: '2.1',
					createTime: '2024-12-13 11:20',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					customerPhone: '134****4444'
				},
				{
					id: 9,
					orderNumber: 'ORD202412131002',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '必胜客披萨，超级至尊披萨，趁热配送',
					price: '35.00',
					startLocation: '必胜客(中心店)',
					startAddress: '中心大街必胜客餐厅',
					endLocation: '华府天地',
					endAddress: '华府天地B座2208室',
					totalDistance: '4.3',
					createTime: '2024-12-13 10:15',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					customerPhone: '133****3333'
				},
				{
					id: 10,
					orderNumber: 'ORD202412131003',
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					description: '生日蛋糕，需要小心配送',
					price: '18.00',
					startLocation: '好利来蛋糕店',
					startAddress: '中央大街好利来蛋糕店',
					endLocation: '幸福家园',
					endAddress: '幸福家园12栋1单元801室',
					totalDistance: '3.2',
					createTime: '2024-12-13 09:15',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					customerPhone: '132****2222'
				},
				// 已取消的订单
				{
					id: 11,
					orderNumber: 'ORD202412121001',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '海底捞外卖，番茄火锅底料，客户临时取消',
					price: '45.00',
					startLocation: '海底捞(天河店)',
					startAddress: '天河路海底捞火锅店',
					endLocation: '珠江新城',
					endAddress: '珠江新城CBD写字楼A座1888',
					totalDistance: '3.7',
					createTime: '2024-12-12 14:20',
					status: 'cancelled',
					statusText: '已取消',
					statusClass: 'status-cancelled',
					customerPhone: '131****1111'
				},
				{
					id: 12,
					orderNumber: 'ORD202412121002',
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					description: '水果拼盘，客户临时取消',
					price: '22.00',
					startLocation: '水果超市',
					startAddress: '新华路水果超市',
					endLocation: '学府小区',
					endAddress: '学府小区5栋3单元1002室',
					totalDistance: '2.8',
					createTime: '2024-12-12 13:20',
					status: 'cancelled',
					statusText: '已取消',
					statusClass: 'status-cancelled',
					customerPhone: '130****0000'
				}
			],
			// 顾客视角的订单数据（我发的订单）
			customerOrders: [
				// 待接单的订单
				{
					id: 101,
					orderNumber: 'CUS202412151001',
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					description: '重要文件需要送达，请小心保管',
					price: '25.00',
					startLocation: '我的位置',
					startAddress: '天河区珠江新城花城大道88号',
					endLocation: '目标地址',
					endAddress: '越秀区中山五路123号办公楼15楼',
					totalDistance: '8.5',
					createTime: '2024-12-15 15:30',
					status: 'pending',
					statusText: '待接单',
					statusClass: 'status-pending',
					providerPhone: null
				},
				{
					id: 102,
					orderNumber: 'CUS202412151002',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '麦当劳套餐，请尽快配送',
					price: '35.00',
					startLocation: '麦当劳(天河店)',
					startAddress: '天河路麦当劳餐厅',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号写字楼A座1208',
					totalDistance: '3.2',
					createTime: '2024-12-15 14:45',
					status: 'pending',
					statusText: '待接单',
					statusClass: 'status-pending',
					providerPhone: null
				},
				// 配送中的订单
				{
					id: 103,
					orderNumber: 'CUS202412151003',
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					description: '超市购物清单：牛奶、面包、水果',
					price: '45.00',
					startLocation: '华润万家超市',
					startAddress: '天河路华润万家超市',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号',
					totalDistance: '2.8',
					createTime: '2024-12-15 13:20',
					status: 'delivering',
					statusText: '配送中',
					statusClass: 'status-delivering',
					providerPhone: '138****8888',
					providerName: '张师傅'
				},
				{
					id: 104,
					orderNumber: 'CUS202412151004',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '星巴克咖啡，2杯拿铁',
					price: '28.00',
					startLocation: '星巴克(购书中心店)',
					startAddress: '天河路购书中心星巴克',
					endLocation: '我的位置',
					endAddress: '天河区体育西路维多利广场15楼',
					totalDistance: '1.5',
					createTime: '2024-12-15 12:30',
					status: 'delivering',
					statusText: '配送中',
					statusClass: 'status-delivering',
					providerPhone: '139****9999',
					providerName: '李师傅'
				},
				{
					id: 105,
					orderNumber: 'CUS202412151005',
					type: 'pick',
					typeName: '帮我取',
					typeClass: 'type-pick',
					description: '快递代取，取件码：6688',
					price: '8.00',
					startLocation: '菜鸟驿站',
					startAddress: '天河路菜鸟驿站',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号',
					totalDistance: '1.2',
					createTime: '2024-12-15 11:15',
					status: 'delivering',
					statusText: '配送中',
					statusClass: 'status-delivering',
					providerPhone: '137****7777',
					providerName: '王师傅'
				},
				// 已完成的订单
				{
					id: 106,
					orderNumber: 'CUS202412141001',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '肯德基全家桶，已送达',
					price: '68.00',
					startLocation: '肯德基(天河店)',
					startAddress: '天河路肯德基餐厅',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号',
					totalDistance: '4.2',
					createTime: '2024-12-14 19:30',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					providerPhone: '136****6666',
					providerName: '刘师傅'
				},
				{
					id: 107,
					orderNumber: 'CUS202412141002',
					type: 'send',
					typeName: '帮我送',
					typeClass: 'type-send',
					description: '生日礼物配送，已送达',
					price: '30.00',
					startLocation: '我的位置',
					startAddress: '天河区珠江新城花城大道88号',
					endLocation: '朋友家',
					endAddress: '越秀区东风路456号小区',
					totalDistance: '12.3',
					createTime: '2024-12-14 16:20',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					providerPhone: '135****5555',
					providerName: '赵师傅'
				},
				{
					id: 108,
					orderNumber: 'CUS202412131001',
					type: 'buy',
					typeName: '帮我买',
					typeClass: 'type-buy',
					description: '药店购药，已送达',
					price: '15.00',
					startLocation: '同仁堂药店',
					startAddress: '天河路同仁堂药店',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号',
					totalDistance: '2.1',
					createTime: '2024-12-13 14:10',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					providerPhone: '134****4444',
					providerName: '孙师傅'
				},
				{
					id: 109,
					orderNumber: 'CUS202412131002',
					type: 'pick',
					typeName: '帮我取',
					typeClass: 'type-pick',
					description: '干洗店取衣服，已取回',
					price: '12.00',
					startLocation: '洁丽干洗店',
					startAddress: '天河路洁丽干洗店',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号',
					totalDistance: '1.8',
					createTime: '2024-12-13 10:30',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed',
					providerPhone: '133****3333',
					providerName: '周师傅'
				},
				// 已取消的订单
				{
					id: 110,
					orderNumber: 'CUS202412121001',
					type: 'food',
					typeName: '外卖配送',
					typeClass: 'type-food',
					description: '海底捞外卖，临时取消',
					price: '88.00',
					startLocation: '海底捞(天河店)',
					startAddress: '天河路海底捞火锅店',
					endLocation: '我的位置',
					endAddress: '天河区珠江新城花城大道88号',
					totalDistance: '5.5',
					createTime: '2024-12-12 18:45',
					status: 'cancelled',
					statusText: '已取消',
					statusClass: 'status-cancelled',
					providerPhone: null
				}
			]
		};
	},
	computed: {
		// 当前使用的标签配置
		currentTabs() {
			return this.currentRole === 'provider' ? this.providerTabs : this.customerTabs;
		},
		// 当前使用的订单数据
		currentOrders() {
			return this.currentRole === 'provider' ? this.providerOrders : this.customerOrders;
		},
		// 筛选后的订单
		filteredOrders() {
			if (this.currentTab === 0) {
				return this.currentOrders;
			}
			const currentType = this.currentTabs[this.currentTab].type;
			return this.currentOrders.filter(order => order.status === currentType);
		}
	},
	onLoad(e) {
		// judgeLogin((userInfo, error) => {
		// 	if (userInfo) {
		// 		console.log('用户已登录:', userInfo);
		// 		this.loadOrderList();
		// 	} else {
		// 		console.log('未登录，已跳转到登录页面:', error);
		// 	}
		// });
		// 初始化标签计数
		this.updateTabCounts();
	},
	onShow() {
		// 页面显示时刷新订单列表
		this.loadOrderList();
		// 更新标签计数
		this.updateTabCounts();
	},
	//方法
	methods: {
		// 切换用户角色
		switchRole(role) {
			this.currentRole = role;
			this.currentTab = 0; // 重置到第一个标签
			// 更新标签计数
			this.updateTabCounts();
		},
		switchTab(index) {
			this.currentTab = index;
		},
		loadOrderList() {
			// 这里应该从服务器获取订单列表
			console.log('加载订单列表');
		},
		viewOrderDetail(order) {
			// 跳转到订单详情页
			this.onPageJump(`/pages/orderDetail/orderDetail?id=${order.id}`);
		},
		contactCustomer(order) {
			uni.makePhoneCall({
				phoneNumber: order.customerPhone.replace(/\*/g, '1') // 实际使用时应该是完整号码
			});
		},
		contactProvider(order) {
			uni.makePhoneCall({
				phoneNumber: order.providerPhone.replace(/\*/g, '1') // 实际使用时应该是完整号码
			});
		},
		cancelOrder(order) {
			uni.showModal({
				title: '确认取消',
				content: `确定要取消这个${order.typeName}订单吗？取消后无法恢复。`,
				success: (res) => {
					if (res.confirm) {
						// 这里处理取消订单逻辑
						order.status = 'cancelled';
						order.statusText = '已取消';
						order.statusClass = 'status-cancelled';

						// 更新标签计数
						this.updateTabCounts();

						uni.showToast({
							title: '订单已取消',
							icon: 'success'
						});
					}
				}
			});
		},
		rateOrder(order) {
			uni.showModal({
				title: '订单评价',
				content: `请对${order.providerName}的服务进行评价`,
				success: (res) => {
					if (res.confirm) {
						// 这里应该跳转到评价页面
						uni.showToast({
							title: '感谢您的评价',
							icon: 'success'
						});
					}
				}
			});
		},
		completeOrder(order) {
			uni.showModal({
				title: '确认完成',
				content: `确定要完成这个${order.typeName}订单吗？`,
				success: (res) => {
					if (res.confirm) {
						// 这里处理完成订单逻辑
						order.status = 'completed';
						order.statusText = '已完成';
						order.statusClass = 'status-completed';

						// 更新标签计数
						this.updateTabCounts();

						uni.showToast({
							title: '订单已完成',
							icon: 'success'
						});
					}
				}
			});
		},
		updateTabCounts() {
			const orders = this.currentOrders;
			const tabs = this.currentTabs;

			if (this.currentRole === 'provider') {
				tabs[1].count = orders.filter(order => order.status === 'in_progress').length;
				tabs[2].count = orders.filter(order => order.status === 'completed').length;
				tabs[3].count = orders.filter(order => order.status === 'cancelled').length;
			} else {
				tabs[1].count = orders.filter(order => order.status === 'pending').length;
				tabs[2].count = orders.filter(order => order.status === 'delivering').length;
				tabs[3].count = orders.filter(order => order.status === 'completed').length;
				tabs[4].count = orders.filter(order => order.status === 'cancelled').length;
			}
			tabs[0].count = orders.length;
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
		this.loadOrderList();
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

.order-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

// 角色切换样式
.role-switch {
	display: flex;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 12rpx;
	padding: 8rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.role-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 10rpx;
		border-radius: 8rpx;
		transition: all 0.3s ease;

		&.active {
			background: linear-gradient(135deg, $themeColor, #ff8a65);
			box-shadow: 0 4rpx 12rpx rgba(234, 85, 45, 0.3);

			.role-text {
				color: #fff;
				font-weight: bold;
			}

			.role-desc {
				color: rgba(255, 255, 255, 0.8);
			}
		}

		.role-text {
			display: block;
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
			margin-bottom: 6rpx;
			transition: all 0.3s ease;
		}

		.role-desc {
			font-size: 22rpx;
			color: #666;
			transition: all 0.3s ease;
		}
	}
}

// 订单状态标签样式
.order-tabs {
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
			.tab-text {
				color: $themeColor;
				font-weight: bold;
				transform: scale(1.05);
			}

			.tab-count {
				background-color: $themeColor;
				color: #fff;
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

	.tab-text {
		font-size: 28rpx;
		color: #666;
		transition: all 0.3s ease;
		margin-bottom: 8rpx;
	}

	.tab-count {
		font-size: 20rpx;
		background-color: #ff4757;
		color: #fff;
		padding: 2rpx 8rpx;
		border-radius: 10rpx;
		min-width: 20rpx;
		text-align: center;
		line-height: 1.2;
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
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;

	&:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.12);
	}
}

// 订单头部
.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #fafafa;
	border-bottom: 1rpx solid #f0f0f0;

	.order-info {
		flex: 1;

		.order-number {
			display: block;
			font-size: 26rpx;
			color: #333;
			font-weight: 500;
			margin-bottom: 6rpx;
		}

		.order-time {
			font-size: 22rpx;
			color: #999;
			display: flex;
		}
	}

	.order-status {
		padding: 8rpx 16rpx;
		border-radius: 12rpx;

		.status-text {
			font-size: 22rpx;
			font-weight: bold;
		}

		&.status-progress {
			background-color: #fff7e6;

			.status-text {
				color: #fa8c16;
			}
		}

		&.status-completed {
			background-color: #f6ffed;

			.status-text {
				color: #52c41a;
			}
		}

		&.status-cancelled {
			background-color: #fff1f0;

			.status-text {
				color: #ff4d4f;
			}
		}

		&.status-pending {
			background-color: #f6ffed;

			.status-text {
				color: #52c41a;
			}
		}

		&.status-delivering {
			background-color: #e6f7ff;

			.status-text {
				color: #1890ff;
			}
		}
	}
}

// 订单内容
.order-content {
	padding: 30rpx;
}

.content-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;

	.order-type-wrapper {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.order-type {
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
		padding: 6rpx 16rpx;
		border-radius: 12rpx;

		&.type-send {
			background: linear-gradient(135deg, #ff6b35, #f7931e);
		}

		&.type-pick {
			background: linear-gradient(135deg, #4ecdc4, #44a08d);
		}

		&.type-buy {
			background: linear-gradient(135deg, #45b7d1, #96c93d);
		}

		&.type-food {
			background: linear-gradient(135deg, #ff9800, #ff5722);
		}
	}

	.order-price {
		display: flex;
		align-items: baseline;

		.price-symbol {
			font-size: 22rpx;
			color: $themeColor;
			font-weight: bold;
			margin-right: 4rpx;
		}

		.price-amount {
			font-size: 32rpx;
			color: $themeColor;
			font-weight: bold;
		}
	}
}

.order-description {
	margin-bottom: 25rpx;

	.desc-text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
		@include bov(2);
	}
}

// 地址信息
.order-address {
	margin-bottom: 25rpx;
	background-color: #fafafa;
	border-radius: 12rpx;
	padding: 20rpx;

	.address-item {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.address-label {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		font-weight: bold;
		color: #fff;
		margin-right: 20rpx;
		flex-shrink: 0;

		&.pickup-label {
			background: linear-gradient(135deg, #4ecdc4, #44a08d);
		}

		&.delivery-label {
			background: linear-gradient(135deg, #ea552d, #f7931e);
		}
	}

	.address-info {
		flex: 1;

		.address-name {
			display: block;
			font-size: 26rpx;
			color: #333;
			font-weight: 500;
		}

		.address-detail {
			font-size: 22rpx;
			color: #666;
			line-height: 1.3;
			display: flex;
		}
	}
}

// 订单底部
.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.footer-left {
		.distance-text {
			font-size: 22rpx;
			color: #999;
		}
	}

	.footer-right {
		display: flex;
		gap: 12rpx;
	}
}

// 操作按钮
.action-btn {
	padding: 12rpx 20rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;

	.btn-text {
		font-size: 22rpx;
		font-weight: bold;
	}

	&.secondary-btn {
		background-color: #f5f5f5;
		border: 1rpx solid #ddd;

		.btn-text {
			color: #666;
		}

		&:active {
			background-color: #ebebeb;
		}
	}

	&.primary-btn {
		@include theme('btn_bg');

		.btn-text {
			color: #fff;
		}

		&:active {
			transform: scale(0.95);
		}
	}

	&.success-btn {
		background: linear-gradient(135deg, #52c41a, #73d13d);

		.btn-text {
			color: #fff;
		}

		&:active {
			transform: scale(0.95);
		}
	}

	&.warning-btn {
		background: linear-gradient(135deg, #faad14, #ffc53d);

		.btn-text {
			color: #fff;
		}

		&:active {
			transform: scale(0.95);
		}
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
