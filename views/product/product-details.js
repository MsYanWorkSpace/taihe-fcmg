/**
 * Created by pdc on 2016/5/11.
 */


require(["avalon","common","dataApi","dialog","pictureCarousel"],function(avalon,app,api,dialog){
    var id=app.getValue("id");

    var vm=avalon.define({
        $id:"vm",
        name:"",
        price:"",
        comment:"",
        array:[],
        detail:function(){

        }
    });

    avalon.scan();
    api.productDetail(id).done(success);
    function success(date){
        if(date.code==200){
            var imageAry=[];
            vm.comment=date.data.productInfo.comment;
            vm.name=date.data.productInfo.name;
            vm.price=date.data.productInfo.prizeSell;
            vm.array=date.data.vos;

            $.each(date.data.images,function(i,el){
                if(el.path){
                    imageAry.push([el.path])
                }
            })
            //调用轮播图片
            new thApi.pictureCarousel(".banner-wrap",{
                imgUrl:imageAry
            });
        }
    }

})