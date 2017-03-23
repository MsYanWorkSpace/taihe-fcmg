require(["avalon","common","dataApi","dialog","validate","weui"],function(avalon,app,dataApi,dialog,valid) {

    var proImg=app.getValue('topImg'),
        result=app.getValue('result');

    var vm=avalon.define({
        $id:"vm",
        proImg:proImg,
        result:result,
        exchangeBtn:function(){
            app.linkTo('exchangeCenter');
        },
        indexBtn:function(){
            app.linkTo('index');
        }
    });

    avalon.scan();

});