require(["avalon","common","dataApi","dialog","validate","weui"],function(avalon,app,dataApi,dialog,valid) {
    var comId = app.getValue('comId', 'session'),
        id=app.getValue('id'),
        userToken = app.getValue('userToken', 'local'),
        exchangeBtn=false;

    var vm=avalon.define({
        $id:"vm",
        names:"",
        imgs:"",
        needPoint:0,
        pointValue:0,
        phone:"",
        userToken:userToken,
        exchangeBtn:check
    });

    //查询话费详情
    dataApi.prizeInfoDetail(id,comId).done(
        function(data){
            if(data.code==200){
                var data=data.data.list[0];
                vm.imgs=data.logoUrl;
                vm.names=data.name;
                vm.needPoint=data.pointValue;
            }
        }
    )
    //查询用户积分
    dataApi.getCurLoginUser(userToken).done(
        function(data){
            if(data.code == 200){
                var data=data.data;
                vm.pointValue=data.pointValue;
                //存贮用户积分
                app.storeValue('pointValue',data.pointValue,'session');
            }
            else if(data.code==601){
                app.linkTo('login', {page: 'exchangeTelBill', id: id});
            }
        }
    )
    //表单验证
    var vali=new valid([
        {name:"phone",type:["required","tel"],message:{required:"请输入手机号码"}}
    ],exchangeInfo);

    function check(){
        if(userToken=='' || userToken==null) {
            app.linkTo('login', {page: 'exchangeTelBill', id: id});
            return;
        }
        if(vm.pointValue < vm.needPoint){
            dialog.tipDialog('抱歉！积分不足！');
            return;
        }
        vali.checkAll();

    }

    //点击兑换
    function exchangeInfo(){
        if(exchangeBtn)return;
           exchangeBtn=true;
        dataApi.integralExchange(id,0,vm.phone,userToken).done(
            function(data){
                exchangeBtn=false;
                if(data.code == 200){
                    if(data.data==0){//登录超时
                        app.linkTo('login', {page: 'exchangeTelBill', id: id});
                    }
                    else if(data.data==7){
                        app.linkTo("exchangeResult",{topImg:vm.imgs,result:1});
                    }
                    else{
                        dialog.tipDialog(data.msg);
                    }
                }
                else if(data.code==601){
                    app.linkTo('login', {page: 'exchangeTelBill', id: id});
                }
                else{
                    dialog.tipDialog(data.msg);
                }
            }
        )
    }

    avalon.scan();

});