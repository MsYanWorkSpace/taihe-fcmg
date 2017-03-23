/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","validate","pictureCarousel"],function(avalon,app,dataApi,dialog,valid){
    var appId=app.getValue('appId','session'),
        comId=app.getValue('comId','session'),
        barcode=app.getValue('barcode','session'),
        userToken=app.getValue('userToken','local'),
        verfiyCheck=false;

    var vm=avalon.define({
        $id:"vm",
        code:"",
        sure:check
    });

    //表单验证
    var vali=new valid([
        {name:"code",type:["required"],message:{required:"请输入验证码！"}}
    ],sures);
    function check(){
        $('.verfiy-tip').hide();
        vali.checkAll();
    }
    //提交验证码 验证
    function sures(){
        if(verfiyCheck)return;
        verfiyCheck=true;
         dataApi.check(barcode,vm.code,userToken,appId,comId).done(
             function(data){
                 verfiyCheck=false;
                 if(data.code==200){
                    app.storeValue('isCheck',1,'session');
                    app.linkTo('verifyResult',{resultCode:1,referer:app.getValue('referer'),nowtime:new Date().format()});
                 }else{
                    $('.verfiy-tip').show();
                 }
         })
    }
    avalon.scan();

    //调用轮播图片
    new thApi.pictureCarousel(".banner-wrap",{
        imgUrl:[[__uri("banner-2.jpg")]]
    });
})




