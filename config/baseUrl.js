let baseUrl = "";
let socketUrl = "";
if (process.env.NODE_ENV === 'development') {
	// 开发环境
	// baseUrl = "http://192.168.31.70:8080/";
	// socketUrl = "ws://localhost:6001/";
	baseUrl = "https://www.jianyuanlanren.cn/";
	// socketUrl = "ws://8.129.186.35:6001/";
} else if (process.env.NODE_ENV === 'production') {
	// 生产环境
	baseUrl = "https://www.jianyuanlanren.cn/";
	// socketUrl = "ws://twin-ui.com:6001/";
}
const courtConfig = {
	//微信公众号APPID
	publicAppId: "",
	//请求接口
	baseUrl: baseUrl,
	//webSocket地址
	socketUrl: socketUrl,
	//平台名称
	platformName: "uniApp-案例",
	//项目logo
	logoUrl: "https://pcsys.admin.ybc365.com/d895da45-9d32-4fa2-b609-5b34172031cb.jpg",
	//页面分享配置
	share: {
		title: 'uniApp-案例',
		// #ifdef MP-WEIXIN
		path: '/pages/home/home', //小程序分享路径
		// #endif
		// #ifdef H5 || APP-PLUS
		//公众号||APP分享
		desc: "uniApp-案例", // 分享描述
		link: "https://www.kemean.com/sameCity/18031201/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl: "http://qn.kemean.cn/upload/201901/28/23bedfc34597482292ecd6dc107f6342", // 分享图标
		// #endif
	}
};
//手机号验证正则表达式
const phoneRegular = /^1\d{10}$/;
//邮箱验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/;
export default Object.assign({
	phoneRegular,
	mailRegular,
	passwordRegular
}, courtConfig);
