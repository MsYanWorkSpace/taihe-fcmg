require(["avalon","common","dataApi","dialog","validate"],function(avalon,app,dataApi,dialog,valid){

    var rechCheck=false;

    var rephone=app.getValue('phone','local');
    var vm=avalon.define({
        $id:"vm",
        rephone:rephone,
        submitBtn:check
    });

    //验证
    var vali=new valid(
        [
            {name:"rephone",type:["required","tel"],message:{required:"请输入充值号码"}}
        ],
        recharge);

    function check(){
        vali.checkAll();
    }

    function recharge(){
        if(rechCheck)return;
           rechCheck=true;
        //充值接口
        var winId=app.getValue('winId','local'),
            userToken=app.getValue('userToken','local');
        dataApi.recharge(winId,userToken,vm.rephone).done(
            function(data){
                rechCheck=false;
                if(data.code == 200){
                    app.linkTo('lotteryResult',{resultCode:101});
                }
                else if(data.code == 601){
                    app.linkTo('login',{page:'recharge'});
                }
                else{
                    dialog.tipDialog(data.msg);
                    setTimeout(function(){
                        app.linkTo('index');
                    },2000)
                }
            }
        )

    }
    avalon.scan();
});