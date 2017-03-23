/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui","pictureCarousel"],function(avalon,app,dataApi,dialog){

    var id=app.getValue('id');

    var vm=avalon.define({
        $id:"vm",
        title:"",
        info:""
    });
    dataApi.queryNews(id).done(
        function(data){
            if(data.code == 200){
                vm.title=data.data.news.title;
                vm.info=data.data.news.info;

                //过滤掉html标签
               /* vm.info =  vm.info.replace(/(\n)/g, "");
                vm.info =  vm.info.replace(/(\t)/g, "");
                vm.info =  vm.info.replace(/(\r)/g, "");
                vm.info =  vm.info.replace(/<\/?[^>]*>/g, "");
                vm.info =  vm.info.replace(/\s*//*g, "");*/

            }else{
                dialog.tipDialog(data.msg);
            }
        }
    )


    avalon.scan();

})