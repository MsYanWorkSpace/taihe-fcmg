require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){

    var canCheck=false,z=0,
        awardCheck=false,
        pageNum=1,
        time;
    //判断抽奖情况
    if(app.getValue('code') == 2001){   //如果已抽奖还有未领取的奖项
        var logoUrl=app.getValue('logoUrl'),
            prizeName=app.getValue('prizeName'),
            awardsLevel=app.getValue('awardsLevel'),
            prizeResult={logoUrl:logoUrl,prizeName:prizeName,awardsLevel:awardsLevel};
            lotteryTipmsg(prizeResult);
    }else if(app.getValue('code') == 2002){  //其它情况
            var msg=app.getValue('msg');
            prizeResult={msg:msg,awardsLevel:0};
            lotteryTipmsg(prizeResult);
    }

    //奖项列表
    prizeList();

    //抽奖所需参数
    var barcode=app.getValue('barcode','session'),
        comId=app.getValue('comId','session'),
        product_id=app.getValue('product_id','session');
    var userToken=app.getValue('userToken','local');


    //大转盘抽奖
   var prizeDeg = [[10,40],[50,80],[95,130],[140,170],[190,220],[240,260],[280,300],[330,350]],
       pointer=document.querySelector("#dialBtn"),
       rand=function(a,b){return Math.floor(Math.random()*(b-a)+a)};

  var vm=avalon.define({
      $id:"vm",
      isLastPage:false,
      array:[],
      ruleMsg:"",
      loadMore:function(){
          //点击加载更多
          pageNum++;
          prizeList();
      },
      activeRule:avtiveRuleDialog,
      dialBtn:isChecks

  });

    //奖项列表
    function prizeList(){
        var activityId=app.getValue('activityId','session');
        dataApi.queryAwardsList(activityId,pageNum,5).done(
            function(data){
                if(data.code == 200){
                    vm.array=vm.array.concat(data.data.list);
                    vm.isLastPage=data.data.isLastPage;
                }
            }
        )
    }


    avalon.scan();

    //抽奖前先判断是否验证过
    function isChecks(){

            if(app.getValue('isCheck','session') == 1 ){  //已验证
                dialPrize();
            }else{
                //未验证，去验证
                app.linkTo('verify',{referer:1}); // referer 判断入口是那个页面
            }
    }

    //点击抽奖
    function dialPrize(){
        //点击开始，发送抽奖接口
        if(canCheck){return;}
        canCheck=true;
        dataApi.doDrwaLottery(barcode,comId,product_id).done(
            function(data){
                canCheck=false;
                if(data.code == 200){
                    var datas=data.data;
                    //把中奖id存贮到本地
                    app.storeValue('winId',datas.winId,'local');
                    switch (datas.awardsLevel){
                        case 1:
                            var deg=prizeDeg[0],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        case 2:
                            var deg=prizeDeg[1],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        case 3:
                            var deg=prizeDeg[2],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        case 4:
                            var deg=prizeDeg[4],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        case 5:
                            var deg=prizeDeg[5],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        case 6:
                            var deg=prizeDeg[6],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        case 0:
                            var deg=prizeDeg[7],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                        default :
                            var deg=prizeDeg[3],degValue=rand(deg[0],deg[1]);
                            start(degValue,datas,data.code);
                            break;
                    }
                }else if(data.code == 2001){   //还有未领取的奖项
                          lotteryTipmsg(data.data);
                }else if(data.code == 2005){   //奖品没有了
                    var deg=prizeDeg[3],degValue=rand(deg[0],deg[1]);
                      start(degValue,data.data);
                }else{
                   // dialog.tipDialog(data.msg);
                    prizeResult={msg:data.msg,awardsLevel:0};
                    lotteryTipmsg(prizeResult);
                }
            }
        )

          //如果扫码值和demo码值相同，把本地存贮的验证结果改为未验证
        for(var i=0; i<window.th.demoBarcode.length; i++){
            if(window.th.demoBarcode[i] == barcode){
                app.storeValue('isCheck',0,'session');
            }
        }


    }

    //开始转盘抽奖
    function start(deg, prizeResult,code){
        var bool = true,newDeg;
        bool=false;
        newDeg=360*10+deg;
        pointer.style.webkitTransition="-webkit-transform 3s ease";
        pointer.style.webkitTransform="rotate("+newDeg+"deg)";
        pointer.style.webkitTransformOrigin="35px 40px;";
        setTimeout(function(){bool=true; lotteryTipmsg(prizeResult,code);},3200);
    }


    //弹框
    function lotteryTipmsg(prizeResult,code){
        clearTimeout(time)
        var bool=prizeResult.awardsLevel == 0,
            msgSrc=  bool? __uri('no-prizes.png') : __uri('prizes.png'),  //整个背景图片
            footerName= bool ?"返回首页":"马上领取",                        //按钮文字
            footerClassName= bool ? "linkToIndex":"lotteryDialogBtn",     //按钮类名
            fn=bool?function(){app.linkTo('index')} :   goAward,          //点击按钮执行方法
            tipTimeMsg=bool?'':'奖品领取有效期为24小时内，请尽快领取',        //领取提示文字
            logoUrl=bool? __uri('lot-result.png') : prizeResult.logoUrl,  //中奖图片
            prizeName=bool? '<strong>'+prizeResult.msg+'</strong>' : '中了<span>"'+ prizeResult.prizeName +'"</span>',
            prizeImg=__uri('demo1.png'); //静态图片

        if(code==200 && bool){
            prizeName='<span>"'+ prizeResult.prizeName +'"</span>'
        }

       var lotteryDialog=dialog.dialog({
            id:"lotteryDialog",
            className:"lotteryDialog",
            bgSwitch:true,
            tip:false,
            bgFn:false,
            content:"<div class='prize-con'>" +
                "<img src='"+msgSrc+"'/>" +
                "<div class='prizeImg'>" +
                "<img src='" +logoUrl+"'/>" +
                "<p class='tipName'>"+prizeName+"</p>"+
                /*"<p class='tipName'>中了<span>"+prizeResult.prizeName+"<span></p>"+*/
                "</div>"+
                "</div>"+
                "<div class='tipTime'>"+tipTimeMsg+"</div>",
            footer:[
                {name: footerName,className:footerClassName}
            ]
           ,
            blindEvent:[
                {
                    ele:"."+footerClassName,
                    type:"click",
                    fn:fn
                }
            ]
        })
        //图片加载完成打开弹框
        var img=new Image();
        img.src=msgSrc;
        img.onload=img.oncomplate=function(){lotteryDialog.open(
           function(){
               var prizeImgWid=$('.prizeImg').width(),
                   margLeft=-(prizeImgWid/2);
               $('.prizeImg').css("margin-left",margLeft);
           }
        )}
          //打开弹框
/*        lotteryDialog.open(function(){
            var prizeImgWid=$('.prizeImg').width(),
                margLeft=-(prizeImgWid/2);
            $('.prizeImg').css("margin-left",margLeft);

            alert($('.dialog-wrap').height());

        });*/

      //  time=setTimeout(lotteryDialog.open);
    }

    //领奖按钮
    function goAward() {
        //点击领奖前先判断是否登录
        if (userToken == '' || userToken == null) {
            app.linkTo('login', {page: 'lotteryResult'});
            return;
        }
        if(awardCheck) return;
           awardCheck=true;
        //调用领奖接口
        var winId=app.getValue('winId','local');
        dataApi.award(winId,userToken).done(
            function(data){
                awardCheck=false;
                if(data.code == 200){
                    app.linkTo('lotteryResult');
                }
                else if(data.code == 20123){  // 中话费 去充值页面
                    app.linkTo('recharge');
                }
                else if(data.code == 601){
                    app.linkTo('login',{page:'lotteryResult'});
                }
                else{
                    dialog.tipDialog(data.msg);
                    setTimeout(function(){
                        app.linkTo('index');
                    },2000)
                }
            }
        )
    }

    //活动规则
    var activityId=app.getValue('activityId','session');
    dataApi.queryActivityInfo(activityId).done(
        function(data){
            if(data.code==200){
                vm.ruleMsg=data.data.comment;
            }
        }
    )

    function avtiveRuleDialog(){
        var ruleDialog=dialog.dialog({
            id:"ruleDialog",
            className:"ruleDialog",
            bgSwitch:true,
            closeSwitch:true,
            title:"活动规则",
            tip:false,
            bgFn:false,
            content:
                    "<div>"+vm.ruleMsg+"</div>"
        })
        ruleDialog.open();
    }

});