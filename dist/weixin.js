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
(function(){
    wxsdk.selectPicture = function(options) {
        options = options || {};
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                options.success && options.success(localIds);
            }
        });
    };
})();

