/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){

    //登录判断
    var userToken=app.getValue('userToken','local'),pageNum=1;
    if(userToken == '' || userToken == null){
        app.linkTo('login',{page:'prizeRecord'});
    }else{
        usePointList();
    }

    var vm=avalon.define({
        $id:"vm",
        prizeNum:0,
        array:[],
        isLastPage:false,
        loadMore:function(){
            //点击加载更多
            pageNum++;
            usePointList();
        }
    });

    function usePointList(){
        dataApi.queryMemberMarketLotterList(userToken,pageNum,10).done(
            function(data){
                if(data.code == 200){
                    vm.array=vm.array.concat(data.data.list);
                    vm.prizeNum=data.data.total;
                    vm.isLastPage=data.data.isLastPage;
                }else if(data.code == 601){
                    app.linkTo('login',{page:'prizeRecord'});
                }
            }
        )

    }

    avalon.scan();
})