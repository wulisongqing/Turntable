// 登录模块
import ajax from '../core/ajax'

export default{
    _session_key:null,
    _userinfo:null,
    _cb:[],
    _isLogin:false,
    login(cb,relogin){
        if(relogin){
            wx.setStorageSync("session_key","");
        }
        wx.login({
            success:(res)=>{
                let code = res.code;
                wx.getUserInfo({
                    lang: 'zh_CN',
                    success:(res)=>{
                        let encryptedData = res.encryptedData;
                        let iv = res.iv;
                        this._login(code,encryptedData,iv,cb);
                    }
                });
            }
        });
    },
    _login(code,encryptedData,iv,cb){
        if(wx.getStorageSync("session_key") && wx.getStorageSync("userinfo")){
            this._session_key = wx.getStorageSync("session_key");
            this._userinfo = wx.getStorageSync("userinfo");
            cb && cb();
            this._isLogin = true;
            if(this._cb && this._cb.length){
                this._cb.forEach(func => {
                    func && func();
                });
                this._cb = [];
            }
            return;
        }
        let res = wx.getSystemInfoSync();
        console.log(res)
        var _data = {
          code:code,
          encryptedData:encryptedData,
          iv:iv,
          system:res.system,
          model:res.model
        }
        console.log(JSON.stringify(_data));
        ajax.post({
            url:"/sn/user/login.do",
            data: _data,
            success:res=>{
                this._session_key = res.object._key;
                this._userinfo = res.object.userinfo;
                wx.setStorageSync("userinfo",this._userinfo);
                wx.setStorageSync("session_key",this._session_key);
                cb && cb();
                this._isLogin = true;
                if(this._cb && this._cb.length){
                    this._cb.forEach(func => {
                        func && func();
                    });
                    this._cb = [];
                }
            }
        });
    },
    getSessionKey(){
        return this._session_key;
    },
    getUserId(){
        return this._userinfo && this._userinfo.userID;
    },
    loginSuccess(cb){
        if(this._isLogin){
            cb && cb();
            return;
        }
        this._cb.push(cb);
    }

}
