/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","validate","pictureCarousel"],function(avalon,app,dataApi,dialog,valid){

    //获取url上带过来的code参数
    var resultCode=app.getValue('resultCode'),
        referer=app.getValue("referer"),
        barcode=app.getValue('barcode','session'),
        nowtime=app.getValue('nowtime');

    //验证过则调用扫码次数
        scanTime();

    var vm=avalon.define({
        $id:"vm",
        resultCode:resultCode,
        countNum:0,
        ctime:"",
        nowtime:nowtime,
        referer:referer,
        linkTo:function(){
            if(referer == 2){ //返回首页
                app.linkTo('index');
            }else if(referer == 1){ //返回抽奖
                app.linkTo('lottery');
            }
        }
    });

    //获取二维扫描次数
    function scanTime(){
        dataApi.queryCodeScanTime(barcode).done(
            function(data){
                if(data.code==200){
                    //验证次数
                    vm.countNum=data.data.countNum;
                    var time=new Date(data.data.ctime).format();
                    vm.ctime=time;
                }
            }
        );
    }

    avalon.scan();
    //调用轮播图片
    new thApi.pictureCarousel(".banner-wrap",{
        imgUrl:[[__uri("banner-2.jpg")]]
    });

})




