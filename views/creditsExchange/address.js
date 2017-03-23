require(["avalon","common","dataApi","dialog","validate","weui"],function(avalon,app,dataApi,dialog,valid) {

    var addressId=app.getValue('addressIs'),
        id=app.getValue('id'),
        userToken = app.getValue('userToken', 'local'),
        sureBtn=false;

    var vm=avalon.define({
        $id:"vm",
        name:"",
        phone:"",
        ads:"",
        sure:check
    });

    //通过id查询地址信息
    dataApi.addressAction(userToken,'query',addressId,"","","").done(
        function(data){
            if(data.code==200){
                var data=data.data[0];
                vm.name=data.contacts;
                vm.phone=data.phone;
                vm.ads=data.address;
            }
            else if(data.code == 601){
                app.linkTo('login', {page: 'address', id: id});
            }
        }
    )

    avalon.scan();

    //表单验证
    var vali=new valid([
        {name:"name",type:["required"],message:{required:"请输入联系人姓名"}},
        {name:"phone",type:["required","tel"],message:{required:"请输入手机号码"}},
        {name:"ads",type:["required"],message:{required:"请输入联系人地址"}}
    ],adsDeal);

    function check(){
        vali.checkAll();
    }

    function adsDeal(){
        if(sureBtn) return;
        sureBtn=true;
        if(!addressId){  //没有地址，添加
            dataApi.addressAction(userToken,'create',"",vm.name,vm.phone,vm.ads).done(
                function(data){
                    sureBtn=false;
                    if(data.code==200){
                        app.linkTo("exchangeEntity",{id:id})
                    }
                    else if(data.code == 601){
                        app.linkTo('login', {page: 'address', id: id});
                    }
                    else{
                        dialog.tipDialog(data.msg);
                    }
                }
            )
        }
        else{  //有地址，修改
            dataApi.addressAction(userToken,'update',addressId,vm.name,vm.phone,vm.ads).done(
                function(data){
                    sureBtn=false;
                    if(data.code==200){
                        app.linkTo("exchangeEntity",{id:id})
                    }
                    else if(data.code == 601){
                        app.linkTo('login', {page: 'address', id: id});
                    }
                    else{
                        dialog.tipDialog(data.msg);
                    }
                }
            )
        }
    }

});