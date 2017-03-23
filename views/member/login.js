/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","validate","timeouter"],function(avalon,app,dataApi,dialog,valid){

    var comId=app.getValue('comId','session'),
        id=app.getValue('id','session'),
        page=app.getValue('page'),
        codeCheck=false,
        loginCheck=false;

    var vm=avalon.define({
        $id:"vm",
        phone:app.getValue('phone','local'),
        code:"",
        loginBtn:check,
        sendCode:function(){
            if(codeCheck) return;
            codeCheck=true;
           vali.checkOne('phone');
            //60s倒计时
            var sendTimeouter = new Timeouter({
                time:60,
                dom: '#get-code',
                complate: function(){
                    // console.log('...Complate...', this);
                    codeCheck=false;
                }
            });
            //获取短信验证码
            dataApi.sendMessage(vm.phone,'kxp').done(
                function(data){
                    if(data.code == 200){
                        //保存手机号码
                        app.storeValue('phone',vm.phone,'local');
                        sendTimeouter.start();
                    }else{
                        dialog.tipDialog(data.msg);
                    }
                }
            )
        }
    });

    //表单验证
    var vali=new valid([
        {name:"phone",type:["required","tel"],message:{required:"请输入手机号码"}},
        {name:"code",type:["required"],message:{required:"请输入验证码"}}
    ],login);
    function check(){
        vali.checkAll();
    }

    //登录
    function login(){
        if(loginCheck) return;
        loginCheck=true;
        dataApi.smsLogin(vm.phone,vm.code,comId,id,'kxp').done(
            function(data){
                loginCheck=false;
                if(data.code == 200){
                    loginCheck=false;
                    //保存手机号码
                    app.storeValue('phone',vm.phone,'local');
                    app.storeValue('userToken',data.data.userToken,'local');
                    app.storeValue('userId',data.data.id,'local');  //用户id

                    //判断登录成功之后跳转到对应的页面
                    if(page== 'userpoint'){
                        app.linkTo('userPoint');
                    }
                    else if(page == 'personalData'){
                        app.linkTo('personalData');
                    }
                    else if(page == 'coupon'){
                        app.linkTo('coupon');
                    }
                    else if(page == 'exchangeRecord'){
                        app.linkTo('exchangeRecord');
                    }
                    else if(page == 'verifyRecord'){
                        app.linkTo('verifyRecord');
                    }
                    else if(page == 'lotteryResult'){  //从领奖页过来,登录成功后直接跳到领奖结果页，所以在此处需要再调用一次领奖接口
                        goAward();
                    }
                    else if(page== 'recharge'){
                        app.linkTo('recharge');
                    }
                    else if(page== 'exchangeCen'){
                        app.linkTo('exchangeCenter');
                    }
                    else if(page=='exchangeTelBill'){
                        app.linkTo('exchangeTelBill',{id:app.getValue('id')});
                    }
                    else if(page=='exchangeEntity'){
                        app.linkTo('exchangeEntity',{id:app.getValue('id')});
                    }
                    else if(page=='proDetailEntity'){
                        app.linkTo('proDetailEntity',{id:app.getValue('id')});
                    }
                    else if(page=='address'){
                        app.linkTo('address',{id:app.getValue('id')});
                    }
                    else{
                        app.linkTo('memberCenter');
                    }

                }else{
                    dialog.tipDialog(data.msg);
                }
            }
        )
    }

    function goAward(){
        //调用领奖接口
        var winId=app.getValue('winId','local'),
            userToken=app.getValue('userToken','local');
        dataApi.award(winId,userToken).done(
            function(data){
                if(data.code == 200){
                    app.linkTo('lotteryResult');
                }
                else if(data.code == 20123){  // 中话费  去充值页面
                    app.linkTo('recharge');
                }
                else if(data.code == 601){
                    app.linkTo('login',{page:'lotteryResult'});
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
})