require(["avalon","common","dataApi","dialog","weui"],function(avalon,app,dataApi,dialog){
      var comId=app.getValue('comId','session'),
          userToken=app.getValue('userToken','local'),
          entity={
              pageNum:1,
              array:[],
              isLastPage:false
          },
          virtual={
              pageNum:1,
              array:[],
              isLastPage:false
          };

      var vm=avalon.define({
             $id:'vm',
             array:[],
             type:1301,
             userToken:userToken,
             isLastPage:false,
             pointValue:0,
             phone:"",
             tab:function(num){
                 vm.type=num;
                 exchangeList();
             },
            loadMore:function(){
                  //点击加载更多
                  var obj=vm.type==1301?entity:virtual;
                  obj.pageNum++;
                  exchangeList(1);
            },
            login:function(){
              app.linkTo('login',{page:'exchangeCen'});
            },
            toExchangeRecord:function(){
                app.linkTo('exchangeRecord');
            },
            linkToExchange:function(el){
                //去兑换
                if(el.type == 1301){
                    //去实物兑换页
                    app.linkTo("proDetailEntity",{id:el.id});
                }
                else if(el.type== 130301){
                    //去话费兑换页
                    app.linkTo("exchangeTelBill",{id:el.id});
                }
            }
      });

    //初始化（查询实物礼品）
    exchangeList();

    function exchangeList(bool){

        var obj=vm.type==1301?entity:virtual;
        if(bool || obj.array.length == 0){

            dataApi.getActivityPrizeInfo(comId,"",vm.type,obj.pageNum,6).done(
                function(data){
                    if(data.code==200){
                        vm.array=[];
                        obj.array=obj.array.concat(data.data.list);
                        vm.array=obj.array.slice(0);
                        vm.isLastPage=obj.isLastPage=data.data.isLastPage;
                    }else{
                        dialog.tipDialog(data.msg);
                    }
                }
            )
        }else{
            vm.array=[];
            vm.array=obj.array.slice(0);
            vm.isLastPage=obj.isLastPage;
        }

    }


    //查询用户积分
    dataApi.getCurLoginUser(userToken).done(
        function(data){
            if(data.code == 200){
                var data=data.data;
                vm.pointValue=data.pointValue;
                vm.phone=data.phone;
                //存贮用户积分
                app.storeValue('pointValue',data.pointValue,'session');
            }
        }
    )

    avalon.scan();
});