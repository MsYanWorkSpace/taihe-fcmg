/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){

    //登录判断
    var userToken=app.getValue('userToken','local'),pageNum=1;
    if(userToken == '' || userToken == null){
        app.linkTo('login',{page:'verifyRecord'});
    }else{
        scanNum();
        exchangeReList();
    }

    var vm=avalon.define({
        $id:"vm",
        array:[],
        total:0,
        scannum:0,
        isLastPage:false,
        loadMore:function(){
            //点击加载更多
            pageNum++;
            exchangeReList();
        }
    });
    //会员扫码次数
    function scanNum(){
        dataApi.queryUserScanCodeNum(userToken).done(
            function(data){
                if(data.code == 200){
                    vm.scannum=data.data.scanTotal;
                }
                else if(data.code == 601){
                    app.linkTo('login',{page:'verifyRecord'});
                }
            }
        )
    }
    //兑换纪录
    function exchangeReList(){
        dataApi.queryByPhone(userToken,pageNum,10).done(
            function(data){
                if(data.code == 200){
                    var data= data.data;
                    vm.array=vm.array.concat(data.list);
                    vm.total=data.total;
                    vm.isLastPage=data.isLastPage;
                }
                else if(data.code == 601){
                    app.linkTo('login',{page:'verifyRecord'});
                }
            }
        )

    }

    avalon.scan();
})