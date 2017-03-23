/**
 * Created by pdc on 2016/4/24.
 */
/*var member=require("member"),
    app=require("common");*/

    var date = {
        //扫码
        queryOrderInfo: {
            url: "cloud2.barcode.api/order/info/queryOrderInfo",
            param: "barcode,userToken" //(二维码,token)
        },
        //验证
        check: {
            url: "cloud2.barcode.api/barcode/orderCheck/check",
            param: "barcode,pwd,userToken,appId,comId" //(二维码,验证码,token,应用id,企业id)
        },
        //获取二维扫描次数
        queryCodeScanTime: {
            url: "cloud2.barcode.api/barcode/orderScan/queryCodeScanTime",
            param: "barcode" //(二维码)
        },
        //检查活动状态
        checkActivity: {
            url: "cloud2.activity.api/market/drwaLottery/checkActivity",
            param: "barcode" //(二维码,token)
        },
        //抽奖
        doDrwaLottery: {
            url: "cloud2.activity.api/market/drwaLottery/doDrwaLottery",
            param: "barcode,comId,relationId" //(二维码,企业id,物资upid)
        },
        //领奖
        award: {
            url: "cloud2.activity.api/market/win/award",
            param: "id,userToken" //(中奖记录id,token)
        },
        //话费充值
        recharge: {
            url: "cloud2.activity.api/market/win/award",
            param: "id,userToken,phone" //(中奖记录id,token)
        },
        //登录
        smsLogin: {
            url: "cloud2.member.api/member/userInfo/smsLogin",
            param: "phone,smsCode,comId,id,channel" //(手机号,短信验证码,企业id,扫码id)
        },
        //获取短信验证码
        sendMessage: {
            url: "cloud2.public.service/sms/sendMessage",
            param: "mobile,channel" //(手机号)
        },
        //领奖记录
        awardList: {
            url: "cloud2.member.api/member/userGain/list",
            param: "userToken" //(token)
        },
        //使用话费
        useCalls: {
            url: "cloud2.member.api/member/userGain/useCalls",
            param: "winId,comId,userToken" //(中奖记录id,企业id,token)
        },
        //获取用户信息
        getCurLoginUser: {
            url: "cloud2.member.api/member/userInfo/getCurLoginUser",
            param: "userToken" //(token)
        },
        //退出登录
        logout: {
            url: "cloud2.member.api/member/userInfo/logout",
            param: "userToken" //(token)
        },
        //新建地址
        addressAction: {
            url: "cloud2.member.api/address/addressAction",
            param: "id,contacts,phone,province,city,area,address,postcode,type,userToken"
             //(地址ID,联系人,手机号码,省份,市,区,详细地址,邮编,操作类型  create 创建   update  修改  query 查询,token)
        },
        //查订单默认地址（用户有地址，默认填充）
        queryUserAddress: {
            url: "cloud2.member.api/address/queryUserAddress",
            param: "userToken" //(token)
        },
        //保存配送地址
        saveAddress: {
            url: "cloud2.member.api/member/userGain/saveAddress",
            param: "contacts,phone,province,city,area,address,postcode,winId"
            //(联系人,手机号码,省份,市,区,详细地址,邮编,中奖纪录id)
        },
        //产品分类
        queryProductCategoryList: {
            url: "cloud2.activity.api/app/menu/queryProductCategoryList",
            param: "appId,pageNum,pageSize" //(应用id)
        },
        //产品列表
        productList: {
            url: "cloud2.activity.api/app/menu/queryFrontEndProductList",
            param: "appId,classId,pageNum,pageSize" //(应用id,分类id,是否查询属性集==1查询，其它不查询)
        },
        //产品详情
        productDetail: {
            url: "cloud2.product.api/product/product/showProduct",
            param: "productId" //(应用id,分类id,是否查询属性集==1查询，其它不查询)
        },
        //资讯分类
        queryNewsCategoryList: {
            url: "cloud2.activity.api/app/menu/queryNewsCategoryList",
            param: "appId,pId" //(应用id,父级id)
        },
        //资讯列表   |  官方商城
        newsList: {
            url: "cloud2.activity.api/app/menu/queryFrontEndNewsList",
            param: "appId,classId,news" //(应用id,分类id)
        },
        //咨询详情
        queryNews: {
            url: "cloud2.product.api/news/queryNews",
            param: "id"
        },
        //积分记录
        pointList: {
            url: "cloud2.member.api/member/userInfo/queryAddPointList",
            param: "userToken,pageNum,pageSize"
        },
        //获取个人资料
        queryUserInfoById: {
            url: "cloud2.member.api/member/userInfo/queryUserInfoById",
            param: "userId"
        },
        //修改会员资料
        updateUserInfo: {
            url: "cloud2.member.api/member/userInfo/updateUserInfo",
            param: "userToken,name,sex,birthday,email"
        },
        //我的优惠券
        userGain: {
            url: "cloud2.member.api/member/userGain/list",
            param: "userToken,type,useStatus,pageNum,pageSize"
        },
        //积分兑换纪录
        queryUsePointList: {
            url: "cloud2.member.api/pointExchange/pointExchanges",
            param: "userToken,pageNum,pageSize"
        },
        //查询验证记录
        queryByPhone: {
            url: "cloud2.barcode.api/barcode/orderCheck/queryByPhone",
            param: "userToken,pageNum,pageSize"
        },
        //已兑换积分总数
        queryTotalUsePoint: {
            url: "cloud2.member.api/pointExchange/queryAlreadyExchangePoint",
            param: "userToken"
        },
        //获得扫码次数
        queryUserScanCodeNum: {
            url: "cloud2.barcode.api/barcode/orderScan/queryUserScanCodeNum",
            param: "userToken"
        },
        //中奖记录
        queryMemberMarketLotterList: {
            url: "cloud2.activity.api/market/lottery/queryMemberMarketLotterList",
            param: "userToken,pageNum,pageSize"
        },
        //是否已抽奖
        discern: {
            url: "cloud2.activity.api/market/drwaLottery/checkLotteryRecordByBarcode",
            param: "barcode"
        },
        //奖项列表
        queryAwardsList: {
            url: "cloud2.activity.api/market/awards/queryAwardsList",
            param: "activityId,pageNum,pageSize"
        },
        //关于我们
        findAboutMe: {
            url: "cloud2.product.api/news/findAboutMe"
        },
        // 可兑换列表
        getActivityPrizeInfo: {
            url: "cloud2.activity.api/activity/prize/getActivityPrizeInfo",
            param:"comId,otherType,type,pageNum,pageSize"
        },
        // 兑换详情
        prizeInfoDetail: {
            url: "cloud2.activity.api/activity/prize/getActivityPrizeInfo",
            param:"id,comId"
        },
        //积分兑换
        integralExchange: {
            url: "cloud2.member.api/member/userInfo/integralExchange.do",
            param:"id,addressId,phone,token"
        },
        //地址接口
        addressAction: {
            url: "cloud2.member.api/address/addressAction",
            param:"userToken,type,id,contacts,phone,address"
        },
        //活动规则
        queryActivityInfo:{
            url: "cloud2.activity.api/market/activity/queryActivityInfo.do",
            param:"id"
        }
      };
    var  app=require("common");
    return app.moduleFactory(date);
