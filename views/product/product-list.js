/**
 * Created by pdc on 2016/5/11.
 */
require(["avalon","common","dataApi","dialog"],function(avalon,app,api,dialog){
    var appId=app.getValue("appId","session"),
        classId=app.getValue("classId"),
        name=app.getValue("name"),
        pageNum= 1,
        pageSize=10,
        isScan=false;
    document.title=name;
    var vm=avalon.define({
        $id:"vm",
        array:[],
        isLastPage:true,
        loadMore:function(){
            inquire(pageNum+1)
        },
        detail:function(el){
            if(el.url){
                window.location.href=el.url;
            }else{
                var obj={
                    id:el.id
                };
                app.linkTo("productDetail",obj)
            }
        }
    });

    function inquire(num){
        api.productList(appId,classId,num,pageSize).done(success)
    }
    function success(date){
        if(date.code==200){
            vm.array=vm.array.concat(date.data.list);
            vm.isLastPage=date.data.total<=pageNum*pageSize;

        }else{
             date.msg&&dialog.tipDialog(date.msg)
        }
        if(!isScan){
            isScan=true;
            avalon.scan();
        }
    }
    inquire(pageNum);

})