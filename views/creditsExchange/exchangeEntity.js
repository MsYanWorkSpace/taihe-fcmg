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
        pointValue:app.getValue('pointValue','session'),
        consignee:"",
        phone:"",
        ads:"",
        addressId:"",
        exchangeBtn:exchangeInfo,
        createAds:function(){
            app.linkTo('address',{id:id});
        },
        updateAds:function(){
            app.linkTo('address',{addressId:vm.addressId,id:id});
        }
    });

    //查询实物详情
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

    //查询地址
    dataApi.addressAction(userToken,'query',"","","","").done(
        function(data){
            if(data.code==200){
                var data=data.data[0];
                vm.consignee=data.contacts;
                vm.phone=data.phone;
                vm.ads=data.address;
                vm.addressId=data.id;
            }
            else if(data.code==601){
                app.linkTo('login', {page: 'exchangeEntity', id: id});
            }
        }
    )

    //点击兑换
    function exchangeInfo(){
        if(exchangeBtn)return;
           exchangeBtn=true;
        dataApi.integralExchange(id,vm.addressId,"",userToken).done(
            function(data){
                exchangeBtn=false;
                if(data.code == 200){
                    if(data.data==0){ //登录超时
                        app.linkTo('login', {page: 'exchangeEntity', id: id});
                    }
                    else if(data.data==7){
                        app.linkTo("exchangeResult",{topImg:vm.imgs,result:2});
                    }
                    else{
                        dialog.tipDialog(data.msg);
                    }
                }
                else if(data.code==601){
                    app.linkTo('login', {page: 'exchangeEntity', id: id});
                }
                else{
                    dialog.tipDialog(data.msg);
                }
            }
        )
    }

    avalon.scan();

});