<template>
  <view class="shop-detail">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">店铺详情</text>
      </view>
      <view class="nav-right">
        <!-- <text class="share-btn">⋯</text> -->
      </view>
    </view>

    <!-- 店铺卡片 -->
    <view class="shop-card">
      <view class="shop-main">
        <view class="shop-avatar">
          <image :src="shopInfo.logo || shopInfo.avatar" mode="aspectFill"></image>
        </view>
        <view class="shop-info">
          <view class="shop-name">{{ shopInfo.shopName || shopInfo.name }}</view>
          <view class="shop-address" v-if="shopInfo.address">
            <text class="address-icon">📍</text>
            <text class="address-text">{{ shopInfo.address }}</text>
          </view>
          <view class="shop-tags">
            <text class="tag" v-for="tag in shopInfo.tags" :key="tag">{{ tag }}</text>
          </view>
        </view>
      </view>
      
      <!-- 店铺评分信息行 -->
      <view class="shop-meta">
        <view class="rating-box">
          <text class="star">⭐</text>
          <text class="rating">{{ shopInfo.rating }}</text>
        </view>
        <text class="sales">月售{{ shopInfo.monthlySales }}单</text>
        <view class="business-hours" v-if="shopInfo.businessHours.open">
          <text class="hours-text">营业时间：{{ shopInfo.businessHours.open }}-{{ shopInfo.businessHours.close }}</text>
        </view>
      </view>
      
      <!-- 配送信息卡片 -->
      <view class="delivery-card">
        <view class="delivery-item">
          <text class="delivery-icon">🚚</text>
          <view class="delivery-info">
            <text class="delivery-title">配送费 ¥{{ shopInfo.deliveryFee }}</text>
            <text class="delivery-desc">预计{{ shopInfo.deliveryTime }}送达</text>
          </view>
        </view>
        <view class="delivery-item">
          <text class="delivery-icon">💰</text>
          <view class="delivery-info">
            <text class="delivery-title">起送 ¥{{ shopInfo.minDeliveryAmount }}</text>
            <text class="delivery-desc">满减优惠多多</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 公告横幅 -->
    <view class="notice-banner" v-if="shopInfo.description || shopInfo.notice">
      <text class="notice-icon">📢</text>
      <view class="notice-text-container">
        <text class="notice-text">{{ shopInfo.description || shopInfo.notice }}</text>
      </view>
    </view>
    
    <!-- 店铺轮播图 -->
    <!-- <view class="shop-banners" v-if="shopInfo.banners && shopInfo.banners.length > 0">
      <swiper class="banners-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500">
        <swiper-item v-for="(banner, index) in shopInfo.banners" :key="index">
          <image :src="banner" mode="aspectFill" class="banner-image"></image>
        </swiper-item>
      </swiper>
    </view> -->

    <!-- 分类标签 -->
    <view class="category-tabs" v-if="categories.length > 0">
      <view class="tabs-scroll">
        <view class="tabs-container">
          <view 
            v-for="category in categories" 
            :key="category.id" 
            class="tab-item"
            :class="{ active: currentCategory === category.id }"
            @click="switchCategory(category.id)"
          >
            <text class="tab-text">{{ category.name }}</text>
            <view v-if="currentCategory === category.id" class="tab-indicator"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 商品网格 -->
    <view class="goods-container">
      <!-- 没有分类和商品的空状态 -->
      <view v-if="!isLoading && categories.length === 0" class="empty-state">
        <view class="empty-icon">📦</view>
        <text class="empty-title">暂无商品</text>
        <text class="empty-desc">店铺还没有上架任何商品</text>
      </view>
      
      <!-- 有分类但没有商品的情况 -->
      <view v-else-if="!isLoading && filteredCategories.length === 0" class="empty-state">
        <view class="empty-icon">🔍</view>
        <text class="empty-title">没有找到商品</text>
        <text class="empty-desc">当前分类下暂无商品</text>
      </view>
      
      <!-- 正常显示商品 -->
      <view v-else>
        <view v-for="category in filteredCategories" :key="category.id" class="category-section">
          <view class="section-header">
            <text class="section-title">{{ category.name }}</text>
            <text class="section-count">{{ category.goods.length }}款商品</text>
          </view>
          
          <!-- 分类有商品的情况 -->
          <view v-if="category.goods.length > 0" class="goods-grid">
            <view v-for="goods in category.goods" :key="goods.id" class="goods-card" @click="showGoodsDetail(goods)">
              <view class="goods-image">
                <image :src="goods.image" mode="aspectFill"></image>
                <view class="goods-badge" v-if="goods.sales > 200">热销</view>
                <view class="no-single-delivery-badge" v-if="goods.noSingleDelivery">单点不送</view>
              </view>
              <view class="goods-content">
                <view class="goods-title">{{ goods.name }}</view>
                <view class="goods-subtitle">{{ goods.description }}</view>
                <view class="goods-footer">
                  <view class="price-section">
                    <text class="price-current">¥{{ goods.price }}</text>
                    <text v-if="goods.originalPrice" class="price-original">¥{{ goods.originalPrice }}</text>
                  </view>
                  <view class="sales-info">
                    <text class="sales-text">售{{ goods.sales }}</text>
                  </view>
                </view>
                <view class="goods-actions">
                  <view class="quantity-control" v-if="getGoodsQuantity(goods.id) > 0">
                    <view class="quantity-btn minus" @click.stop="removeFromCart(goods)">
                      <text class="btn-text">-</text>
                    </view>
                    <view class="quantity-display">
                      <text class="quantity-text">{{ getGoodsQuantity(goods.id) }}</text>
                    </view>
                    <view class="quantity-btn plus" @click.stop="addToCart(goods)">
                      <text class="btn-text">+</text>
                    </view>
                  </view>
                  <view class="add-button" v-else-if="!goods.specs || goods.specs.length === 0" @click.stop="addToCart(goods)" style="position: relative;">
                    <text class="add-text" >+</text>
                  </view>
                  <view class="spec-button"  v-if="goods.specs" @click.stop="addToCart(goods)" style="position: relative;">
                    <text class="spec-text" >选规格</text>
                    <!-- 商品数量角标 -->
                    <view v-if="getGoodsQuantityTotal(goods.id) > 0" class="goods-badge-corner">
                      <text class="badge-text">{{ getGoodsQuantityTotal(goods.id) }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 分类没有商品的空状态 -->
          <view v-else-if="!isLoading" class="category-empty-state">
            <view class="category-empty-icon">🍽️</view>
            <text class="category-empty-text">该分类暂无商品</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部购物车 -->
    <view class="cart-bar">
      <view class="cart-left" @click="showCartDetail">
        <view class="cart-icon-wrapper">
          <text class="cart-icon">🛒</text>
          <view v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</view>
        </view>
        <view class="cart-info">
          <text class="cart-total">¥{{ cartTotal }}</text>
        </view>
      </view>
      <view class="cart-right">
        <view class="checkout-button" :class="{ active: cartTotal >= shopInfo.minDeliveryAmount && shopInfo.businessStatus !== '2' && !isOnlyNoSingleDeliveryItems(), closed: shopInfo.businessStatus === '2' || isOnlyNoSingleDeliveryItems() }" @click="checkout">
          <text class="checkout-text">{{ getCheckoutButtonText() }}</text>
        </view>
      </view>
    </view>

    <!-- 购物车详情弹窗 -->
    <view v-if="showCartModal" class="cart-modal" @click="hideCartDetail">
      <view class="cart-content" @click.stop>
        <view class="cart-header">
          <text class="cart-title">购物车</text>
          <view class="cart-header-right">
            <text class="cart-clear" @click="clearCart" v-if="Object.keys(cartItems).length > 0">清空</text>
            <text class="cart-close" @click="hideCartDetail">×</text>
          </view>
        </view>
        <view class="cart-items" v-if="Object.keys(cartItems).length > 0">
          <template v-for="(quantity, cartKey) in cartItems">
            <view v-if="getCartItemGoods(cartKey)" :key="cartKey" class="cart-item">
              <view class="item-info">
                <image :src="getCartItemGoods(cartKey).image" class="item-image"></image>
                <view class="item-details">
                  <text class="item-name">{{ getCartItemGoods(cartKey).name }}</text>
                  <text class="item-spec" v-if="getCartItemSpec(cartKey)">{{ getCartItemSpec(cartKey) }}</text>
                  <text class="item-price">¥{{ getCartItemPrice(cartKey) }}</text>
                </view>
              </view>
              <view class="item-controls">
                <view class="quantity-control">
                  <button class="quantity-btn minus" @click="removeFromCartItem(cartKey)">-</button>
                  <text class="quantity-text">{{ quantity }}</text>
                  <button class="quantity-btn plus" @click="addToCartItem(cartKey)">+</button>
                </view>
              </view>
            </view>
          </template>
        </view>
        <view v-else class="empty-cart">
          <text class="empty-text">购物车是空的</text>
        </view>
        <view class="cart-summary" v-if="Object.keys(cartItems).length > 0">
          <text class="summary-text">总计: ¥{{ cartTotal }}</text>
        </view>
      </view>
    </view>
    
    <!-- 规格选择弹窗 -->
    <view v-if="showSpecModal" class="spec-modal-overlay" @click="hideSpecSelection">
      <view class="spec-modal" @click.stop>
        <view class="spec-header">
          <image :src="selectedGoods.image" class="spec-image"></image>
          <view class="spec-info">
            <text class="spec-name">{{ selectedGoods.name }}</text>
            <text class="spec-price">¥{{ specPrice.toFixed(2) }}</text>
          </view>
          <text class="spec-close" @click="hideSpecSelection">×</text>
        </view>
        
        <view class="spec-content">
          <view v-for="spec in selectedGoods.specs" :key="spec.name" class="spec-group">
            <text class="spec-title">{{ spec.name }}</text>
            <view class="spec-options">
              <view 
                v-for="(option, index) in spec.options" 
                :key="index"
                class="spec-option"
                :class="{ active: selectedSpecs[spec.name] === index }"
                @click="selectSpec(spec.name, index)"
              >
                <text class="option-name">{{ option.name }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="spec-footer">
          <button class="add-cart-btn" @click="addToCartWithSpec">
            加入购物车 ¥{{ specPrice.toFixed(2) }}
          </button>
        </view>
      </view>
    </view>

    <!-- 商品详情弹窗 -->
    <view v-if="showGoodsDetailModal" class="goods-detail-modal" @click="hideGoodsDetail">
      <view class="goods-detail-content" @click.stop>
        <view class="goods-detail-header">
          <text class="goods-detail-close" @click="hideGoodsDetail">×</text>
        </view>
        <view class="goods-detail-body" v-if="selectedGoodsDetail">
          <view class="goods-detail-image">
            <image :src="selectedGoodsDetail.image" mode="aspectFill"></image>
          </view>
          <view class="goods-detail-info">
            <text class="goods-detail-title">{{ selectedGoodsDetail.name }}</text>
            <text class="goods-detail-desc">{{ selectedGoodsDetail.description }}</text>
            <view class="goods-detail-price">
              <text class="price-current">¥{{ selectedGoodsDetail.price }}</text>
              <text v-if="selectedGoodsDetail.originalPrice" class="price-original">¥{{ selectedGoodsDetail.originalPrice }}</text>
            </view>
            <view class="goods-detail-sales">
              <text class="sales-text">月售{{ selectedGoodsDetail.sales }}份</text>
            </view>
            <view class="goods-detail-tags" v-if="selectedGoodsDetail.tags && selectedGoodsDetail.tags.length > 0">
              <text v-for="tag in selectedGoodsDetail.tags" :key="tag" class="goods-detail-tag">{{ tag }}</text>
            </view>
          </view>
          <view class="goods-detail-actions">
            <view class="goods-detail-quantity" v-if="getGoodsQuantityTotal(selectedGoodsDetail.id) > 0 && (!selectedGoodsDetail.specs || selectedGoodsDetail.specs.length === 0)">
              <view class="quantity-btn minus" @click="removeFromCart(selectedGoodsDetail)">
                <text class="btn-text">-</text>
              </view>
              <view class="quantity-display">
                <text class="quantity-text">{{ getGoodsQuantityTotal(selectedGoodsDetail.id) }}</text>
              </view>
              <view class="quantity-btn plus" @click="addToCartFromDetail(selectedGoodsDetail)">
                <text class="btn-text">+</text>
              </view>
            </view>
            <view class="goods-detail-add-btn" v-else @click="addToCartFromDetail(selectedGoodsDetail)" style="position: relative;">
              <text class="add-to-cart-text">{{ selectedGoodsDetail.specs && selectedGoodsDetail.specs.length > 0 ? '选规格' : '加入购物车' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import $http from '@/config/requestConfig';
  
  export default {
    data() {
      return {
        shopId: '', // 店铺ID
        currentCategory: 1,
        cartCount: 0,
        cartTotal: 0,
        cartItems: {}, // 购物车商品数量 {商品id: 数量}
        showCartModal: false,
        // 规格选择弹窗相关
        showSpecModal: false,
        selectedGoods: null,
        selectedSpecs: {}, // 选中的规格 {规格名: 选项索引}
        specPrice: 0, // 当前规格组合的价格
        // 商品详情弹窗相关
        showGoodsDetailModal: false,
        selectedGoodsDetail: null,
        shopInfo: {
          name: '加载中...',
          rating: 0,
          monthlySales: 0,
          tags: [],
          notice: '',
          minDeliveryAmount: 0,
          deliveryFee: 0,
          deliveryTime: '30分钟',
          coverImage: '',
          avatar: '',
          // API返回的新字段
          shopName: '',
          address: '',
          contactPhone: '',
          description: '',
          logo: '',
          banners: [],
          businessHours: {
            open: '',
            close: ''
          },
          location: {
            longitude: 0,
            latitude: 0
          },
          businessStatus: '1',
          isRecommended: false,
          owner: {},
          campus: {}
        },
        categories: [], // 商品分类数据，将通过API获取
        isLoading: true // 数据加载状态
      }
    },
    onLoad(options) {
      // 获取传入的店铺ID
      if (options.shopId) {
        this.shopId = options.shopId;
      } else {
        // 如果没有传入shopId，使用默认的店铺ID进行测试
        this.shopId = '689f09afb4271c04d1c202d3';
      }
      // 先调用店铺状态接口，再获取店铺详情
      this.checkShopStatus();
    },
    computed: {
      filteredCategories() {
        return this.categories.filter(category => category.id === this.currentCategory);
      }
    },
    methods: {
      // 检查店铺状态
      async checkShopStatus() {
        try {
          const response = await $http.get(`api/shop/update-status/${this.shopId}`);
          console.log('店铺状态检查结果:', response);
          // 获取店铺详情
          this.getShopDetail();
        } catch (error) {
          console.error('检查店铺状态失败:', error);
          // 即使状态检查失败，也继续获取店铺详情
          this.getShopDetail();
        }
      },
      
      // 获取店铺详情
      async getShopDetail() {
        try {
          uni.showLoading({
            title: '加载中...'
          });
          
          const response = await $http.get(`api/shop/${this.shopId}`);
            const shopData = response;
            
            // 更新店铺信息
            this.shopInfo = {
              ...this.shopInfo,
              name: shopData.shopName || shopData.name,
              shopName: shopData.shopName,
              address: shopData.address,
              contactPhone: shopData.contactPhone,
              description: shopData.description,
              logo: shopData.logo,
              avatar: shopData.logo, // 使用logo作为头像
              banners: shopData.banners || [],
              businessHours: shopData.businessHours || { open: '', close: '' },
              location: shopData.location || { longitude: 0, latitude: 0 },
              businessStatus: shopData.businessStatus,
              isRecommended: shopData.isRecommended,
              tags: shopData.tags || [],
              owner: shopData.owner || {},
              campus: shopData.campus || {},
              // 设置一些默认值，这些可能需要从其他接口获取或设置默认值
              rating: 4.8, // 默认评分
              monthlySales: 1234, // 默认月销量
              minDeliveryAmount: 1, // 默认起送金额
              deliveryFee: 3, // 默认配送费
              deliveryTime: '30分钟', // 默认配送时间
              notice: shopData.description || '欢迎光临本店！'
            };
            
            console.log('店铺详情获取成功:', this.shopInfo);
            
            // 获取店铺商品分类和商品数据
            await this.getShopGoods();
        } catch (error) {
          console.error('获取店铺详情失败:', error);
          uni.showToast({
            title: '网络错误，请重试',
            icon: 'none'
          });
        } finally {
          uni.hideLoading();
        }
      },
      
      // 获取店铺商品分类和商品数据
      async getShopGoods() {
        try {
          const response = await $http.get(`api/goods/by-shop-id/${this.shopId}`);
          console.log(response);
          
            // 转换API数据格式为页面所需格式
            this.categories = response.map((category, index) => {
              return {
                id: category.categoryId, // 使用API返回的categoryId
                name: category.categoryName,
                goods: category.goods.map(goods => {
                  return {
                    id: goods._id, // API返回的是_id字段
                    name: goods.name,
                    description: goods.description,
                    price: goods.price,
                    originalPrice: goods.originalPrice,
                    sales: goods.sales,
                    image: goods.thumbnail || (goods.images && goods.images[0]) || '', // 使用thumbnail字段
                    stock: goods.stock,
                    status: goods.status,
                    noSingleDelivery: goods.noSingleDelivery || false, // 单点不送标记
                    // 转换规格数据
                    specs: goods.specifications && goods.specifications.length > 0 ? 
                      goods.specifications.map(spec => {
                        return {
                          name: spec.name,
                          options: spec.values.map(value => ({ name: value }))
                        };
                      }) : null
                  };
                })
              };
            });
            
            // 设置默认选中第一个分类
            if (this.categories.length > 0) {
              this.currentCategory = this.categories[0].id;
            }
            
            console.log('商品分类和商品数据获取成功:', this.categories);
        } catch (error) {
          console.error('获取商品数据失败:', error);
          // 如果API调用失败，保持使用静态数据
          console.log('使用静态数据作为备选');
        } finally {
          // 数据加载完成，设置loading状态为false
          this.isLoading = false;
          uni.hideLoading();
        }
      },
      goBack() {
        uni.navigateBack({
          delta: 1
        });
      },
      
      switchCategory(categoryId) {
        this.currentCategory = categoryId;
      },
      
      getGoodsQuantity(goodsId) {
        return this.cartItems[goodsId] || 0;
      },
      
      addToCart(goodsOrId) {
        const goods = typeof goodsOrId === 'object' ? goodsOrId : this.getGoodsById(goodsOrId);
        if (!goods) return;
        
        // 如果商品有规格，显示规格选择弹窗
        if (goods.specs && goods.specs.length > 0) {
          this.showSpecSelection(goods);
        } else {
          // 没有规格，直接加入购物车
          this.addToCartDirect(goods.id);
        }
      },
      
      addToCartDirect(goodsId, specKey = '') {
        const cartKey = specKey ? `${goodsId}_${specKey}` : goodsId;
        const currentQuantity = this.getGoodsQuantity(cartKey);
        this.$set(this.cartItems, cartKey, currentQuantity + 1);
        this.updateCartInfo();
        const goods = this.getGoodsById(goodsId);
        console.log('添加商品到购物车:', goods ? goods.name : goodsId, specKey ? `规格: ${specKey}` : '');
      },
      
      removeFromCart(goodsOrId) {
        const goodsId = typeof goodsOrId === 'object' ? goodsOrId.id : goodsOrId;
        const currentQuantity = this.getGoodsQuantity(goodsId);
        if (currentQuantity > 1) {
          this.$set(this.cartItems, goodsId, currentQuantity - 1);
        } else {
          this.$delete(this.cartItems, goodsId);
        }
        this.updateCartInfo();
       },
       
       updateCartInfo() {
        let totalCount = 0;
        let totalPrice = 0;
        
        // 遍历购物车中的所有商品项来计算总数和总价
        for (let cartKey in this.cartItems) {
          const quantity = this.cartItems[cartKey];
          totalCount += quantity;
          const price = this.getCartItemPrice(cartKey);
          totalPrice += price * quantity;
        }
        
        this.cartCount = totalCount;
        this.cartTotal = parseFloat(totalPrice.toFixed(2));
      },
      
      // 检查购物车中是否只有单点不送的商品
      isOnlyNoSingleDeliveryItems() {
        if (Object.keys(this.cartItems).length === 0) {
          return false;
        }
        
        for (let cartKey in this.cartItems) {
          const goods = this.getCartItemGoods(cartKey);
          if (goods && !goods.noSingleDelivery) {
            return false; // 如果有任何一个商品不是单点不送，返回false
          }
        }
        return true; // 所有商品都是单点不送
      },
      
      getCheckoutButtonText() {
        if (this.shopInfo.businessStatus === '2') {
          return '已打烊';
        }
        
        // 检查是否只有单点不送的商品
        if (this.isOnlyNoSingleDeliveryItems()) {
          return '单点不送';
        }
        
        return this.cartTotal >= this.shopInfo.minDeliveryAmount ? '去结算' : '未达起送';
      },
      
      checkout() {
        // 如果店铺已打烊，不允许结算
        if (this.shopInfo.businessStatus === '2') {
          uni.showToast({
            title: '店铺已打烊，暂不接单',
            icon: 'none'
          });
          return;
        }
        
        // 检查是否只有单点不送的商品
        if (this.isOnlyNoSingleDeliveryItems()) {
          uni.showToast({
            title: '所选商品均为单点不送，请添加其他商品',
            icon: 'none'
          });
          return;
        }
        
        if (this.cartTotal >= this.shopInfo.minDeliveryAmount) {
          // 构建完整的商品信息
          const goodsData = {};
          for (let cartKey in this.cartItems) {
            const goods = this.getCartItemGoods(cartKey);
            if (goods) {
              goodsData[cartKey] = {
                id: goods.id,
                name: goods.name,
                price: goods.price,
                image: goods.image,
                description: goods.description,
                specs: this.getCartItemSpecs(cartKey)
              };
            }
          }
          
          // 跳转到结算页面，传递购物车数据和商品详情
          uni.navigateTo({
            url: '/pages/checkout/checkout?cartData=' + encodeURIComponent(JSON.stringify({
              cartItems: this.cartItems,
              cartTotal: this.cartTotal,
              goodsData: goodsData,
              shopInfo: {
                id: this.shopId,
                name: this.shopInfo.name || this.shopInfo.shopName,
                deliveryFee: this.shopInfo.deliveryFee,
                minDeliveryAmount: this.shopInfo.minDeliveryAmount,
                businessHours: this.shopInfo.businessHours
              }
            }))
          });
        } else {
          uni.showToast({
            title: `还差¥${this.shopInfo.minDeliveryAmount - this.cartTotal}起送`,
            icon: 'none'
          });
        }
      },
      
      showCartDetail() {
        this.showCartModal = true;
      },
      
      hideCartDetail() {
        this.showCartModal = false;
      },
      
      clearCart() {
        uni.showModal({
          title: '确认清空',
          content: '确定要清空购物车吗？',
          success: (res) => {
            if (res.confirm) {
              this.cartItems = {};
              this.updateCartInfo();
              this.hideCartDetail(); // 关闭弹窗并恢复滚动
              uni.showToast({
                title: '购物车已清空',
                icon: 'success'
              });
            }
          }
        });
      },
      
      // 规格选择相关方法
      showSpecSelection(goods) {
        this.selectedGoods = goods;
        this.selectedSpecs = {};
        // 默认选择每个规格的第一个选项
        if (goods.specs) {
          goods.specs.forEach(spec => {
            this.$set(this.selectedSpecs, spec.name, 0);
          });
        }
        this.calculateSpecPrice();
        this.showSpecModal = true;
      },
      
      hideSpecSelection() {
        this.showSpecModal = false;
        this.selectedGoods = null;
        this.selectedSpecs = {};
        this.specPrice = 0;
      },
      
      // 商品详情弹窗相关方法
      showGoodsDetail(goods) {
        this.selectedGoodsDetail = goods;
        this.showGoodsDetailModal = true;
      },
      
      hideGoodsDetail() {
        this.showGoodsDetailModal = false;
        this.selectedGoodsDetail = null;
      },
      
      // 从商品详情弹窗加入购物车
      addToCartFromDetail(goods) {
        if (!goods) return;
        
        // 如果商品有规格，先隐藏详情弹窗，然后显示规格选择弹窗
        if (goods.specs && goods.specs.length > 0) {
          this.hideGoodsDetail();
          this.showSpecSelection(goods);
        } else {
          // 没有规格，直接加入购物车
          this.addToCartDirect(goods.id);
          uni.showToast({
            title: '已加入购物车',
            icon: 'success'
          });
        }
      },
      
      selectSpec(specName, optionIndex) {
        this.$set(this.selectedSpecs, specName, optionIndex);
        this.calculateSpecPrice();
      },
      
      calculateSpecPrice() {
        if (!this.selectedGoods) {
          this.specPrice = 0;
          return;
        }
        
        // 始终使用商品基础价格，不受规格选择影响
        this.specPrice = this.selectedGoods.price;
      },
      
      addToCartWithSpec() {
        if (!this.selectedGoods) return;
        
        // 生成规格键
        const specKey = this.selectedGoods.specs.map(spec => {
          const selectedIndex = this.selectedSpecs[spec.name] || 0;
          return spec.options[selectedIndex].name;
        }).join('-');
        
        this.addToCartDirect(this.selectedGoods.id, specKey);
        this.hideSpecSelection();
        
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
      },
      
      getGoodsById(goodsId) {
        for (let category of this.categories) {
          for (let goods of category.goods) {
            if (goods.id == goodsId) {
              return goods;
            }
          }
        }
        console.warn('商品未找到:', goodsId);
        return null;
      },
      
      // 购物车相关辅助方法
      getCartItemGoods(cartKey) {
        const goodsId = cartKey.toString().split('_')[0];
        return this.getGoodsById(goodsId);
      },
      
      getCartItemName(cartKey) {
        const goods = this.getCartItemGoods(cartKey);
        return goods ? goods.name : '';
      },
      
      getCartItemSpec(cartKey) {
        const parts = cartKey.toString().split('_');
        return parts.length > 1 ? parts[1] : '';
      },
      
      getCartItemSpecs(cartKey) {
        const parts = cartKey.toString().split('_');
        if (parts.length > 1) {
          return parts.slice(1).join(', ');
        }
        return '';
      },
      
      getCartItemPrice(cartKey) {
        const goods = this.getCartItemGoods(cartKey);
        if (!goods) return 0;
        
        // 始终返回商品基础价格，不受规格选择影响
        return goods.price;
      },
      
      addToCartItem(cartKey) {
        const currentQuantity = this.getGoodsQuantity(cartKey);
        this.$set(this.cartItems, cartKey, currentQuantity + 1);
        this.updateCartInfo();
      },
      
      removeFromCartItem(cartKey) {
         const currentQuantity = this.getGoodsQuantity(cartKey);
         if (currentQuantity > 1) {
           this.$set(this.cartItems, cartKey, currentQuantity - 1);
         } else {
           this.$delete(this.cartItems, cartKey);
         }
         this.updateCartInfo();
       },
       
       // 获取商品的总数量（包含所有规格）
       getGoodsQuantityTotal(goodsId) {
         let total = 0;
         for (let cartKey in this.cartItems) {
           const keyGoodsId = cartKey.toString().split('_')[0];
           if (keyGoodsId == goodsId) {
             total += this.cartItems[cartKey];
           }
         }
         return total;
       }
    }
  }
</script>

<style lang="scss" scoped>
.shop-detail {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-top: 100px;
  
  // 顶部导航栏
   .nav-bar {
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     z-index: 1000;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 44px 20px 16px;
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     backdrop-filter: blur(10px);
    
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
    .nav-right{
      background: transparent;
    }
    
    .back-btn, .share-btn {
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
  
  // 店铺卡片
  .shop-card {
    margin:  16px 16px;
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    .shop-main {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      
      .shop-avatar {
        width: 70px;
        height: 70px;
        border-radius: 16px;
        overflow: hidden;
        margin-right: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        flex-shrink: 0; /* 防止logo被挤压 */
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .shop-info {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        
        .shop-name {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          // 隐藏横向滚动条
          &::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .shop-address {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          width: 100%; /* 确保父容器有宽度 */
          
          .address-icon {
            font-size: 12px;
            margin-right: 4px;
            flex-shrink: 0; /* 防止图标被压缩 */
          }
          
          .address-text {
            font-size: 14px;
            color: #666;
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            // 隐藏横向滚动条
            &::-webkit-scrollbar {
              display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
        
        
        .shop-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 20upx;
          
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
      }
    }
    
    .shop-meta {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 4px;
      padding: 8px 0;
      border-top: 1px solid #f0f0f0;
      
      .rating-box {
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #ffd700, #ffb347);
        padding: 2px 6px;
        border-radius: 12px;
        margin-right: 16px;
        
        .star {
          font-size: 12px;
          margin-right: 4px;
        }
        
        .rating {
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
      }
      
      .sales {
        color: #666;
        font-size: 12px;
        margin-right: 16px;
        white-space: nowrap;
      }
      
      .business-hours {
        .hours-text {
          font-size: 12px;
          color: #999;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 8px;
          border-radius: 8px;
          white-space: nowrap;
        }
      }
    }
    
    .delivery-card {
      display: flex;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 16px;
      padding: 16px;
      
      .delivery-item {
        flex: 1;
        display: flex;
        align-items: center;
        
        &:first-child {
          margin-right: 16px;
        }
        
        .delivery-icon {
          font-size: 20px;
          margin-right: 12px;
        }
        
        .delivery-info {
          display: flex;
          flex-direction: column;
          .delivery-title {
            color: white;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 2px;
          }
          
          .delivery-desc {
            color: rgba(255, 255, 255, 0.8);
            font-size: 11px;
            white-space: nowrap;
          }
        }
      }
    }
  }
  
  // 公告横幅
  .notice-banner {
    margin: 0 16px 16px;
    background: linear-gradient(135deg, #ffeaa7, #fab1a0);
    border-radius: 16px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    overflow: hidden;
    
    .notice-icon {
      font-size: 16px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    
    .notice-text-container {
      flex: 1;
      overflow: hidden;
      position: relative;
      height: 20px;
      display: flex;
      align-items: center;
    }
    
    .notice-text {
      color: #454545;
      font-size: 13px;
      line-height: 1.4;
      white-space: nowrap;
      animation: scroll-horizontal 8s linear infinite;
      transform: translateX(100%);
    }
    
    @keyframes scroll-horizontal {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  }
  
  // 店铺轮播图
  .shop-banners {
    margin: 0 16px 16px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    .banners-swiper {
      height: 200px;
      
      .banner-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  
  // 分类标签
  .category-tabs {
    position: sticky;
    top: 100px;
    z-index: 100;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-bottom: 16px;
    padding: 8px 0;
    
    .tabs-scroll {
      overflow-x: auto;
      overflow-y: hidden;
      // 隐藏横向滚动条
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
      
      .tabs-container {
        display: flex;
        padding: 0 16px;
        
        .tab-item {
          position: relative;
          padding: 12px 20px;
          margin-right: 8px;
          white-space: nowrap;
          
          .tab-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          &.active {
            .tab-text {
              color: white;
              font-weight: 600;
            }
          }
          
          .tab-indicator {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 3px;
            background: white;
            border-radius: 2px;
          }
        }
      }
    }
  }
  
  // 商品容器
  .goods-container {
    margin: 0 16px;
    padding-bottom: 120px;
    
    .category-section {
      margin-bottom: 24px;
      
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        
        .section-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
        }
        
        .section-count {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }
      }
      
      .goods-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        
        .goods-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          position: relative;
          
          &:active {
            transform: scale(0.98);
          }
          
          .goods-image {
            position: relative;
            width: 100%;
            height: 120px;
            
            image {
              width: 100%;
              height: 100%;
            }
            
            .goods-badge {
              position: absolute;
              top: 8px;
              left: 8px;
              background: linear-gradient(135deg, #ff6b6b, #ee5a24);
              color: white;
              padding: 2px 8px;
              border-radius: 8px;
              font-size: 10px;
              font-weight: 600;
            }
            
            .no-single-delivery-badge {
              position: absolute;
              top: 8px;
              right: 8px;
              background: linear-gradient(135deg, #ffa726, #ff9800);
              color: white;
              padding: 2px 8px;
              border-radius: 8px;
              font-size: 10px;
              font-weight: 600;
            }
          }
          
          .goods-content {
            position: relative;
            padding: 12px;
            
            .goods-title {
              font-size: 14px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 4px;
              line-height: 1.3;
              // 不换行 展示省略号
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .goods-subtitle {
              font-size: 11px;
              color: #999;
              margin-bottom: 8px;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              min-height: 30px;
            }
            
            .goods-footer {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              margin-bottom: 8px;
              
              .price-section {
                .price-current {
                  color: #ff6b6b;
                  font-size: 16px;
                  font-weight: 700;
                }
                
                .price-original {
                  color: #999;
                  font-size: 11px;
                  text-decoration: line-through;
                  margin-left: 4px;
                }
              }
              
              .sales-info {
                .sales-text {
                  color: #999;
                  font-size: 10px;
                }
              }
            }
            
            .goods-actions {
              display: flex;
              justify-content: flex-end;
              margin-top: 8px;
            }
            
            .quantity-control {
               display: flex;
               align-items: center;
               background: white;
               border-radius: 16px;
               box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              .quantity-btn {
                width: 24px;
                height: 24px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                
                .btn-text {
                  color: white;
                  font-size: 14px;
                  font-weight: 600;
                }
                
                &.minus {
                  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                }
                
                &.plus {
                  background: linear-gradient(135deg, #667eea, #764ba2);
                }
              }
              
              .quantity-display {
                min-width: 20px;
                padding: 0 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                
                .quantity-text {
                  color: #1a1a1a;
                  font-size: 12px;
                  font-weight: 600;
                }
              }
            }
            
            .add-button {
               width: 28px;
               height: 28px;
               background: linear-gradient(135deg, #667eea, #764ba2);
               border-radius: 14px;
               display: flex;
               align-items: center;
               justify-content: center;
               box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
              
              .add-text {
                color: white;
                font-size: 16px;
                font-weight: 600;
              }
              
              .spec-text {
                color: white;
                font-size: 10px;
                font-weight: 600;
                white-space: nowrap;
              }
            }
            .spec-button{
               height: 28px;
               background: linear-gradient(135deg, #667eea, #764ba2);
               border-radius: 14px;
               display: flex;
               align-items: center;
               justify-content: center;
               box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
              
              .spec-text {
                color: white;
                font-size: 10px;
                font-weight: 600;
                white-space: nowrap;
                padding: 2px 10px;
              }
            }
            
            .goods-badge-corner {
              position: absolute;
              top: -5px;
              right: -5px;
              background-color: #ff4444;
              border-radius: 10px;
              min-width: 18px;
              height: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              
              .badge-text {
                color: white;
                font-size: 10px;
                font-weight: 600;
                line-height: 1;
              }
            }
          }
        }
      }
    }
  }
  
  // 底部购物车
  .cart-bar {
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
    
    .cart-left {
      flex: 1;
      display: flex;
      align-items: center;
      
      .cart-icon-wrapper {
        position: relative;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        
        .cart-icon {
          color: white;
          font-size: 20px;
        }
        
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff6b6b;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: 600;
          min-width: 18px;
          text-align: center;
        }
      }
      
      .cart-info {
        .cart-total {
          color: #1a1a1a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        
        .cart-desc {
          color: #999;
          font-size: 11px;
        }
      }
    }
    
    .cart-right {
      .checkout-button {
        background: #ddd;
        color: #999;
        padding: 12px 24px;
        border-radius: 25px;
        transition: all 0.3s ease;
        
        &.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }
        
        &.closed {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
          opacity: 0.8;
        }
        
        .checkout-text {
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
  }
  }
  
  /* 购物车弹窗样式 */
  .cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: flex-end;
  }
  
  .cart-content {
    width: 100%;
    max-height: 60vh;
    background: white;
    border-radius: 16px 16px 0 0;
    padding: 20px;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .cart-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .cart-header-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .cart-clear {
    font-size: 14px;
    color: #ff6b6b;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .cart-clear:hover {
    background-color: #fff5f5;
  }
  
  .cart-close {
    font-size: 24px;
    color: #999;
    cursor: pointer;
  }
  
  .cart-items {
    max-height: 300px;
    overflow-y: auto;
    /* 隐藏滚动条但保留滚动功能 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
  }
  
  .item-info {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .item-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 12px;
  }
  
  .item-details {
    flex: 1;
   
  }
  
  .item-name {
    font-size: 14px;
    color: #1a1a1a;
    margin-bottom: 4px;
    display: block;
  }
  
  .item-spec {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
    margin-right: 6px;
  }
  
  .item-price {
    font-size: 14px;
    color: #ff6b6b;
    font-weight: 600;
  }
  
  .item-controls .quantity-control {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 20px;
    padding: 4px;
  }
  
  .item-controls .quantity-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: white;
    color: #667eea;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .item-controls .quantity-text {
    margin: 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    min-width: 20px;
    text-align: center;
  }
  
  .empty-cart {
    text-align: center;
    padding: 40px 20px;
  }
  
  .empty-text {
    color: #999;
    font-size: 14px;
  }
  
  .cart-summary {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
  }
  
  .summary-text {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  /* 规格选择弹窗样式 */
  .spec-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
  }
  
  .spec-modal {
    width: 100%;
    background-color: white;
    border-radius: 20px 20px 0 0;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .spec-header {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
  }
  
  .spec-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin-right: 15px;
  }
  
  .spec-info {
    flex: 1;
  }
  
  .spec-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 8px;
  }
  
  .spec-price {
    font-size: 20px;
    color: #ff6b35;
    font-weight: bold;
  }
  
  .spec-close {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 30px;
    color: #999;
    cursor: pointer;
  }
  
  .spec-content {
    padding: 20px;
  }
  
  .spec-group {
    margin-bottom: 25px;
  }
  
  .spec-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 12px;
  }
  
  .spec-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .spec-option {
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    background-color: #f9f9f9;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .spec-option.active {
    border-color: #ff6b35;
    background-color: #fff5f2;
    color: #ff6b35;
  }
  
  .option-name {
    font-size: 12px;
  }
  
  .option-price {
    font-size: 12px;
    color: #ff6b35;
  }
  
  .spec-footer {
    padding: 20px;
    border-top: 1px solid #f0f0f0;
  }
  
  .add-cart-btn {
    width: 100%;
    height: 50px;
    background-color: #ff6b35;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 商品详情弹窗样式 */
  .goods-detail-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .goods-detail-content {
    width: 90%;
    max-width: 400px;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
  }
  
  .goods-detail-header {
    position: relative;
    padding: 15px;
    text-align: right;
  }
  
  .goods-detail-close {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    line-height: 1;
  }
  
  .goods-detail-body {
    padding: 0 20px 20px 20px;
  }
  
  .goods-detail-image {
    width: 100%;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;
  }
  
  .goods-detail-image image {
    width: 100%;
    height: 100%;
  }
  
  .goods-detail-info {
    text-align: left;
  }
  
  .goods-detail-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    display: block;
  }
  
  .goods-detail-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    display: block;
    line-height: 1.4;
  }
  
  .goods-detail-price {
    margin-bottom: 10px;
  }
  
  .goods-detail-price .price-current {
    font-size: 20px;
    color: #ff6b35;
    font-weight: bold;
    margin-right: 8px;
  }
  
  .goods-detail-price .price-original {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }
  
  .goods-detail-sales {
    margin-bottom: 15px;
  }
  
  .goods-detail-sales .sales-text {
    font-size: 14px;
    color: #666;
  }
  
  .goods-detail-tags {
    margin-bottom: 20px;
  }
  
  .goods-detail-tag {
    display: inline-block;
    padding: 4px 8px;
    background-color: #f0f0f0;
    color: #666;
    font-size: 12px;
    border-radius: 4px;
    margin-right: 8px;
    margin-bottom: 5px;
  }
  
  .goods-detail-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
  }
  
  .goods-detail-quantity {
    display: flex;
    align-items: center;
  }
  
  .goods-detail-quantity .quantity-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .goods-detail-quantity .quantity-btn.minus {
    border-color: #ff6b35;
    color: #ff6b35;
  }
  
  .goods-detail-quantity .quantity-btn.plus {
    background-color: #ff6b35;
    border-color: #ff6b35;
    color: white;
  }
  
  .goods-detail-quantity .quantity-display {
    margin: 0 12px;
    min-width: 30px;
    text-align: center;
  }
  
  .goods-detail-quantity .quantity-text {
    font-size: 16px;
    font-weight: bold;
  }
  
  .goods-detail-quantity .btn-text {
    font-size: 16px;
    font-weight: bold;
  }
  
  .goods-detail-add-btn .add-to-cart-text {
    font-size: 16px;
    font-weight: bold;
  }
  
  .goods-detail-add-btn {
    flex: 1;
    margin-left: 15px;
    height: 40px;
    background-color: #ff6b35;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    .goods-badge-corner {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #ff4444;
      border-radius: 10px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      
      .badge-text {
        color: white;
        font-size: 10px;
        font-weight: 600;
        line-height: 1;
      }
    }
  }
  
  // 空状态样式
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding:20px 20px 50px 20px;
    color: #fff;
    font-size: 14px;
    .empty-icon {
      font-size: 50px;
      margin-bottom: 5px;
    }
    
    .empty-text {
      font-size: 16px;
      color: #999;
      text-align: center;
    }
  }
  
  .category-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #fff;
    font-size: 14px;
    .category-empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    
    .category-empty-text {
      font-size: 14px;
      color: #fff;
      text-align: center;
    }
  }
</style>