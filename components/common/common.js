/**
 * Created by pdc on 2016/4/10.
 */

var url=require("url"),
    host=require("host-config"),
    dialog=require("dialog");
    require("$");

var debug=true,
    rword = /[, ]+/g,
    DOC=document;

var loading=(function(){
    var count= 0,
        html= "<div class='loading-bg'></div>" +
            "<div class='loading-box'>" +
            "<div class='loading'>" +
            "<div class='loading-icon loading-icon-0'></div>" +
            "<div class='loading-icon loading-icon-1'></div> " +
            "<div class='loading-icon loading-icon-2'></div> " +
            "<div class='loading-icon loading-icon-3'></div> " +
            "<div class='loading-icon loading-icon-4'></div> " +
            "<div class='loading-icon loading-icon-5'></div> " +
            "<div class='loading-icon loading-icon-6'></div> " +
            "<div class='loading-icon loading-icon-7'></div> " +
            "<div class='loading-icon loading-icon-8'></div> " +
            "<div class='loading-icon loading-icon-9'></div> " +
            "<div class='loading-icon loading-icon-10'></div> " +
             "<div class='loading-icon loading-icon-11'></div> " +
            "</div> " +
            "<p class='loading-p'>数据加载中</p>"+
            "</div>",
        div;
    return {
        show:function(){
            if(count<1){
                if(!div){
                    div=DOC.createElement("div");
                    div.className="loading-wrap";
                    div.innerHTML=html
                }
                DOC.body.appendChild(div);
            }
            count++;
        },
        hide:function(){
            if(count<=1&&div){
                DOC.body.removeChild(div)
            }
            count--;
        }
    };
})();
function setCookie(c_name,value,expiredays){
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    DOC.cookie=c_name+ "=" +decodeURI(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function getCookie(cookieName){
    var start = DOC.cookie.indexOf(cookieName+"=");
    if (start ==-1) {return "";}
    start = start+cookieName.length+1;
    var end = DOC.cookie.indexOf(";",start);
    if (end==-1) {end = DOC.cookie.length;}
    return decodeURIComponent(DOC.cookie.substring(start,end));
}
//存储键值对
function storeValue(key,value,type){
    var type=type||"url";
    switch(type){
        case "url":
            return "&"+encodeURIComponent(key)+"="+encodeURIComponent(value);
        case "local":
            if(!window.localStorage){
                return false;
            }
            localStorage.setItem(host.prefix+key,value);
            break;
        case "session":
            if(!window.sessionStorage){
                return false;
            }
            sessionStorage.setItem(host.prefix+key,value);
            break;
        case "cookie":
            setCookie(host.prefix+key,value);
            break;

    }
};
//提取值
function getValue(key,type){
    var type=type||"url";
    switch(type){
        case "url":
            return getParamValue(key);
            break;
        case "local":
            return localStorage.getItem(host.prefix+key);
            break;
        case "session":
            return sessionStorage.getItem(host.prefix+key);
            break;
        case "cookie":
            return getCookie(host.prefix+key);
            break;
    }
};
//删除值
function deleteValue(key,type){
    var type=type||"all";
    if(!key){
        localStorage.clear();
        sessionStorage.clear();
        return;
    }
    switch(type){
        case "all":
            localStorage.removeItem(host.prefix+key);
            sessionStorage.removeItem(host.prefix+key);
            setCookie(host.prefix+key,"",-1);
            break;
        case "local":
            localStorage.removeItem(host.prefix+key);
            break;
        case "session":
            sessionStorage.removeItem(host.prefix+key);
            break;
        case "cookie":
            setCookie(host.prefix+key,"",-1);
            break;
    }
};

//url中提取值辅助函数
function getUrlparams(){
    var src=window.location.search,
        arr=src.substr(1,src.length-1).split("&"),
        returnObj={};
    if(arr!==null){
        for(var i=0,l=arr.length;i<l;i++){
            var value=arr[i].split("=");
            if(value&&value.length>1){returnObj[decodeURIComponent(value[0])]=decodeURIComponent(value[1])}
        }
    }
    return returnObj;
};
//url中提取值
function getParamValue(name){
    var param=getUrlparams();
    if(param[name]){
        return param[name];
    }
    return null;
}
//调试信息打印
function log(){
    if (window.console &&debug) {
        Function.apply.call(console.log, console, arguments)
    }
}
function linkTo(name,obj,location){
    if(url[name]){
        var Url=url[name],
            _window=this.window||window;
        // LINK[name].js&&(Url+="&js=1");
        if(obj){
            Url+="?";
            for(var _name in obj){
                Url+="&"+encodeURIComponent(_name)+"="+encodeURIComponent(obj[_name]);
            }
        }
        _window.location.href=location?location+Url:Url;
    }
}
//接口调用控制
function useApi(apiName,apiSource){
    var source=apiSource||{},
        apiObj=source[apiName];
    if(!apiObj){
        log("未找到"+apiName+"接口相关数据");
        return false;
    }
    var competence=(apiObj.competence&&apiObj.competence)||true;
    if(competence){
        return {
            url:host.port+apiObj.url,
            data: function () {
                var str=apiObj.param,
                    _data={};
                if(str){
                    str=str.split(rword);
                    var len=str.length,
                        pop=Array.prototype.pop;
                    while(str[len-1]){
                        var name=str[len-1],
                            value=pop.apply(arguments);
                        _data[name]=value=="undefined"?"":value;
                        len--;
                    }
                }
                return _data;
            }
        }
    }else{
        apiObj.error&&apiObj.error();
    }
}

//封装带有loading图标的ajax请求
function loadAjax(param){
    loading.show();
    return $.ajax({
        type:param.type||"post",
        url:param.url,
        data:param.data,
        async:param.async||true
    }).fail(
        function(data){
            if(data.msg){
                dialog.tipDialog(data.msg)
            }
        }
    ).always(
        function(date){
            loading.hide();
            param.complete&&param.complete(date);
        }
    )
}

//MODULE生成对应返回接口工厂函数
function moduleFactory(data){
    var obj={};
    $.each(data,function(name,value){
        obj[name]=function(){
            var api=useApi(name,data);
            if(data[name].fn){
                return data[name].fn.call(this,api.url,api.data.apply(this,arguments))
            }else{
                return loadAjax({
                    url:api.url,
                    data:api.data.apply(this,arguments)
                })
            }
        }
    })
    return obj;
}
//对数字进行分割
function divisionNum(str,section,separator){
    var section=section|| 3,
        separator=separator||",",
        reg=new RegExp('(\\d)(?=(?:\\d{'+section+'})+$)','g');
    str=(str+"").replace(reg,'$1'+separator)
    return str;
}
//对不足位数进行填充
function intercept(str,section,separator){
    var section=section|| 3,
        separator=separator||"0",
        l=(str+"").length,
        ary=new Array(section-0+1).join(separator);
    if(l>=section){
        return (str+"").substr(l-section)
    }else{
        return ary.substr(0,section-l)+str;
    }
}
//替换原字符中的指定元素
function digita(str,separator){
    var separator=separator||",",
        reg=new RegExp(separator,'g')
    return (str+"").replace(reg,"")
}
var num={
    division:divisionNum,
    intercept:intercept,
    digita:digita
};
//日期处理
Date.prototype.format=function(str){
    var week=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],
        time={
            "y+":this.getFullYear(),
            "M+":this.getMonth()+1,
            "d+":this.getDate(),
            "H+":this.getHours(),
            "m+":this.getMinutes(),
            "s+":this.getSeconds(),
            "w":this.getDay(),
            "W":week[this.getDay()]
        },
        str=str||"yyyy-MM-dd HH:mm:ss";
    for(var i in time){
        var reg=new RegExp('('+i+')','g');
        str=str.replace(reg,function(){return intercept(time[i],(i=="w"||i=="W")? time[i].length:arguments[1].length)})
    }
    return str;
}
return {
    storeValue:storeValue,
    getValue:getValue,
    deleteValue:deleteValue,
    useApi:useApi,
    linkTo:linkTo,
    moduleFactory:moduleFactory,
    num:num
}