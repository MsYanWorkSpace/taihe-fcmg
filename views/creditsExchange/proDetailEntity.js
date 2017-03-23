require(["avalon","common","dataApi","dialog","validate","weui"],function(avalon,app,dataApi,dialog,valid) {
    var comId = app.getValue('comId', 'session'),
        id=app.getValue('id'),
        userToken = app.getValue('userToken', 'local');

    var vm=avalon.define({
        $id:"vm",
        names:"",
        imgs:"",
        needPoint:0,
        pointValue:0,
        comment:"",
        userToken:userToken,
        exchangeBtn:check
    });

    //查询实物详情
    dataApi.prizeInfoDetail(id,comId).done(
        function(data){
            if(data.code==200){
                var data=data.data.list[0];
                vm.imgs=data.logoUrl;
                vm.names=data.name;
                vm.needPoint=data.pointValue;
                vm.comment=data.comment;
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
        }
    )

    function check(){
        if(userToken=='' || userToken==null) {
            app.linkTo('login', {page: 'proDetailEntity', id: id});
            return;
        }
        if(vm.pointValue < vm.needPoint){
            dialog.tipDialog('抱歉！积分不足！');
            return;
        }
        app.linkTo('exchangeEntity', {id: id});
    }

    avalon.scan();

});