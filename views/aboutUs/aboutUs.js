/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui","pictureCarousel"],function(avalon,app,dataApi,dialog){
    var appId=app.getValue('appId','session');
    var vm=avalon.define({
        $id:"vm",
        title:"",
        info:"",
        barcodeImg:""
    });


    dataApi.newsList(appId,"",3).done(
        function(data){
            if(data.code == 200){

                if(data.data=='' || data.data==null){
                    vm.info='抱歉！暂无相关信息';
                    $('.ewm').hide();
                    return;
                }

                var data=data.data[0];
                vm.title=data.name;
                vm.info=data.info;
                vm.barcodeImg=data.images[0].path;

                //过滤掉html标签
                vm.info =  vm.info.replace(/(\n)/g, "");
                vm.info =  vm.info.replace(/(\t)/g, "");
                vm.info =  vm.info.replace(/(\r)/g, "");
                vm.info =  vm.info.replace(/<\/?[^>]*>/g, "");
                vm.info =  vm.info.replace(/\s*/g, "");

            }else{
                dialog.tipDialog(data.msg);
            }
        }
    )

    avalon.scan();
    //调用轮播图片
    new thApi.pictureCarousel(".banner-wrap",{
        imgUrl:[[__uri("banner-1.jpg")]]
    });
})