(function(){
    appnestsdk.selectPicture = function(options) {
        
        options = options || {};
        appnest.photo.camera(options);
    };
})();

