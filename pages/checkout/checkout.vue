<template>
  <view class="checkout-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">确认订单</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <!-- 配送地址 -->
    <view class="address-section">
      <view class="section-header">
        <text class="section-icon">📍</text>
        <text class="section-title">配送地址</text>
        <text class="change-btn" @click="changeAddress">{{ addressInfo.address ? '更换' : '添加' }}</text>
      </view>
      <view class="address-card" v-if="addressInfo.address">
        <view class="address-info">
          <text class="address-name">{{ addressInfo.name }}</text>
          <text class="address-phone">{{ addressInfo.phone }}</text>
        </view>
        <text class="address-detail">{{ addressInfo.address }}</text>
      </view>
      <view class="no-address-card" v-else @click="changeAddress">
        <text class="no-address-icon">📍</text>
        <text class="no-address-text">请选择配送地址</text>
        <text class="no-address-arrow">></text>
      </view>
    </view>

    <!-- 配送时间 -->
    <view class="delivery-section">
      <view class="section-header">
        <text class="section-icon">🕐</text>
        <text class="section-title">配送时间</text>
      </view>
      <view class="delivery-options">
        <view 
          v-for="(option, index) in deliveryOptions" 
          :key="index"
          class="delivery-option"
          :class="{ active: selectedDeliveryOption === index }"
          @click="selectDeliveryOption(index)"
        >
          <text class="option-text">{{ option.text }}</text>
          <text class="option-desc">{{ getDeliveryDesc(index) }}</text>
        </view>
      </view>
      
      <!-- 预约时间选择器 -->
      <view v-if="selectedDeliveryOption === 1" class="time-picker-section">
        <view class="time-picker-header">
          <text class="picker-title">选择送达时间</text>
        </view>
        <view class="time-picker-container">
          <view class="date-picker">
            <text class="picker-label">日期</text>
            <picker mode="date" :value="selectedDate" @change="onDateChange" :start="todayDate" :end="maxDate">
              <view class="picker-value">
                <text>{{ formatDate(selectedDate) }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>
          <view class="time-picker">
            <text class="picker-label">时间</text>
            <picker mode="time" :value="selectedTime" @change="onTimeChange">
              <view class="picker-value">
                <text>{{ selectedTime }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>
        </view>
        <view class="time-tips">
          <text class="tips-text">• 配送时间为{{ (shopInfo.businessHours && shopInfo.businessHours.open) || '09:00' }}-{{ (shopInfo.businessHours && shopInfo.businessHours.close) || '21:00' }}</text>
          <text class="tips-text">• 请至少提前1小时预约</text>
        </view>
      </view>
    </view>

    <!-- 店铺信息 -->
    <view class="shop-section">
      <view class="shop-header">
        <text class="shop-name">{{ shopInfo.name }}</text>
        <text class="shop-status">营业中</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-section">
      <view class="goods-list">
        <view v-for="(item, key) in cartItems" :key="key" class="goods-item">
          <view class="item-info">
            <image :src="getItemImage(key)" mode="aspectFill" class="item-image"></image>
            <view class="item-details">
              <text class="item-name">{{ getItemName(key) }}</text>
              <text class="item-spec" v-if="getItemSpec(key)">{{ getItemSpec(key) }}</text>
              <view class="item-price-qty">
                <text class="item-price">¥{{ getItemPrice(key) }}</text>
                <text class="item-quantity">×{{ item }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券 -->
    <!-- <view class="coupon-section">
      <view class="section-header">
        <text class="section-icon">🎫</text>
        <text class="section-title">优惠券</text>
        <text class="coupon-btn" @click="selectCoupon">选择优惠券</text>
      </view>
      <view class="coupon-info" v-if="selectedCoupon">
        <text class="coupon-name">{{ selectedCoupon.name }}</text>
        <text class="coupon-discount">-¥{{ selectedCoupon.discount }}</text>
      </view>
      <view class="no-coupon" v-else>
        <text class="no-coupon-text">暂无可用优惠券</text>
      </view>
    </view> -->

    <!-- 备注 -->
    <view class="remark-section" @click.stop>
      <view class="section-header">
        <text class="section-icon">📝</text>
        <text class="section-title">备注</text>
      </view>
      <textarea 
        class="remark-input" 
        v-model="remark" 
        placeholder="请输入备注信息（选填）"
        maxlength="100"
        @click.stop
      ></textarea>
    </view>

    <!-- 费用明细 -->
    <view class="cost-section">
      <view class="cost-item">
        <text class="cost-label">商品小计</text>
        <text class="cost-value">¥{{ cartTotal }}</text>
      </view>
      <view class="cost-item">
        <text class="cost-label">配送费</text>
        <text class="cost-value">¥{{ shopInfo.deliveryFee }}</text>
      </view>
      <view class="cost-item" v-if="selectedCoupon">
        <text class="cost-label">优惠券</text>
        <text class="cost-value discount">-¥{{ selectedCoupon.discount }}</text>
      </view>
      <view class="cost-total">
        <text class="total-label">实付金额</text>
        <text class="total-value">¥{{ finalTotal }}</text>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="submit-section">
      <view class="submit-info">
        <text class="submit-total">¥{{ finalTotal }}</text>
        <text class="submit-desc">{{ deliveryTime }}</text>
      </view>
      <view class="submit-btn" @click.stop="submitOrder">
        <text class="submit-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 购物车数据
      cartItems: {},
      cartTotal: 0,
      shopInfo: {},
      
      // 配送地址
      addressInfo: {
        id: null,
        name: '',
        phone: '',
        address: ''
      },
      
      // 配送时间选项
      deliveryOptions: [
        { text: '立即配送', desc: '预计45分钟送达' },
        { text: '预约配送', desc: '选择具体送达时间' }
      ],
      selectedDeliveryOption: 0,
      
      // 预约时间相关
      selectedDate: '',
      selectedTime: '12:00',
      todayDate: '',
      maxDate: '',
      
      // 优惠券
      selectedCoupon: null,
      
      // 备注
      remark: '',
      
      // 商品数据缓存
      goodsData: {}
    }
  },
  
  computed: {
    // 最终总价
    finalTotal() {
      let total = this.cartTotal + this.shopInfo.deliveryFee;
      if (this.selectedCoupon) {
        total -= this.selectedCoupon.discount;
      }
      return Math.max(0, total).toFixed(2);
    },
    
    // 配送时间
    deliveryTime() {
      if (this.selectedDeliveryOption === 0) {
        return this.deliveryOptions[0].desc;
      } else {
        if (this.selectedDate && this.selectedTime) {
          const date = this.formatDate(this.selectedDate);
          return `${date} ${this.selectedTime}`;
        }
        return '请选择送达时间';
      }
    }
  },
  
  onLoad(options) {
    // 接收从店铺详情页传递的数据
    if (options.cartData) {
      try {
        const data = JSON.parse(decodeURIComponent(options.cartData));
        console.log(data);
        
        this.cartItems = data.cartItems;
        this.cartTotal = data.cartTotal;
        this.shopInfo = data.shopInfo;
        
        // 使用从shopDetail传递过来的真实商品数据
        if (data.goodsData) {
          this.goodsData = data.goodsData;
        } else {
          // 兼容旧版本，使用模拟数据
          this.initGoodsData();
        }
      } catch (e) {
        console.error('解析购物车数据失败:', e);
        uni.showToast({
          title: '数据错误',
          icon: 'error'
        });
      }
    }
    
    // 获取默认地址
    this.getDefaultAddress();
    
    // 初始化日期数据
    this.initDateData();
    
    // 监听地址选择事件
    uni.$on('addressSelected', (address) => {
      this.addressInfo = {
        id: address._id || address.id,
        name: address.receiverName || address.name,
        phone: address.receiverPhone || address.phone,
        address: (address.address || '') + (address.detailAddress || '')
      };
    });
  },
  
  onUnload() {
    // 移除事件监听
    uni.$off('addressSelected');
  },
  
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 初始化商品数据（模拟数据）
    initGoodsData() {
      // 这里应该根据购物车中的商品ID从API获取商品详情
      // 现在使用模拟数据
      this.goodsData = {
        '1': { name: '招牌汉堡套餐', image: '/static/goods1.jpg', price: 28.8 },
        '2': { name: '香辣鸡腿堡', image: '/static/goods2.jpg', price: 22.0 },
        '3': { name: '薯条(大)', image: '/static/goods3.jpg', price: 12.0 }
      };
    },
    
    // 获取商品图片
    getItemImage(cartKey) {
      // 优先使用传递过来的商品数据
      if (this.goodsData[cartKey]) {
        return this.goodsData[cartKey].image || 'https://qcloud.dpfile.com/pc/cTtFrc8ybddtJ8cEQ7fXETOzhZD-1hbkXWvQfhsLtaplHP4aageCjl4jaSKDt6aH.jpg';
      }
      
      // 兼容旧版本的数据结构
      const goodsId = cartKey.split('_')[0];
      return (this.goodsData[goodsId] && this.goodsData[goodsId].image) || 'https://qcloud.dpfile.com/pc/cTtFrc8ybddtJ8cEQ7fXETOzhZD-1hbkXWvQfhsLtaplHP4aageCjl4jaSKDt6aH.jpg';
    },
    
    // 获取商品名称
    getItemName(cartKey) {
      // 优先使用传递过来的商品数据
      if (this.goodsData[cartKey]) {
        return this.goodsData[cartKey].name || '未知商品';
      }
      
      // 兼容旧版本的数据结构
      const goodsId = cartKey.split('_')[0];
      return (this.goodsData[goodsId] && this.goodsData[goodsId].name) || '未知商品';
    },
    
    // 获取商品规格
    getItemSpec(cartKey) {
      // 优先使用传递过来的规格信息
      if (this.goodsData[cartKey] && this.goodsData[cartKey].specs) {
        return this.goodsData[cartKey].specs;
      }
      
      // 兼容旧版本，从cartKey解析规格
      const parts = cartKey.split('_');
      if (parts.length > 1) {
        return parts.slice(1).join(', ');
      }
      return '';
    },
    
    // 获取商品价格
    getItemPrice(cartKey) {
      // 优先使用传递过来的商品数据
      if (this.goodsData[cartKey]) {
        return this.goodsData[cartKey].price || 0;
      }
      
      // 兼容旧版本的数据结构
      const goodsId = cartKey.split('_')[0];
      return (this.goodsData[goodsId] && this.goodsData[goodsId].price) || 0;
    },
    
    // 获取默认地址
    async getDefaultAddress() {
      try {
        const res = await this.$http.post('api/user/address/default');
        if (res.data && res.data._id) {
          this.addressInfo = {
            id: res.data._id,
            name: res.data.receiverName,
            phone: res.data.receiverPhone,
            address: (res.data.address || '') + (res.data.detailAddress || '')
          };
        } else {
          // 如果没有默认地址，保持原有的模拟数据或清空
          console.log('暂无默认地址');
        }
      } catch (error) {
        console.error('获取默认地址失败:', error);
        // 获取失败时不显示错误提示，保持原有地址信息
      }
    },
    
    // 更换地址
    changeAddress() {
      uni.navigateTo({
        url: '/pages/address/address?selectMode=true&selectedId=' + (this.addressInfo.id || '')
      });
    },
    
    // 选择配送时间
    selectDeliveryOption(index) {
      this.selectedDeliveryOption = index;
      if (index === 1 && !this.selectedDate) {
        // 如果选择预约配送且没有选择日期，默认选择今天
        this.selectedDate = this.todayDate;
      }
    },
    
    // 初始化日期数据
    initDateData() {
      const today = new Date();
      const maxDay = new Date();
      maxDay.setDate(today.getDate() + 7); // 最多可预约7天后
      
      this.todayDate = this.formatDateForPicker(today);
      this.maxDate = this.formatDateForPicker(maxDay);
      this.selectedDate = this.todayDate;
      
      // 设置默认时间为当前时间1小时后
      this.setDefaultTime();
    },
    
    // 设置默认时间为当前时间1小时后
    setDefaultTime() {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1小时后
      
      // 获取店铺营业时间
      const shopOpenTime = (this.shopInfo.businessHours && this.shopInfo.businessHours.open) || '09:00';
      const shopCloseTime = (this.shopInfo.businessHours && this.shopInfo.businessHours.close) || '21:00';
      
      const [openHour, openMinute] = shopOpenTime.split(':').map(Number);
      const [closeHour, closeMinute] = shopCloseTime.split(':').map(Number);
      
      const oneHourLaterMinutes = oneHourLater.getHours() * 60 + oneHourLater.getMinutes();
      const openMinutes = openHour * 60 + openMinute;
      const closeMinutes = closeHour * 60 + closeMinute;
      
      let defaultHour, defaultMinute;
      
      // 如果1小时后的时间在营业时间范围内，使用1小时后的时间
      if (oneHourLaterMinutes >= openMinutes && oneHourLaterMinutes <= closeMinutes) {
        defaultHour = oneHourLater.getHours();
        defaultMinute = oneHourLater.getMinutes();
      } else if (oneHourLaterMinutes < openMinutes) {
        // 如果1小时后还没到营业时间，使用营业开始时间
        defaultHour = openHour;
        defaultMinute = openMinute;
      } else {
        // 如果1小时后已经超过营业时间，使用明天的营业开始时间
        defaultHour = openHour;
        defaultMinute = openMinute;
        // 如果是今天且已经过了营业时间，日期应该设置为明天
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        this.selectedDate = this.formatDateForPicker(tomorrow);
      }
      
      const hours = String(defaultHour).padStart(2, '0');
      const minutes = String(defaultMinute).padStart(2, '0');
      
      this.selectedTime = `${hours}:${minutes}`;
    },
    
    // 格式化日期用于picker
    formatDateForPicker(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    // 格式化日期用于显示
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      if (dateStr === this.formatDateForPicker(today)) {
        return '今天';
      } else if (dateStr === this.formatDateForPicker(tomorrow)) {
        return '明天';
      } else {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
      }
    },
    
    // 日期选择变化
    onDateChange(e) {
      this.selectedDate = e.detail.value;
    },
    
    // 时间选择变化
    onTimeChange(e) {
      const time = e.detail.value;
      const [hour, minute] = time.split(':');
      
      // 获取店铺营业时间
      const shopOpenTime = (this.shopInfo.businessHours && this.shopInfo.businessHours.open) || '09:00';
      const shopCloseTime = (this.shopInfo.businessHours && this.shopInfo.businessHours.close) || '21:00';
      
      const [openHour, openMinute] = shopOpenTime.split(':').map(Number);
      const [closeHour, closeMinute] = shopCloseTime.split(':').map(Number);
      
      const selectedMinutes = parseInt(hour) * 60 + parseInt(minute);
      const openMinutes = openHour * 60 + openMinute;
      const closeMinutes = closeHour * 60 + closeMinute;
      
      // 验证时间范围（店铺营业时间）
      if (selectedMinutes < openMinutes || selectedMinutes > closeMinutes) {
        uni.showToast({
          title: `配送时间为${shopOpenTime}-${shopCloseTime}`,
          icon: 'none'
        });
        return;
      }
      
      // 如果选择的是今天，需要验证是否至少提前1小时
      if (this.selectedDate === this.todayDate) {
        const now = new Date();
        const selectedDateTime = new Date();
        selectedDateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
        
        const timeDiff = selectedDateTime.getTime() - now.getTime();
        const minDiff = timeDiff / (1000 * 60);
        
        if (minDiff < 60) {
          uni.showToast({
            title: '请至少提前1小时预约',
            icon: 'none'
          });
          return;
        }
      }
      
      this.selectedTime = time;
    },
    
    // 获取配送描述
    getDeliveryDesc(index) {
      if (index === 0) {
        return this.deliveryOptions[0].desc;
      } else {
        if (this.selectedDate && this.selectedTime) {
          const date = this.formatDate(this.selectedDate);
          return `${date} ${this.selectedTime}`;
        }
        return this.deliveryOptions[1].desc;
      }
    },
    
    // 选择优惠券
    selectCoupon() {
      uni.showToast({
        title: '跳转到优惠券选择',
        icon: 'none'
      });
    },
    
    // 提交订单
    async submitOrder() {
      if (!this.addressInfo.address || !this.addressInfo.name || !this.addressInfo.phone) {
        uni.showToast({
          title: '请选择配送地址',
          icon: 'none'
        });
        // 自动跳转到地址选择页面
        setTimeout(() => {
          this.changeAddress();
        }, 1500);
        return;
      }
      
      // 如果选择预约配送，验证时间选择
      if (this.selectedDeliveryOption === 1) {
        if (!this.selectedDate || !this.selectedTime) {
          uni.showToast({
            title: '请选择送达时间',
            icon: 'error'
          });
          return;
        }
      }
      
      // 构建规范的订单数据 - 只包含订单生成必需的字段
      const orderData = {
        // 店铺基本信息
        shopId: this.shopInfo.id,
        shopName: this.shopInfo.name,
        
        // 订单商品列表
        orderItems: Object.keys(this.cartItems).map(goodsKey => {
          const quantity = this.cartItems[goodsKey];
          const goods = this.goodsData[goodsKey];
          return {
            goodsId: goods.id,
            goodsName: goods.name,
            price: goods.price,
            quantity: quantity,
            specs: goods.specs || '',
            image: goods.image,
            subtotal: goods.price * quantity
          };
        }),
        
        // 配送地址信息
        deliveryAddress: {
          name: this.addressInfo.name,
          phone: this.addressInfo.phone,
          address: this.addressInfo.address,
          latitude: this.addressInfo.latitude || 0,
          longitude: this.addressInfo.longitude || 0
        },
        
        // 配送类型和时间
        deliveryType: this.selectedDeliveryOption, // 0-立即送达，1-预约配送
        deliveryTime: this.selectedDeliveryOption === 1 ? this.deliveryTime : null,
        
        // 费用信息
        goodsAmount: this.cartTotal,
        deliveryFee: this.shopInfo.deliveryFee || 0,
        couponAmount: this.selectedCoupon ? this.selectedCoupon.amount : 0,
        totalAmount: parseFloat(this.finalTotal),
        
        // 其他信息
        remark: this.remark || '',
        orderTime: new Date().toISOString()
      };
      
      // 打印规范的订单数据，方便调试和接口开发
       console.log('=== 规范订单数据 ===');
       console.log('完整订单数据:', JSON.stringify(orderData, null, 2));
       console.log('店铺ID:', orderData.shopId);
       console.log('店铺名称:', orderData.shopName);
       console.log('订单商品列表:', orderData.orderItems);
       console.log('配送地址:', orderData.deliveryAddress);
       console.log('配送类型:', orderData.deliveryType, orderData.deliveryType === 0 ? '(立即送达)' : '(预约配送)');
       console.log('配送时间:', orderData.deliveryTime);
       console.log('商品金额:', orderData.goodsAmount);
       console.log('配送费:', orderData.deliveryFee);
       console.log('优惠券抵扣:', orderData.couponAmount);
       console.log('订单总金额:', orderData.totalAmount);
       console.log('订单备注:', orderData.remark);
       console.log('下单时间:', orderData.orderTime);
       console.log('==================');
      
      uni.showLoading({
        title: '提交中...'
      });
      
      // 调用后端订单创建接口
      try {
        const response = await this.$http.post('api/order/create', orderData);
        
        // 订单创建成功
        uni.showToast({
          title: '订单创建成功',
          icon: 'success'
        });
        
        // 清空购物车
        this.$store.commit('cart/clearCart');
        
        // 跳转到支付页面，传递订单信息
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/payment/payment?orderId=${response.data.orderId}&orderNumber=${response.data.orderNumber}&totalAmount=${response.data.totalAmount}`
          });
        }, 500);
        
      } catch (error) {
        console.error('提交订单失败:', error);
        uni.showToast({
          title: error.errMsg || '订单创建失败，请重试',
          icon: 'none',
          duration: 3000
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 120px;
  padding-top: 88px;
}

// 顶部导航栏
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44px 16px 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .nav-left, .nav-right {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }
  
  .nav-right {
    background: transparent;
  }
  
  .back-btn {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
  
  .nav-title {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
}

// 通用卡片样式
.section-card {
  margin: 16px 16px 16px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

// 通用标题样式
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .section-icon {
    font-size: 16px;
    margin-right: 8px;
  }
  
  .section-title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .change-btn, .coupon-btn {
    color: #667eea;
    font-size: 14px;
    font-weight: 500;
  }
}

// 配送地址
.address-section {
  @extend .section-card;
  
  .address-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    
    .address-info {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .address-name {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        margin-right: 12px;
      }
      
      .address-phone {
        font-size: 14px;
        color: #666;
      }
    }
    
    .address-detail {
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }
  }
  
  .no-address-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px dashed #ddd;
    
    .no-address-icon {
      font-size: 20px;
      margin-right: 12px;
    }
    
    .no-address-text {
      flex: 1;
      font-size: 16px;
      color: #999;
    }
    
    .no-address-arrow {
      font-size: 16px;
      color: #999;
    }
  }
}

// 配送时间
.delivery-section {
  @extend .section-card;
  
  .delivery-options {
    display: flex;
    gap: 12px;
    
    .delivery-option {
      flex: 1;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &.active {
        background: #f0f4ff;
        border-color: #667eea;
      }
      
      .option-text {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 4px;
      }
      
      .option-desc {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  // 时间选择器
  .time-picker-section {
    margin-top: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    
    .time-picker-header {
      margin-bottom: 16px;
      
      .picker-title {
        font-size: 14px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }
    
    .time-picker-container {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      
      .date-picker,
      .time-picker {
        flex: 1;
        
        .picker-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .picker-value {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          
          text {
            font-size: 14px;
            color: #1a1a1a;
          }
          
          .picker-arrow {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
    
    .time-tips {
      .tips-text {
        display: block;
        font-size: 12px;
        color: #999;
        line-height: 1.5;
        margin-bottom: 4px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 店铺信息
.shop-section {
  @extend .section-card;
  
  .shop-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .shop-name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .shop-status {
      background: linear-gradient(135deg, #4ecdc4, #44a08d);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  }
}

// 商品列表
.goods-section {
  @extend .section-card;
  
  .goods-list {
    .goods-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .item-info {
        display: flex;
        align-items: center;
        flex: 1;
        
        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          margin-right: 12px;
        }
        
        .item-details {
          flex: 1;
          
          .item-name {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 4px;
          }
          
          .item-spec {
            display: block;
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }
          
          .item-price-qty {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .item-price {
              font-size: 16px;
              font-weight: 600;
              color: #ff6b6b;
            }
            
            .item-quantity {
              font-size: 14px;
              color: #666;
            }
          }
        }
      }
    }
  }
}

// 优惠券
.coupon-section {
  @extend .section-card;
  
  .coupon-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(135deg, #ffeaa7, #fab1a0);
    border-radius: 12px;
    
    .coupon-name {
      font-size: 14px;
      font-weight: 600;
      color: #d63031;
    }
    
    .coupon-discount {
      font-size: 16px;
      font-weight: 700;
      color: #d63031;
    }
  }
  
  .no-coupon {
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 12px;
    text-align: center;
    
    .no-coupon-text {
      font-size: 14px;
      color: #999;
    }
  }
}

// 备注
.remark-section {
  @extend .section-card;
  
  .remark-input {
    width: 100%;
    height: 60px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 12px;
    border: none;
    font-size: 14px;
    color: #1a1a1a;
    resize: none;
    
    &::placeholder {
      color: #999;
    }
  }
}

// 费用明细
.cost-section {
  @extend .section-card;
  
  .cost-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    
    .cost-label {
      font-size: 14px;
      color: #666;
    }
    
    .cost-value {
      font-size: 14px;
      color: #1a1a1a;
      
      &.discount {
        color: #ff6b6b;
      }
    }
  }
  
  .cost-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0 0;
    margin-top: 12px;
    border-top: 1px solid #f0f0f0;
    
    .total-label {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .total-value {
      font-size: 20px;
      font-weight: 700;
      color: #ff6b6b;
    }
  }
}

// 底部提交按钮
.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  
  .submit-info {
    flex: 1;
    
    .submit-total {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    
    .submit-desc {
      font-size: 12px;
      color: #999;
    }
  }
  
  .submit-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 14px 32px;
    border-radius: 25px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    
    .submit-text {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>