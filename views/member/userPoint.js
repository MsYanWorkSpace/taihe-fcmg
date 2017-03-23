/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog"],function(avalon,app,dataApi,dialog){

    //登录判断
    var userToken=app.getValue('userToken','local'),
        pageNum=1;
    if(userToken == '' || userToken == null){
        app.linkTo('login',{page:'userpoint'});
    }else{
        pointList();
    }

    var pointValue=app.getValue('pointValue','session');
    var totalValue=app.getValue('totalValue','session');
    var vm=avalon.define({
        $id:"vm",
        totalValue:totalValue,
        pointValue:pointValue,
        ctime:"",
        isLastPage:false,
        src_type:{3301:'抽奖积分',3302:'积分兑换',3303:' 返还积分',3304:'印章兑换',3305:'绑定专卖证'},
        array:[],
        loadMore:function(){
            //点击加载更多
            pageNum++;
            pointList();
        }
    });
    function pointList(){
        //积分列表接口
        dataApi.pointList(userToken,pageNum,10).done(
            function(data){
                if(data.code == 200){
                    vm.array=vm.array.concat(data.data.list);
                    vm.isLastPage=data.data.isLastPage;
                }
                else if(data.code == 601){
                    app.linkTo('login',{page:'userpoint'});
                }
            }
        )
    }

    avalon.scan();
})