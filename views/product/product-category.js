/**
 * Created by pdc on 2016/5/11.
 */
require(["avalon","common","dataApi","dialog","pictureCarousel"],function(avalon,app,api,dialog){
    var appId=app.getValue("appId","session"),
        comId=app.getValue("comId","session"),
        pageNum= 1,
        pageSize=10,
        isScan=false;
    var vm=avalon.define({
        $id:"vm",
        array:[],
        isLastPage:true,
        loadMore:function(){
            pageNum++;
            inquire()
        },
        detail:function(el){
            if(el.url){
                window.location.href=el.url;
            }else{
                var obj={
                    classId:el.category.id,
                    name:el.category.name
                };
                app.linkTo("productList",obj)
            }
        }
    });


    function inquire(){
        api.queryProductCategoryList(appId,pageNum,pageSize).done(success)
    }
    function success(date){
        if(date.code==200){
            vm.array=vm.array.concat(date.data.vos);
            vm.isLastPage=date.data.totalCount<=pageNum*pageSize;
        }else{
            date.msg&&dialog.tipDialog(date.msg)
        }

        if(!isScan){
            isScan=true;
            avalon.scan();
            //调用轮播图片
            new thApi.pictureCarousel(".banner-wrap",{
                imgUrl:[[__uri("banner-1.jpg")],[__uri("banner-2.jpg")],[__uri("banner-3.jpg")]]
            });
        }

    }
    inquire();





})