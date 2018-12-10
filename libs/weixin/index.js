var wxsdk = (function(factory){

    var sdk = factory();

    agileBridge.util.assign(sdk);

    wx.ready(function(){
        agileBridge.util.readyCall();
    });

    wx.error(function(res){
        agileBridge.util.readyCall(res);
    });

    wx.config(agileBridge.env.wxConfig || {});

    return sdk;

})(function(){
    var wxsdk = {
        nativeObj: wx
    };

    return wxsdk;
});