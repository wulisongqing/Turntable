import config from '../config'
export default {
    post(params){
        var self = this;
        !params.hideLoading && (wx.showLoading({
                                        title:"加载中",
                                        mask:true
                                    }));
        params.tryCount = params.tryCount || 1;
        if(params.tryCount == 1){
            if(wx.getStorageSync("session_key")){
                if(params.url.indexOf('?')>=0){
                    params.url+="&session_key="+ wx.getStorageSync("session_key")+"&_t="+new Date().getTime();
                }else{
                    params.url+="?session_key="+ wx.getStorageSync("session_key")+"&_t="+new Date().getTime();
                }
            }
        }else if(params.url.indexOf("session_key") == -1){
            if(wx.getStorageSync("session_key")){
                if(params.url.indexOf('?')>=0){
                    params.url+="&session_key="+ wx.getStorageSync("session_key")+"&_t="+new Date().getTime();
                }else{
                    params.url+="?session_key="+ wx.getStorageSync("session_key")+"&_t="+new Date().getTime();
                }
            }
        }
        wx.request({
            url: config.apiDomain+params.url,
            method:"POST",
            data:params.data,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success:(res)=>{
                if(res.data && (res.data.code == 20001 || res.data.code == 402)){
                    console.log("[util.post] session_key错误 "+params.url,params.tryCount);
                    if(params.tryCount<30){
                        params.tryCount++;
                        setTimeout(()=>{
                            self.post(params);
                        },100);
                        return ;
                    }
                }
                !params.hideLoading && wx.hideLoading()
                params.success && params.success(res.data);
                if (!res.data.success) {
                    console.log(res.data)
                    global.toast(res.data.message || "未知错误")
                }
            },
            fail:(res)=>{
                console.log(res)
                !params.hideLoading && wx.hideLoading()
                console.log("[util.js] url:"+params.url,res);
                params.fail && params.fail(res)
            },
            complete:()=>{
                params.complete && params.complete()
            }
        });
    }
}