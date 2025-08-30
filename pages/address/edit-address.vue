<template>
  <view class="edit-address-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">{{ isEdit ? '编辑地址' : '添加地址' }}</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <!-- 表单内容 -->
    <view class="form-container">
      <!-- 联系人信息 -->
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">联系人信息</text>
        </view>
        
        <view class="form-item">
          <text class="label">姓名</text>
          <input 
            class="input" 
            v-model="formData.name" 
            placeholder="请输入收货人姓名"
            maxlength="20"
          />
        </view>
        
        <view class="form-item">
          <text class="label">手机号</text>
          <input 
            class="input" 
            v-model="formData.phone" 
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
          />
        </view>
      </view>

      <!-- 地址信息 -->
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">地址信息</text>
        </view>
        
        <view class="form-item">
          <text class="label">所在地区</text>
          <view class="region-picker" @click="showRegionPicker">
            <text class="region-text" :class="{ placeholder: !regionText }">{{ regionText || '请选择省市区' }}</text>
            <text class="arrow">></text>
          </view>
        </view>
        
        <view class="form-item full">
          <text class="label">详细地址</text>
          <textarea 
            class="textarea" 
            v-model="formData.address" 
            placeholder="请输入详细地址，如道路、门牌号、小区、楼栋号、单元室等"
            maxlength="100"
          ></textarea>
        </view>
      </view>

      <!-- 默认地址设置 -->
      <view class="form-section">
        <view class="form-item switch-item">
          <text class="label">设为默认地址</text>
          <switch 
            class="switch" 
            :checked="formData.isDefault" 
            @change="onDefaultChange"
            color="#667eea"
          />
        </view>
      </view>
    </view>

    <!-- 底部保存按钮 -->
    <view class="bottom-btn">
      <view class="save-btn" @click="saveAddress">
        <text class="save-text">保存地址</text>
      </view>
    </view>

    <!-- 地区选择器 -->
    <picker-view 
      v-if="showPicker" 
      class="region-picker-view"
      :value="pickerValue" 
      @change="onPickerChange"
    >
      <picker-view-column>
        <view v-for="(province, index) in provinces" :key="index" class="picker-item">
          <text>{{ province.name }}</text>
        </view>
      </picker-view-column>
      <picker-view-column>
        <view v-for="(city, index) in cities" :key="index" class="picker-item">
          <text>{{ city.name }}</text>
        </view>
      </picker-view-column>
      <picker-view-column>
        <view v-for="(area, index) in areas" :key="index" class="picker-item">
          <text>{{ area.name }}</text>
        </view>
      </picker-view-column>
    </picker-view>

    <!-- 遮罩层 -->
    <view v-if="showPicker" class="picker-mask" @click="hidePicker">
      <view class="picker-container" @click.stop>
        <view class="picker-header">
          <text class="picker-cancel" @click="hidePicker">取消</text>
          <text class="picker-title">选择地区</text>
          <text class="picker-confirm" @click="confirmRegion">确定</text>
        </view>
        <picker-view 
          class="picker-view"
          :value="pickerValue" 
          @change="onPickerChange"
        >
          <picker-view-column>
            <view v-for="(province, index) in provinces" :key="index" class="picker-item">
              <text>{{ province.name }}</text>
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(city, index) in cities" :key="index" class="picker-item">
              <text>{{ city.name }}</text>
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(area, index) in areas" :key="index" class="picker-item">
              <text>{{ area.name }}</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      formData: {
        id: null,
        name: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        isDefault: false
      },
      showPicker: false,
      pickerValue: [0, 0, 0],
      // 模拟地区数据
      provinces: [
        { name: '北京市', code: '110000' },
        { name: '上海市', code: '310000' },
        { name: '广东省', code: '440000' }
      ],
      cities: [
        { name: '北京市', code: '110100' }
      ],
      areas: [
        { name: '东城区', code: '110101' },
        { name: '西城区', code: '110102' },
        { name: '朝阳区', code: '110105' },
        { name: '海淀区', code: '110108' }
      ]
    }
  },
  
  computed: {
    regionText() {
      if (this.formData.province && this.formData.city && this.formData.area) {
        return `${this.formData.province} ${this.formData.city} ${this.formData.area}`;
      }
      return '';
    }
  },
  
  onLoad(options) {
    if (options.id) {
      this.isEdit = true;
      this.formData.id = parseInt(options.id);
      this.formData.name = decodeURIComponent(options.name || '');
      this.formData.phone = options.phone || '';
      this.formData.address = decodeURIComponent(options.address || '');
      this.formData.isDefault = options.isDefault === 'true';
      
      // 解析地址中的省市区信息（简化处理）
      const address = this.formData.address;
      if (address.includes('北京市')) {
        this.formData.province = '北京市';
        this.formData.city = '北京市';
        if (address.includes('朝阳区')) {
          this.formData.area = '朝阳区';
        } else if (address.includes('海淀区')) {
          this.formData.area = '海淀区';
        }
      }
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 显示地区选择器
    showRegionPicker() {
      this.showPicker = true;
    },
    
    // 隐藏地区选择器
    hidePicker() {
      this.showPicker = false;
    },
    
    // 地区选择器变化
    onPickerChange(e) {
      this.pickerValue = e.detail.value;
      
      // 更新城市和区域列表
      const provinceIndex = this.pickerValue[0];
      const cityIndex = this.pickerValue[1];
      
      // 这里应该根据选择的省份更新城市列表
      // 简化处理，使用固定数据
      if (provinceIndex === 0) { // 北京市
        this.cities = [{ name: '北京市', code: '110100' }];
        this.areas = [
          { name: '东城区', code: '110101' },
          { name: '西城区', code: '110102' },
          { name: '朝阳区', code: '110105' },
          { name: '海淀区', code: '110108' }
        ];
      }
    },
    
    // 确认地区选择
    confirmRegion() {
      const provinceIndex = this.pickerValue[0];
      const cityIndex = this.pickerValue[1];
      const areaIndex = this.pickerValue[2];
      
      this.formData.province = this.provinces[provinceIndex]?.name || '';
      this.formData.city = this.cities[cityIndex]?.name || '';
      this.formData.area = this.areas[areaIndex]?.name || '';
      
      this.hidePicker();
    },
    
    // 默认地址开关变化
    onDefaultChange(e) {
      this.formData.isDefault = e.detail.value;
    },
    
    // 保存地址
    saveAddress() {
      // 表单验证
      if (!this.formData.name.trim()) {
        uni.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.formData.phone.trim()) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      
      // 简单的手机号验证
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      if (!this.formData.province || !this.formData.city || !this.formData.area) {
        uni.showToast({
          title: '请选择所在地区',
          icon: 'none'
        });
        return;
      }
      
      if (!this.formData.address.trim()) {
        uni.showToast({
          title: '请输入详细地址',
          icon: 'none'
        });
        return;
      }
      
      // 构建完整地址
      const fullAddress = `${this.formData.province}${this.formData.city}${this.formData.area}${this.formData.address}`;
      
      const addressData = {
        id: this.formData.id || Date.now(),
        name: this.formData.name,
        phone: this.formData.phone,
        address: fullAddress,
        isDefault: this.formData.isDefault
      };
      
      uni.showLoading({
        title: '保存中...'
      });
      
      // 模拟保存过程
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        // 触发地址更新事件
        uni.$emit('addressUpdated', addressData);
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-address-page {
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

// 表单容器
.form-container {
  padding: 0 16px;
  margin-top: 20px;
  .form-section {
    background: white;
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    
    .section-title {
      margin-bottom: 20px;
      
      .title-text {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }
    
    .form-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.full {
        flex-direction: column;
        align-items: flex-start;
        
        .label {
          margin-bottom: 12px;
        }
      }
      
      &.switch-item {
        justify-content: space-between;
      }
      
      .label {
        font-size: 14px;
        color: #1a1a1a;
        font-weight: 500;
        width: 80px;
        flex-shrink: 0;
        white-space: nowrap;
      }
      
      .input {
        flex: 1;
        font-size: 14px;
        color: #1a1a1a;
        
        &::placeholder {
          color: #999;
        }
      }
      
      .textarea {
        width: 100%;
        height: 80px;
        font-size: 14px;
        color: #1a1a1a;
        resize: none;
        
        &::placeholder {
          color: #999;
        }
      }
      
      .region-picker {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .region-text {
          font-size: 14px;
          color: #1a1a1a;
          
          &.placeholder {
            color: #999;
          }
        }
        
        .arrow {
          font-size: 14px;
          color: #999;
        }
      }
      
      .switch {
        transform: scale(0.8);
      }
    }
  }
}

// 底部保存按钮
.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  
  .save-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 16px;
    border-radius: 25px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    
    .save-text {
      font-size: 16px;
      font-weight: 600;
      color: white;
    }
  }
}

// 地区选择器遮罩
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  
  .picker-container {
    width: 100%;
    background: white;
    border-radius: 16px 16px 0 0;
    
    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      
      .picker-cancel, .picker-confirm {
        font-size: 16px;
        color: #667eea;
        font-weight: 500;
      }
      
      .picker-title {
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }
    
    .picker-view {
      height: 200px;
      
      .picker-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        
        text {
          font-size: 14px;
          color: #1a1a1a;
        }
      }
    }
  }
}
</style>