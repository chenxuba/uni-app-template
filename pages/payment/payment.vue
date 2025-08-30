<template>
  <view class="payment-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">订单支付</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info-section">
      <view class="section-header">
        <text class="section-icon">📋</text>
        <text class="section-title">订单信息</text>
      </view>
      <view class="order-card">
        <view class="shop-info">
          <image class="shop-avatar" :src="orderData.shopInfo.avatar" mode="aspectFill"></image>
          <view class="shop-details">
            <text class="shop-name">{{ orderData.shopInfo.name }}</text>
            <text class="order-number">订单号：{{ orderNumber }}</text>
          </view>
        </view>
        <view class="goods-summary" @click="toggleGoodsList">
          <text class="goods-count">共{{ totalItems }}件商品</text>
          <view class="summary-right">
            <text class="order-amount">￥{{ orderData.totalAmount }}</text>
            <text class="toggle-icon">{{ showGoodsList ? '▲' : '▼' }}</text>
          </view>
        </view>
        
        <!-- 商品列表 -->
        <view class="goods-list" v-if="showGoodsList">
          <view 
            v-for="item in orderData.cartItems" 
            :key="item.id"
            class="goods-item"
          >
            <image class="goods-image" :src="item.image" mode="aspectFill"></image>
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <view class="goods-price-qty">
                <text class="goods-price">￥{{ item.price }}</text>
                <text class="goods-quantity">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="payment-method-section">
      <view class="section-header">
        <text class="section-icon">💳</text>
        <text class="section-title">支付方式</text>
      </view>
      <view class="payment-methods">
        <view 
          v-for="(method, index) in paymentMethods" 
          :key="index"
          class="payment-method"
          :class="{ active: selectedPaymentMethod === index }"
          @click="selectPaymentMethod(index)"
        >
          <view class="method-left">
            <image class="method-icon" :src="method.icon" mode="aspectFit"></image>
            <view class="method-info">
              <text class="method-name">{{ method.name }}</text>
              <text class="method-desc">{{ method.desc }}</text>
            </view>
          </view>
          <view class="method-right">
            <view class="radio" :class="{ checked: selectedPaymentMethod === index }">
              <text v-if="selectedPaymentMethod === index" class="radio-dot">●</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠信息 -->
    <!-- <view class="discount-section" v-if="orderData.coupon">
      <view class="section-header">
        <text class="section-icon">🎫</text>
        <text class="section-title">优惠信息</text>
      </view>
      <view class="discount-card">
        <text class="discount-name">{{ orderData.coupon.name }}</text>
        <text class="discount-amount">-￥{{ orderData.coupon.discount }}</text>
      </view>
    </view> -->

    <!-- 费用明细 -->
    <view class="cost-detail-section">
      <view class="section-header">
        <text class="section-icon">💰</text>
        <text class="section-title">费用明细</text>
      </view>
      <view class="cost-details">
        <view class="cost-item">
          <text class="cost-label">商品金额</text>
          <text class="cost-value">￥{{ goodsAmount }}</text>
        </view>
        <view class="cost-item">
          <text class="cost-label">配送费</text>
          <text class="cost-value">￥{{ deliveryFee }}</text>
        </view>
        <!-- <view class="cost-item" v-if="orderData.coupon">
          <text class="cost-label">优惠减免</text>
          <text class="cost-value discount">-￥{{ orderData.coupon.discount }}</text>
        </view> -->
        <view class="cost-item total">
          <text class="cost-label">实付金额</text>
          <text class="cost-value">￥{{ orderData.totalAmount }}</text>
        </view>
      </view>
    </view>

    <!-- 底部支付按钮 -->
    <view class="payment-footer">
      <view class="payment-info">
        <text class="payment-label">实付金额</text>
        <text class="payment-amount">￥{{ orderData.totalAmount }}</text>
      </view>
      <view class="pay-btn" @click="processPayment">
        <text class="pay-text">立即支付</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderData: {
        shopInfo: {
          name: '美味餐厅',
          avatar: 'https://gips0.baidu.com/it/u=2635637893,499839965&fm=3074&app=3074&f=JPEG'
        },
        cartItems: [
          {
            id: 1,
            name: '宫保鸡丁',
            price: 28.00,
            quantity: 2,
            image: 'https://qcloud.dpfile.com/pc/AYKVFlHq5LZMSw74_nFMBKfWBpulLe7C_t_xxIo1wEUo-MshgBbiA_3Mv0AKp4cx.jpg'
          },
          {
            id: 2,
            name: '麻婆豆腐',
            price: 18.00,
            quantity: 1,
            image: 'https://qcloud.dpfile.com/pc/AYKVFlHq5LZMSw74_nFMBKfWBpulLe7C_t_xxIo1wEUo-MshgBbiA_3Mv0AKp4cx.jpg'

          },
          {
            id: 3,
            name: '红烧肉',
            price: 35.00,
            quantity: 1,
            image: 'https://qcloud.dpfile.com/pc/AYKVFlHq5LZMSw74_nFMBKfWBpulLe7C_t_xxIo1wEUo-MshgBbiA_3Mv0AKp4cx.jpg'

          }
        ],
        deliveryOption: {
          name: '标准配送',
          fee: 3
        },
        coupon: {
          name: '新用户优惠券',
          discount: 5
        },
        totalAmount: 99.00
      },
      orderNumber: '202501271234567890',
      selectedPaymentMethod: 0,
      paymentMethods: [
        {
          name: '微信支付',
          desc: '推荐使用微信支付',
          icon: 'https://bkimg.cdn.bcebos.com/pic/d1a20cf431adcbef76098c5e3fe639dda3cc7cd9311b'
        },
        {
          name: '余额支付',
          desc: '当前余额：￥128.50',
          icon: 'https://t8.baidu.com/it/u=3910782932,1536606427&fm=193'
        }
      ],
      paymentProcessing: false,
      showGoodsList: false
    };
  },
  
  computed: {
    totalItems() {
      if (!this.orderData.cartItems) return 0;
      return this.orderData.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    
    goodsAmount() {
      if (!this.orderData.cartItems) return 0;
      return this.orderData.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0).toFixed(2);
    },
    
    deliveryFee() {
      return this.orderData.deliveryOption ? this.orderData.deliveryOption.fee || 0 : 3;
    }
  },
  
  onLoad(options) {
    // 使用静态数据，不再从参数中获取
    console.log('支付页面加载，使用静态订单数据');
  },
  
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    generateOrderNumber() {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      this.orderNumber = `${timestamp}${random}`;
    },
    
    selectPaymentMethod(index) {
      this.selectedPaymentMethod = index;
    },
    
    toggleGoodsList() {
      this.showGoodsList = !this.showGoodsList;
    },
    
    processPayment() {
      if (this.paymentProcessing) return;
      
      const paymentMethod = this.paymentMethods[this.selectedPaymentMethod];
      
      uni.showModal({
        title: '确认支付',
        content: `使用${paymentMethod.name}支付￥${this.orderData.totalAmount}？`,
        success: (res) => {
          if (res.confirm) {
            this.executePayment();
          }
        }
      });
    },
    
    executePayment() {
      this.paymentProcessing = true;
      
      uni.showLoading({
        title: '支付中...'
      });
      
      // 模拟支付过程
      setTimeout(() => {
        uni.hideLoading();
        this.paymentProcessing = false;
        
        // 随机模拟支付成功或失败
        const isSuccess = Math.random() > 0.1; // 90%成功率
        
        if (isSuccess) {
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          });
          
          // 跳转到订单详情页面
          setTimeout(() => {
            uni.redirectTo({
              url: `/pages/orderDetail/orderDetail?orderNumber=${this.orderNumber}&status=paid`
            });
          }, 1500);
        } else {
          uni.showToast({
            title: '支付失败，请重试',
            icon: 'error'
          });
        }
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.payment-page {
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
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

// 订单信息
.order-info-section {
  @extend .section-card;
}

.order-card {
  .shop-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .shop-avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      margin-right: 12px;
    }
    
    .shop-details {
      flex: 1;
      
      .shop-name {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      
      .order-number {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .goods-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #f5f5f5;
    .goods-count {
      font-size: 14px;
      color: #666;
    }
    
    .summary-right {
      display: flex;
      align-items: center;
      
      .order-amount {
        font-size: 18px;
        font-weight: 600;
        color: #ff6b6b;
        margin-right: 8px;
      }
      
      .toggle-icon {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .goods-list {
    margin-top: 12px;
    
    .goods-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f8f8f8;
      
      &:last-child {
        border-bottom: none;
      }
      
      .goods-image {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        margin-right: 12px;
      }
      
      .goods-info {
        flex: 1;
        
        .goods-name {
          display: block;
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        
        .goods-price-qty {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .goods-price {
            font-size: 14px;
            color: #ff6b6b;
            font-weight: 500;
          }
          
          .goods-quantity {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}

// 支付方式
.payment-method-section {
  @extend .section-card;
}

.payment-methods {
  .payment-method {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.active {
      .method-name {
        color: #667eea;
      }
    }
    
    .method-left {
      display: flex;
      flex: 1;
      
      .method-icon {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
      
      .method-info {
        .method-name {
          display: block;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 2px;
        }
        
        .method-desc {
          font-size: 12px;
          color: #999;
        }
      }
    }
    
    .method-right {
      .radio {
        width: 20px;
        height: 20px;
        border: 2px solid #ddd;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.checked {
          border-color: #667eea;
          
          .radio-dot {
            color: #667eea;
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 优惠信息
.discount-section {
  @extend .section-card;
}

.discount-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border-radius: 12px;
  
  .discount-name {
    font-size: 14px;
    color: white;
    font-weight: 500;
  }
  
  .discount-amount {
    font-size: 16px;
    color: white;
    font-weight: 600;
  }
}

// 费用明细
.cost-detail-section {
  @extend .section-card;
}

.cost-details {
  .cost-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    
    &.total {
      border-top: 1px solid #f5f5f5;
      margin-top: 8px;
      padding-top: 16px;
      
      .cost-label, .cost-value {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }
    
    .cost-label {
      font-size: 14px;
      color: #666;
    }
    
    .cost-value {
      font-size: 14px;
      color: #333;
      
      &.discount {
        color: #ff6b6b;
      }
    }
  }
}

// 底部支付按钮
.payment-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .payment-info {
    .payment-label {
      display: block;
      font-size: 12px;
      color: #999;
      margin-bottom: 2px;
    }
    
    .payment-amount {
      font-size: 20px;
      font-weight: 600;
      color: #ff6b6b;
    }
  }
  
  .pay-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 12px 32px;
    border-radius: 25px;
    
    .pay-text {
      color: white;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>