import Vue from 'vue'
import App from './App'
// import config from './config'
import ajax from './core/ajax'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.use({
    install(Vue){
    	const eventHandle = new Vue()
        // 页面跳转
        // 注意参数中若包含富文本或者引号,请用localstorage传递参数
        Vue.prototype.$toPage = function(url, obj) {
            let params = '';
            for(let key in obj){
                console.log(typeof(obj[key]))
                if(typeof(obj[key]) == 'object'){
                    obj[key] = JSON.stringify(obj[key]);
                }
                if(params == ''){
                    params = '?' + key + '=' + obj[key];
                }else{
                    params += '&' + key + '=' + obj[key];
                }
            }
            wx.navigateTo({
                url: url + params
            });
        }
        // 关闭当前页面，跳转到应用内的某个页面
        Vue.prototype.$redirectToPage = function(url, obj) {
            obj = obj || {};
            let params = '';
            for(let key in obj){
                if(typeof(obj[key]) == 'object'){
                    obj[key] = JSON.stringify(obj[key]);
                }
                if(params == ''){
                    params = '?' + key + '=' + obj[key];
                }else{
                    params += '&' + key + '=' + obj[key];
                }
            }
            console.log(params);
            wx.redirectTo({
                url: url + params
            });
        }
        // 返回
        Vue.prototype.$back = function(delta){
            delta = delta || 1;
            wx.navigateBack({
                delta: delta
            });
        }
        // 获取参数
        Vue.prototype.$getParams = function(){
            return this.$root.$mp.query;
        }
        // 消息提示
        Vue.prototype.toast = function(text){
            wx.showToast({
                title: text,
                icon: 'none',
                duration: 2000
            });
        }
        // 弹框提示
        Vue.prototype.showTips = function(msg, close){
            wx.showModal({
                title: '提示',
                content: msg,
                showCancel: false,
                success: function (res) {
                if (res.confirm) {
                    close && close()
                }
                }
            })
        }
        // 时间戳转换 yyyy-mm-dd
        Vue.prototype.formatDate = function(time){
            time = new Date(time);
            var year = time.getFullYear();
            var month = (time.getMonth() + 1).toString().length === 1 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
            var date = time.getDate().toString().length === 1 ? '0' + time.getDate() : time.getDate();
            return year + '-' + month + '-' + date;
        }

        // ajax请求
        Vue.prototype.$post = ajax.post;

        Vue.prototype.$eventHandle = eventHandle;

        // 随机排序
        Vue.prototype.randomIndex = function() {
          return Math.random() > .5 ? -1 : 1;
        }
        // 全局数据
        Vue.prototype.$globalData = {
           userInfo: null,
           heighestScore: 0,
           systemInfo: null,
           zhuan: 0,
           repeat:false,
           defaultJueding:'',
           fastJuedin: false,
           musicflg: true,
        }
    }
})
