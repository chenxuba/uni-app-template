/**
 * 微信小程序登录相关工具函数
 * 优化说明：
 * 1. 添加防重复操作机制，避免用户快速点击导致的重复请求
 * 2. 统一错误处理，所有登录相关操作都通过回调函数统一处理结果
 * 3. 代码结构优化，提取公共方法，提高可维护性
 * 4. 专注小程序端，去除H5、APP端逻辑，简化代码结构
 * 5. 移除特殊场景处理和手机号绑定逻辑，因为一键登录已包含手机号
 * 6. 最大化简化：未登录时直接跳转到登录页面，无复杂判断逻辑
 * 
 * 使用示例：
 * import { judgeLogin, phoneLogin, onLogin } from '@/config/login';
 * 
 * // 登录检查（未登录会自动跳转到登录页面）
 * judgeLogin((userInfo, error) => {
 *   if (userInfo) {
 *     console.log('用户已登录:', userInfo);
 *     // 执行需要登录后的操作
 *   } else {
 *     console.log('未登录，已跳转到登录页面:', error);
 *     // 用户未登录，已自动跳转到登录页面
 *   }
 * });
 * 
 * // 简化的登录方法（兼容旧版本调用）
 * onLogin(() => {
 *   console.log('登录成功后的操作');
 * });
 * 
 * // 手机号一键登录（在登录页面调用）
 * phoneLogin(phoneDetail, (res, err) => {
 *   if (res) {
 *     console.log('登录成功，已获取手机号:', res);
 *   } else {
 *     console.log('登录失败:', err);
 *   }
 * });
 */

import store from '@/store';
import $http from '@/config/requestConfig'
import base from '@/config/baseUrl';
let loginStart = true;
let judgeLoginStart = true; // 防重复判断登录
let userInfo = {
	token: ""
};

// 小程序登录方法（简化版）
function onLogin(type = "judge", callback) {
    // 如果是函数类型的参数，说明只传了callback
    if (typeof type === 'function') {
        callback = type;
        type = "judge";
    }
    
    // 调用判断登录方法
    judgeLogin(callback, type);
}

// 获取用户信息的统一方法
function getUserInfo() {
    let storeUserInfo = store.state.userInfo;
    console.log(storeUserInfo.token);
    
    if (!storeUserInfo.token) { // nvue页面读取不到vuex里面数据，将取缓存
        storeUserInfo = uni.getStorageSync("userInfo");
    }
    return storeUserInfo;
}





//判断是否登录（小程序端）- 简化版本
function judgeLogin(callback, type = "judge") {
    // 防重复操作
    if (!judgeLoginStart) {
        callback && callback(null, { errMsg: '登录判断进行中，请稍候' });
        return;
    }

    try {
        judgeLoginStart = false;
        const storeUserInfo = getUserInfo();
        console.log(storeUserInfo);
        
        // 已登录且不强制验证
        if (type !== "force" && storeUserInfo.token) {
            judgeLoginStart = true;
            callback && callback(storeUserInfo);
            return;
        }

        // 未登录，直接跳转到登录页面
        if (!storeUserInfo.token) {
            judgeLoginStart = true;
            uni.navigateTo({
                url: "/pages/user/login"
            });
            callback && callback(null, { errMsg: '用户未登录，已跳转到登录页面' });
        } else {
            // 已登录，直接执行回调
            judgeLoginStart = true;
            callback && callback(storeUserInfo);
        }
    } catch (error) {
        judgeLoginStart = true;
        console.error('judgeLogin error:', error);
        callback && callback(null, { errMsg: '登录判断异常: ' + error.message });
    }
}
// 微信小程序手机号一键登录
function phoneLogin(phoneDetail, callback) {
	if (loginStart) {
		loginStart = false;
		
		// 获取微信登录code
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				if (loginRes.errMsg === 'login:ok') {
					let httpData = {
						wxSmallCode: loginRes.code, // 小程序code
						iv: phoneDetail.iv, // 手机号加密算法的初始向量
						encryptedData: phoneDetail.encryptedData, // 包括手机号在内的完整用户信息的加密数据
						loginType: 'phone' // 标识这是手机号登录
					};
					
					// store.state.chatScenesInfo里面是小程序二维码附带的信息
					if(store.state.chatScenesInfo.invite){
						// 推荐码
						httpData.invite = store.state.chatScenesInfo.invite;
					}
					
					// 调用手机号登录接口
					$http.post('api/user/phone-login', httpData).then(res => {
						loginStart = true;
                        uni.setStorageSync("userInfo", res);
						store.commit('setUserInfo', res);
						callback && callback(res);
						uni.showToast({
                            title: "登录成功",
                            icon: 'success'
                        });
					}, err => {
						loginStart = true;
						callback && callback(null, err);
					});
				} else {
					loginStart = true;
					callback && callback(null, { errMsg: '获取微信登录凭证失败' });
				}
			},
			fail: function(err) {
				loginStart = true;
				callback && callback(null, err);
			}
		});
	}
}

// 重置登录状态
function resetLoginState() {
    judgeLoginStart = true;
    loginStart = true;
}


export {
	judgeLogin,
	phoneLogin,
	onLogin,
	resetLoginState,
	getUserInfo
}
