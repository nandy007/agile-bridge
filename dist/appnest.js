var appnestsdk = (function(factory){
    
    var sdk = {};

    function init(err){
        if(!err){
            Object.assign(sdk, factory());
            agileBridge.util.assign(appnestsdk);
        }
        agileBridge.util.readyCall(err);
    }

    if(typeof appnest==='object'){
        init();
    }else{
        var st = setTimeout(function(){
            init(new Error('加载appnest超时'));
            clearTimeout(st);
            st = null;
        }, 10*60*1000);
        
        document.addEventListener('plusready', function() {
            if(st){
                clearTimeout(st);
                st = null;
                init();
            }
        });
    }

    return sdk;

})(function(){
    var appnestsdk = {
        nativeObj: appnest
    };

    return appnestsdk;
});
(function(){
    appnestsdk.selectPicture = function(options) {
        
        options = options || {};
        appnest.photo.camera(options);
    };
})();

