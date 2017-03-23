require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){

    var resultCode=app.getValue('resultCode'); //101表示电话充值

      var vm=avalon.define({
           $id:'vm',
          resultCode:resultCode,
          linkToIndex:function(){
              app.linkTo('index');
          }
      });
    avalon.scan();
});