/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui","pictureCarousel"],function(avalon,app,dataApi,dialog){
    var appId=app.getValue('appId','session'),
        isScan=false;
    var vm=avalon.define({
        $id:"vm",
        array:[],
        linkToOther:function(el){
              window.location.href=el.url;
        }
    });

    dataApi.newsList(appId,"",2).done(
        function(data){
            if(data.code == 200){
                vm.array=data.data;
            }else{
                dialog.tipDialog(data.msg);
            }

            if(!isScan){
                isScan=true;
                avalon.scan();
            }

        }
    )
})