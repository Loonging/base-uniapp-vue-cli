# uni-app基础架构

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## 技术栈

- uni-app  >>[官网链接](https://uniapp.dcloud.io/collocation/pages)
  
- uni-simple-router  >>[官方网站](http://hhyang.cn/)
  
- uview-ui  >>[官方网站](https://www.uviewui.com/components/intro.html)
  
- weixin-jsapi >>[官方网站](https://qydev.weixin.qq.com/wiki/index.php?title=%E9%A6%96%E9%A1%B5)

### tips

- 该项目依赖 @vue-cli UniAPP 创建，可以正常使用 uniAPP提供的所有 API ；公众号开发支付等需要引入 `weixin-jsapi` 调用支付/扫一扫/摇一摇等
  
- css预设处理器为scss（如需less、stylus请自行安装，建议统一使用）

- npm install的时候如遇node-sass错误或者无法下载，请把npm源设置为国内淘宝镜像
  
  + npm 镜像源修改方法：`npm config set registry https://registry.npm.taobao.org/`
  
  + npm 镜像源查看：`npm config get registry`
  
u ** 切勿直接使用 cnpm 初始化项目 ** u

## 组件使用

本项目为包含uni-ui全部组件的项目，在pages.json内使用easycom通过正则匹配自动引入组件。无需在页面内import即可使用，效果等同于页面内import。同时在编译过程中自动剔除未使用的组件。

**使用方法如下：**
u uview组件 u

```js
    <u-button
      type="primary"
      @click="handleButton">
      前往个人中心
    </u-button>

```

u 自定义组件 u

```js
<template>
    <view class="container">
		    <dlkj-table>
			    <text>在插入了文本</text>
		    </dlkj-table>
	  </view>
</template>
```

## Animate 使用方法

- 执行安装 `npm install animate.css --save` 

- main.js 中执行挂载

```js
 main.js中：

 import animated from 'animate.css' // npm install animate.css --save安装，再引入

 Vue.use(animated)
```

- 给元素加上 class 后，刷新页面，就能看到动画效果了。animated 类似于全局变量，它定义了动画的持续时间；bounce 是动画具体的动画效果的名称，你可以选择任意的效果。
  
- 如果动画是无限播放的，可以添加 class infinite。

- 具体动画样式请参考 Animate 官网示例 [跳转](https://daneden.github.io/animate.css/)

```vue
<template>
  <view class="container ">
    <view
      class="test animate__animated "
      hover-start-time="1000"
      hover-class="view-hover animate__bounce">
      测试动画
    </view>
  </view>
</template>

<script>
</script>

<style>
.test {
  width: 200rpx;
  height: 200rpx;
  background: skyblue;
  margin: 200rpx;
}
.view-hover {
  background: tomato;
}
</style>
```

## weixin-jsapi 使用方法

#### 实现微信支付案例 

- 一、环境配置

  + 1、当前项目的命令行工具里安装 `npm install weixin-jsapi -S`
  
  + 2、在当前支付页面引用该 weixin-jsapi `import wx from 'weixin-jsapi'`

- 一、调用后台接口，正式使用jssdk：

```js
created(){
    this.userId = JSON.parse(Cookie.get("user")).id;//这是在我页面需要获取的userid，不需要的可自行删悼，不在支付代码范围
    this.getConfig();，
},
methods: {
    getConfig(){
        console.log(window.location.href);
        var url = window.location.href;
        this.$http.post('**此处写后台提供获取jsapi相关配置的接口**',{
            encodeUrl:Encrypt(url.split("#")[0])  //直接丢弃#及后面的字符串   注意这里Encrypt因为我的项目里使用了ase加密解密，所以这么写的
        })
        .then(function(response) {
            if(response.data.flag == true){
                var data = JSON.parse(Decrypt(response.data.data));//将解密后的字符串转为对象  Decrypt这里是解密，不需要的就直接过滤悼
                console.log(data);
                //下列的data.均为后台接口返回的字段，比如我的项里里返回的是 appid,timestamp,nonceStr,signature
                wx.config({
                    debug: ture,//这里一般在测试阶段先用ture，等打包给后台的时候就改回false,
                    appId: data.appid,
                    timestamp: data.timestamp, 
                    nonceStr: data.noncestr, 
                    signature: data.signature,
                    jsApiList: ['chooseWXPay']
                })
                wx.ready(function(){
                    wx.checkJsApi({
                        jsApiList: ['chooseWXPay'],
                        success:function(res){
                            console.log("seccess")
                            console.log(res)
                        },
                        fail:function(res){
                            console.log("fail");
                            console.log(res)
                        }
                    })
                })
            }else{
                Toast({
                    message: response.data.detailMsg
                });
            }
        }).catch(function(error){
            Toast({//提示引用的是mint-UI里toast
                message: '获取config失败，请重试'
            });
        });
    },
    //报名缴费   ( 支付按钮绑定@click="toapply()"事件)
     toapply(id){ 
        var $this = this;
        this.$http.post('**此处写后台提供的获取支付json数据接口**',{
            encodeStr:Encrypt(id)//项目里的加密
        })
        .then(function(response) {
            if(response.data.flag == true){
                var data = JSON.parse(Decrypt(response.data.data));//将解密后的字符串转为对象
                console.log(data);
                wx.ready(function(){
                    wx.chooseWXPay({
                        appId:data.appId,
                        timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 
                        package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: data.paySign, // 支付签名
                        success: function (res) {
                            //跳转到支付成功页面有这个页面
                            $this.$router.push({
                                path: "/success_page",
                                name:"success_page"
                            })
                            console.log(res);
                        },
                        cancel: function (res) {//提示引用的是mint-UI里toast
                            Toast('已取消支付');
                        },
                        fail: function (res) {
                            Toast('支付失败，请重试');
                        }
                    })
                })
            }else{
                Toast({
                    message: '获取支付信息失败，请重试',
                });
            }
        }).catch(function(error){
            Toast({
                message: '获取订单信息失败，请重试',
            });
            console.log(error);
        });
    },
}
```