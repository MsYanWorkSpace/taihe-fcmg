/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","pictureCarousel"],function(avalon,app,dataApi,dialog){


    function AutoScroll(obj){
        $(obj).find("#ad-marquree:first").animate({
            marginTop:"-30px"
        },600,function(){
            $(this).css({marginTop:"0px"}).find(".li:first").appendTo(this);
        });
    }

        setInterval(function(){
            AutoScroll($('#scrollDiv'));
            var liWidth= $('#scrollDiv').width();
            $('#scrollDiv p').css({'width':liWidth,' white-space':'nowrap','text-overflow':'ellipsis','overflow':'hidden'});
        },2300);


    //从url地址取到二维码
     var barcode=app.getValue('barcode','session'),
         userToken=app.getValue('userToken','local');


    var vm=avalon.define({
        $id:"vm",
        verifyBtn:function(){

                  //如果扫码进来  码值和demo码值一样 则直接去验证页（不管扫多少次码）
                  for(var i=0; i<window.th.demoBarcode.length; i++){
                      if( window.th.demoBarcode[i] == barcode){
                          app.linkTo('verify',{referer:2});// referer 判断入口是那个页面
                          return;
                      }
                  }

                if(app.getValue('isCheck','session') == 0){   //0未验证   1已验证
                    app.linkTo('verify',{referer:2});// referer 判断入口是那个页面
                }else if(app.getValue('isCheck','session') == 1){
                    app.linkTo('verifyResult',{resultCode:2,referer:2}); //resultCode 在结果页判断显示内容   referer 判断入口是那个页面
                }

                /* if( window.th.demoBarcode == barcode){
                     app.linkTo('verify',{referer:2});// referer 判断入口是那个页面
                 }else{

                     if(app.getValue('isCheck','session') == 0){   //0未验证   1已验证
                         app.linkTo('verify',{referer:2});// referer 判断入口是那个页面
                     }else if(app.getValue('isCheck','session') == 1){
                         app.linkTo('verifyResult',{resultCode:2,referer:2}); //resultCode 在结果页判断显示内容   referer 判断入口是那个页面
                     }
                 }*/


        },
        prizeBtn:function(){
            //判断是否已抽奖
            dataApi.discern(barcode).done(
                function(data){
                    if(data.code == 200){
                        //还未抽奖  前去抽奖页面
                        app.linkTo('lottery');
                    }
                    else if(data.code == 2001){
                        //还有未领取的奖项
                        app.storeValue('winId','local');  //把中奖id存贮到本地
                        app.linkTo('lottery',{code:2001,logoUrl:data.data.logoUrl,prizeName:data.data.prizeName,awardsLevel:data.data.awardsLevel});
                    }else{
                        app.linkTo('lottery',{code:2002,msg:data.msg});
                         //dialog.tipDialog(data.msg);
                    }
                }
            )

        },
        memberCenterBtn:function(){
            if(userToken == '' || userToken == null || userToken == undefined){
                app.linkTo('login');
            }else{
                app.linkTo('memberCenter');
            }
        },
        consultBtn:function(){
            app.linkTo('consultCenter');
        },
        productBtn:function(){
            app.linkTo('productCategory');
        },
        storeBtn:function(){
            app.linkTo('store');
        },
        aboutUsBtn:function(){
            app.linkTo('aboutUs');
        },
        exchangeBtn:function(){
            app.linkTo('exchangeCenter');
        },
        proStartBtn:function(){
            app.linkTo('prostart');
        },
        checkBtn:function(){
            app.linkTo('goodscheck');
        }
    });

    avalon.scan();

    //调用轮播图片
    new thApi.pictureCarousel(".banner-wrap",{
        imgUrl:[[__uri("banner-1.jpg")],[__uri("banner-2.jpg")],[__uri("banner-3.jpg")],[__uri("banner-4.jpg")]]
    });
})




