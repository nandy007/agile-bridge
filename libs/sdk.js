


var agileBridge = (function(win, fatory){
    var sdk = fatory(win);
    if(typeof module === "object" && typeof module.exports === "object"){
        module.exports = sdk;
    }
    return sdk;
})(this, function(win){
    var _options = {
        isDebug: false
    };
    var util = {
        getEnv: function(){
            var defaultName = 'default';
            for(var k in _options.resources){
                if(k===defaultName) continue;
                var resource = _options.resources[k];
                if(resource.check()){
                    return resource;
                }
            }
            return _options.resources && _options.resources[defaultName];
        },
        init: function(cb){
            var env = util.getEnv();
            if(!env) return cb(new Error('没有可使用的资源'));

            // util.assign(env);

            agileBridge.env = env;

            env.pre && env.pre();

            util.appendJS(env.js, function(){
                env.init && env.init(cb);
            });
        },
        assign: function(sdk){
            for(var k in sdk){
                if(apiLists.indexOf(k)>-1){
                    (function(k){
                        agileBridge[k] = typeof sdk[k]==='function'?function(){
                            return sdk[k].apply(sdk, arguments);
                        } : sdk[k];
                    })(k);
                }
            };
        },
        loadJSSync: function(assets, $head, cb){
            var asset = assets.shift();
            if(!asset) return cb();

            var $script = document.createElement('script');
            $script.type = 'text/javascript';
            $script.src = asset;
            
            $script.onload = $script.readystatechange = function () {
                if (!$script.readyState || /loaded|complete/.test($script.readyState)) {  
                    $script.onload = $script.readystatechange = null;
                    util.loadJSSync(assets, $head, cb);
                }
            };
            $head.appendChild($script);
        },
        appendJS: function(js, cb){
            var jsArr = js && ((js instanceof Array) ? js : [js]);
            if(!jsArr) return cb();
            var $head = document.getElementsByTagName('head')[0];
            util.loadJSSync(jsArr.slice(0), $head, cb);
        },
        readyCall: function(err){
            if(err) util.console.error(err);
            agileBridge.isInit = err?-1:1;
            var cb;
            while(cb=readyCallbacks.shift()){
                if(agileBridge.isInit===-1){
                    cb.fail && cb.fail();
                }else if(agileBridge.isInit===1){
                    cb.success && cb.success();
                }
            }
        },
        console: {
            log: function(){
                if(!_options.isDebug) return;
                console.log.apply(console, arguments);
            },
            error: function(){
                if(!_options.isDebug) return;
                console.error.apply(console, arguments);
            }
        }
    };

    var apiLists = [
        'nativeObj', 'native', 'isInit',
        
        'plusready', 'selectPicture', 'selectFile', 'selectDateTime'
    ];

    var readyCallbacks = [];

    var agileBridge = {
        util: util,
        isInit: 0,
        config: function(options){
            Object.assign(_options, options || {});
            util.init(function(err){
                if(err) util.console.error(err);
            });
        },
        plusready: function(success, fail){
            if(agileBridge.isInit===-1) return fail && fail();
            if(agileBridge.isInit===1) return success && success();

            readyCallbacks.push({success: success, fail: fail});
        },
        nativeObj: null,
        native: function(){
            var args = Array.prototype.slice.call(arguments);
            var funcName = args.shift();
            if(typeof funcName!=='string'){
                util.console.error('第一个参数为参数名，格式不正确');
                return;
            };
            if(!agileBridge.nativeObj){
                util.console.error('原生对象未设置，请在config参数中每个resources设置自己native对象');
                return;
            }
            var func = agileBridge.nativeObj[funcName];
            if(!func){
                util.console.error('原生对象未有函数：'+funcName);
                return;
            }
            func.apply(agileBridge.nativeObj, args);
        }
    };


    return agileBridge;
});