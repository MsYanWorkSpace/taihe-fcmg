/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","validate","weui"],function(avalon,app,dataApi,dialog,valid){

    var userId=app.getValue('userId','local'),sexValue;
    //登录判断
    var userToken=app.getValue('userToken','local');
    if(userToken == '' || userToken == null){
        app.linkTo('login',{page:'personalData'});
    }else{
        queryUserInfo();
    }


    $("#sex").select({
        title: "您的性别",
        multi: false,
        items: [
            {
                title: "男",
                value: 1
            },
            {
                title: "女",
                value: 2
            }
        ],
        onChange: function(d) {
            sexValue= d.values;
        }
    });
   // $("#datetime-picker").datetimePicker();

function queryUserInfo(){

    dataApi.queryUserInfoById(userId).done(
        function(data){
            if(data.code==200){
                var data=data.data[0];
                var vm=avalon.define({
                    $id:"vm",
                    username:data.name,
                    sex:data.sex == '1' ? '男' : '女',
                    brithday:data.birthday,
                    email:data.email,
                    sure:check
                });
                sexValue=data.sex;

                if(vm.brithday){
                       $('.bri').attr('disabled','disabled');
                }

                //表单验证
                var vali=new valid([
                    {name:"username",type:["required"],message:{required:"请输入用户名"}},
                    {name:"sex",type:["required"],message:{required:"请选择性别"}},
                    {name:"brithday",type:["required"],message:{required:"请选择出生日期"}},
                    {name:"email",type:["required"],message:{required:"请填写邮件地址"}}
                ],save);
                function check(){
                    vali.checkAll();
                }

                function save(){
                    var sexval= sexValue==undefined ? 2 : sexValue;
                    dataApi.updateUserInfo(userToken,vm.username,sexval,vm.brithday,vm.email).done(
                        function(data){
                            if(data.code==200){
                                app.linkTo('memberCenter');
                            }
                            else if(data.code == 601){
                                app.linkTo('login',{page:'personalData'});
                            }
                        }
                    )
                }

                avalon.scan();

            }else if(data.code == 601){
                app.linkTo('login',{page:'personalData'});
            }
        }
    )
}


});