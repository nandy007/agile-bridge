agileBridge.config({
    resources: {
        weixin: {
            check: function(){
                try{
                    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        return true;
                    }
                    return false;
                }catch(e){
                    return false;
                }
            },
            js: [
                'https://res.wx.qq.com/open/js/jweixin-1.4.0.js',
                './dist/weixin.js'
            ]
        },
        appnest: {
            check: function(){
                return true;
            },
            pre: function(){
                document.querySelector('html').setAttribute('nqbridge', 'true');
            },
            js: [
                './dist/appnest.js'
            ]
        }
    }
});