<template>
  <view class="address-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">地址管理</text>
      </view>
      <view class="nav-right">
        <text class="add-btn" @click="addAddress">+</text>
      </view>
    </view>

    <!-- 地址列表 -->
    <view class="address-list">
      <view 
        v-for="(address, index) in addressList" 
        :key="address.id"
        class="address-item"
        @click="selectAddress(address)"
      >
        <view class="address-content">
          <view class="address-header">
            <view class="user-info">
              <text class="user-name">{{ address.name }}</text>
              <text class="user-phone">{{ address.phone }}</text>
            </view>
            <view class="default-tag" v-if="address.isDefault">
              <text class="default-text">默认</text>
            </view>
          </view>
          <text class="address-detail">{{ address.address }}</text>
          <view class="address-actions">
            <text class="action-btn" @click.stop="editAddress(address)">编辑</text>
            <text class="action-btn delete" @click.stop="deleteAddress(address.id, index)">删除</text>
            <text 
              class="action-btn default" 
              v-if="!address.isDefault"
              @click.stop="setDefault(address.id, index)"
            >
              设为默认
            </text>
          </view>
        </view>
        <view class="select-icon" v-if="isSelectMode">
          <text class="icon">{{ selectedAddressId === address.id ? '✓' : '' }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="addressList.length === 0">
      <text class="empty-icon">📍</text>
      <text class="empty-text">暂无收货地址</text>
      <view class="add-address-btn" @click="addAddress">
        <text class="add-text">添加地址</text>
      </view>
    </view>

    <!-- 添加地址按钮 -->
    <view class="bottom-btn" v-if="addressList.length > 0">
      <view class="add-address-btn" @click="addAddress">
        <text class="add-text">+ 添加新地址</text>
      </view>
    </view>
  </view>
</template>

<script>
import $http from '@/config/requestConfig';

export default {
  data() {
    return {
      addressList: [],
      isSelectMode: false, // 是否为选择模式
      selectedAddressId: null,
      loading: false
    }
  },
  
  onLoad(options) {
    // 检查是否为选择模式
    if (options.selectMode === 'true') {
      this.isSelectMode = true;
      this.selectedAddressId = options.selectedId || null;
    }
    // 获取地址列表
    this.getAddressList();
  },
  
  methods: {
    // 获取地址列表
    async getAddressList() {
      try {
        this.loading = true;
        const res = await $http.post('api/user/address/list');
        if (res.data && Array.isArray(res.data)) {
          this.addressList = res.data.map(item => ({
            id: item._id,
            name: item.receiverName,
            phone: item.receiverPhone,
            address: item.address + (item.detailAddress ? item.detailAddress : ''),
            isDefault: item.isDefault,
            originalData: item // 保存原始数据用于编辑
          }));
        }
      } catch (error) {
        console.error('获取地址列表失败:', error);
        uni.showToast({
          title: '获取地址列表失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 选择地址（选择模式下）
    selectAddress(address) {
      if (this.isSelectMode) {
        this.selectedAddressId = address.id;
        // 返回选中的地址数据
        uni.$emit('addressSelected', address.originalData || address);
        uni.navigateBack();
      }
    },
    
    // 添加地址
    addAddress() {
      uni.navigateTo({
        url: '/pages/address/edit-address'
      });
    },
    
    // 编辑地址
    editAddress(address) {
      const originalData = address.originalData;
      if (originalData) {
        const params = {
          id: originalData._id,
          receiverName: originalData.receiverName,
          receiverPhone: originalData.receiverPhone,
          address: originalData.address,
          detailAddress: originalData.detailAddress || '',
          province: originalData.province || '',
          city: originalData.city || '',
          district: originalData.district || '',

          isDefault: originalData.isDefault
        };
        
        const query = Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key] || '')}`)
          .join('&');
        
        uni.navigateTo({
          url: `/pages/address/edit-address?${query}`
        });
      }
    },
    
    // 删除地址
    async deleteAddress(addressId, index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个地址吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await $http.post('api/user/address/delete', {
                addressId: addressId
              });
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              
              // 重新获取地址列表
              this.getAddressList();
            } catch (error) {
              console.error('删除地址失败:', error);
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 设为默认地址
    async setDefault(addressId, index) {
      try {
        await $http.post('api/user/address/set-default', {
          addressId: addressId
        });
        
        uni.showToast({
          title: '设置成功',
          icon: 'success'
        });
        
        // 重新获取地址列表
        this.getAddressList();
      } catch (error) {
        console.error('设置默认地址失败:', error);
        uni.showToast({
          title: '设置失败',
          icon: 'none'
        });
      }
    }
  },
  
  // 监听页面显示，刷新地址列表
  onShow() {
    // 重新获取地址列表
    this.getAddressList();
  }
}
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 88px;
  padding-bottom: 100px;
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
  
  .back-btn, .add-btn {
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

// 地址列表
.address-list {
  padding: 0 16px;
  margin-top: 20px;
  .address-item {
    background: white;
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    
    .address-content {
      flex: 1;
      
      .address-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        
        .user-info {
          display: flex;
          align-items: center;
          
          .user-name {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            margin-right: 12px;
          }
          
          .user-phone {
            font-size: 14px;
            color: #666;
          }
        }
        
        .default-tag {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 4px 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          .default-text {
            color: white;
            font-size: 12px;
            font-weight: 500;
          }
        }
      }
      
      .address-detail {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        margin-bottom: 16px;
      }
      
      .address-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 12px;
        .action-btn {
          font-size: 14px;
          color: #667eea;
          font-weight: 500;
          
          &.delete {
            color: #ff6b6b;
          }
          
          &.default {
            color: #4ecdc4;
          }
        }
      }
    }
    
    .select-icon {
      width: 24px;
      height: 24px;
      border: 2px solid #667eea;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 16px;
      
      .icon {
        color: #667eea;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .empty-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 32px;
  }
}

// 底部按钮
.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.add-address-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 16px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  
  .add-text {
    font-size: 16px;
    font-weight: 600;
    color: white;
  }
}
</style>