/**
 * Created by pdc on 2016/4/14.
 */
require(["avalon","common","dataApi","dialog"],function(avalon,app,dataApi,dialog){

    //从url地址取到二维码
    var barcode=app.getValue('barcode');
    var userToken=app.getValue('userToken','local');


    var imgAry=[
        __uri("loading-logo.png"),
        __uri("loading-bottom.png")
    ];
    var frag=document.createDocumentFragment();
    for(var j=0;j<=100;j++){
        var span=document.createElement("span");
        span.textContent=j+"%";
        frag.appendChild(span);
    }
    $(".loIcon").append(frag);

    function loadImage(array,suc,fai){
        var l,len,
            i=0,
            j=0;
        l=len=array.length;
        while(l){
            var image=new Image();
            image.src=array[l-1];
            image.onload=(function(l){
                return function(){
                    i+=1;
                    j+=1;
                    suc&&suc.call(this,j,len,array[l],i)    //j:表示已加载图片总数 len：要加载图片总数 l:当前加载图片的路径  i:加载失败的图片数量
                }
            })(l)
            image.onerror=(function(l){
                return function(){
                    j+=1;
                    console.log("资源 "+array[l]+" 未能加载成功，请检查网络或者是否加载正确地址" )
                    fai&&fai.call(this,j,len,array[l],i)
                }
            })(l)
            l--
        }
    }
    function succuss(j,l){
        var plan=Math.ceil(j*100/l);
        $('.car').css("margin-left",plan+'%');
        $(".loIcon").css("width",plan*50);
        if (j == imgAry.length) {
            setTimeout(scan,1000);
        }
    }
    function fails(){
        scan();
    }
    loadImage(imgAry,succuss,fails);


    var vm=avalon.define({
        $id:"vm"
    });

    //扫码接口
   function scan(){
       dataApi.queryOrderInfo(barcode,userToken).done(
           function(data){
               if(data.code==200){
                   var data=data.data;
                   //存贮到本地
                   app.storeValue('id',data.id,'session');
                   app.storeValue('appId',data.appId,'session');
                   app.storeValue('comId',data.comId,'session');
                   app.storeValue('isCheck',data.isCheck,'session');
                   app.storeValue('product_id',data.product_id,'session');
                   app.storeValue('activityId',data.activityId,'session');
                   app.storeValue('barcode',barcode,'session');

                   //进首页
                   app.linkTo('index');

               }else{
                   dialog.tipDialog(data.msg);
               }
           }
       );
   }

    avalon.scan();

})




