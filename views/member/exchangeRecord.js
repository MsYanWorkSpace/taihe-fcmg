/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){

    //登录判断
    var userToken=app.getValue('userToken','local'),pageNum=1;
    if(userToken == '' || userToken == null){
        app.linkTo('login',{page:'exchangeRecord'});
    }else{
        exchangAllPoint();
        usePointList();
    }

    var vm=avalon.define({
        $id:"vm",
        exchangePoint:"",
        array:[],
        isLastPage:false,
        loadMore:function(){
            //点击加载更多
            pageNum++;
            usePointList();
        }
    });
    //已兑换积分
    function exchangAllPoint(){
          dataApi.queryTotalUsePoint(userToken).done(
              function(data){
                  if(data.code == 200){
                      vm.exchangePoint=data.data;
                  }
                  else if(data.code == 601){
                      app.linkTo('login',{page:'exchangeRecord'});
                  }
              }
          )
    }

    function usePointList(){
        dataApi.queryUsePointList(userToken,pageNum,10).done(
            function(data){
                if(data.code == 200){
                    vm.array=vm.array.concat(data.data.list);
                    vm.isLastPage=data.data.isLastPage;
                }else if(data.code == 601){
                    app.linkTo('login',{page:'exchangeRecord'});
                }
            }
        )

    }

    avalon.scan();
})