/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog","weui","pictureCarousel"],function(avalon,app,dataApi,dialog){

    var appId=app.getValue('appId','session'),
        newsArray=[],
        isScan=false;

    var vm=avalon.define({
        $id:"vm",
        array:[],
        array2:[],
        navTitle:function(el){
            $('#consult-tab>a').removeClass('weui_bar_item_on');
            $(this).addClass('weui_bar_item_on');
            var classId=el.category.id;
            newlist(classId);
        },
        details:function(el){
          if(el.url){
              window.location.href=el.url;
          }else{
              app.linkTo("consultDetail",{id:el.id});
          }
       }
    });

    //咨询分类
    dataApi.queryNewsCategoryList(appId,'').done(
        function(data){
            if(data.code == 200){
              vm.array=data.data;
                newsArray.length=data.data.length;
               // $('#consult-tab>a:first-child').addClass('weui_bar_item_on');
                var classId=data.data[0].category.id;
                //初始化加载
                newlist(classId);
            }
            else{
                dialog.tipDialog(data.msg);
            }
        }
    )

    //咨询列表
    function newlist(classId){
        dataApi.newsList(appId,classId,1).done(
            function(data){
                if(data.code == 200){
                    vm.array2=data.data;
                }else{
                    dialog.tipDialog(data.msg);
                }

                if(!isScan){
                    isScan=true;
                    avalon.scan();
                    $('#consult-tab>a:first-child').addClass('weui_bar_item_on');
                    //调用轮播图片
                    new thApi.pictureCarousel(".banner-wrap",{
                        imgUrl:[[__uri("banner-1.png")],[__uri("banner-2.jpg")],[__uri("banner-3.jpg")],[__uri("banner-4.jpg")]]
                    });
                }

            }
        )
    }

})