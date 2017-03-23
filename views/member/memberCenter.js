/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog"],function(avalon,app,dataApi,dialog){

    function AutoScroll(obj){
        $(obj).find("#ad-marquree:first").animate({
            marginTop:"-30px"
        },600,function(){
            $(this).css({marginTop:"0px"}).find(".li:first").appendTo(this);
        });
    }

    setInterval(function(){
        AutoScroll($('#scrollDiv'));
        var liWidth= $('#scrollDiv').width();
        $('#scrollDiv p').css({'width':liWidth,' white-space':'nowrap','text-overflow':'ellipsis','overflow':'hidden'});
    },2300);

    //登录判断
    var userToken=app.getValue('userToken','local');
    if(userToken == '' || userToken == null){
        app.linkTo('login');
    }else{
        getUserMsg();
    }

    var vm=avalon.define({
        $id:"vm",
        phone:"",
        linkToIndex:function(){ app.linkTo('index');},
        userPoint:function(){ app.linkTo('userPoint');  },
        coupon:function(){app.linkTo('coupon');},
        prizeRecord:function(){app.linkTo('prizeRecord');},
        exchangeRecord:function(){app.linkTo('exchangeRecord');},
        verifyRecord:function(){app.linkTo('verifyRecord');},
        personalData:function(){app.linkTo('personalData');},
        loginOutBtn:function(){
            app.deleteValue('userToken','local');
            app.linkTo('login');
        }
    });

    //获取用户信息接口
    function getUserMsg(){
        dataApi.getCurLoginUser(userToken).done(
            function(data){
                if(data.code == 200){
                    var data=data.data;
                    vm.phone=data.phone;
                    //存贮用户积分
                    app.storeValue('pointValue',data.pointValue,'session');
                    app.storeValue('totalValue',data.totalPoint,'session');
                }
                else if(data.code == 601){
                    dialog.tipDialog("登录已过期，请重新登录！");
                    setTimeout(function(){
                        app.linkTo('login');
                    },2000);

                }
            }
        )
    }
    avalon.scan();
})