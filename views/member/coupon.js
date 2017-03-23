/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){

    //登录判断
    var userToken=app.getValue('userToken','local'),
        type=1304,
        use={
            pageNum:1,
            array:[],
            useNum:0,
            unuseNum:0,
            isLastPage:false
        },
        unUse={
            pageNum:1,
            array:[],
            useNum:0,
            unuseNum:0,
            isLastPage:false
        };

    var vm=avalon.define({
        $id:"vm",
        array:[],
        useNum:0,
        unuseNum:"",
        useStatus:1,
        isLastPage:false,
        tab:function(num){
            vm.useStatus=num;
            couponList()
        },
        loadMore:function(){
            //点击加载更多
            var obj=vm.useStatus?unUse:use;
            obj.pageNum++;
            couponList(1);
        }
    });

    if(userToken == '' || userToken == null){
        app.linkTo('login',{page:'coupon'});
    }else{
        couponList();
    }
   //优惠券列表
    function couponList(bool){
        var obj=vm.useStatus?unUse:use;
        if(bool||obj.array.length==0){
            dataApi.userGain(userToken,type,vm.useStatus,obj.pageNum,10).done(
                function(data){
                    if(data.code == 200){
                        vm.array=obj.array=obj.array.concat(data.data.list);
                        vm.useStatus?vm.useNum=obj.useNum=data.data.total:vm.unuseNum=obj.unuseNum=data.data.total;
                        vm.isLastPage=obj.isLastPage=data.data.isLastPage;
                    }else if(data.code == 601){
                        app.linkTo('login',{page:'coupon'});
                    }
                }
            )
        }else{
            vm.array=obj.array;
            vm.isLastPage=obj.isLastPage
        }

    }

    avalon.scan();
})