"use strict";
var MNO;
(function (MNO) {
    MNO[MNO["\u4E2D\u56FD\u7535\u4FE1"] = 0] = "\u4E2D\u56FD\u7535\u4FE1";
    MNO[MNO["\u4E2D\u56FD\u79FB\u52A8"] = 1] = "\u4E2D\u56FD\u79FB\u52A8";
    MNO[MNO["\u4E2D\u56FD\u8054\u901A"] = 2] = "\u4E2D\u56FD\u8054\u901A";
    MNO[MNO["\u8717\u725B\u79FB\u52A8"] = 3] = "\u8717\u725B\u79FB\u52A8";
    MNO[MNO["\u5C0F\u7C73\u79FB\u52A8"] = 4] = "\u5C0F\u7C73\u79FB\u52A8";
    MNO[MNO["\u963F\u91CC\u79FB\u52A8"] = 5] = "\u963F\u91CC\u79FB\u52A8";
})(MNO || (MNO = {}));
var PhonePlan = (function () {
    function PhonePlan(name, company, signal) {
        this.AddonDescription = "";
        this.IsVirtualMNO = false;
        this.onSell = true;
        this.URL = "";
        this.MustSpend = 0;
        this.MonthTake = 0;
        this.FreeTalk = 0;
        this.FreeText = 0;
        this.TalkPrice = 0;
        this.TextPrice = 0;
        this.FreeData = 0;
        this.DataPrice = 0;
        this.DataPkgPrice = 0;
        this.DataPkgDays = 0;
        this.DataPkgSize = 0;
        this.FamilyNumber = 0;
        this.DataLimit = 0;
        this.ViceCard = 0;
        this.FreeDataApps = "";
        this.LastCalcValue = 0;
        this.Name = name;
        this.MNO = company;
        this.Signal = signal;
        this.IsVirtualMNO = signal != company;
    }
    return PhonePlan;
}());
function CalcMonthBill(plan, talk, text, data, usedatadays) {
    usedatadays = Math.min(usedatadays, 30);
    var p = plan.MonthTake;
    if (talk > plan.FreeTalk) {
        p += (talk - plan.FreeTalk) * plan.TalkPrice;
    }
    if (text > plan.FreeText) {
        p += (text - plan.FreeText) * plan.TextPrice;
    }
    if (usedatadays > 0 && data > 0) {
        var limit = plan.DataLimit;
        if (limit > 0 && data > limit) {
            data = limit;
        }
        if (data > plan.FreeData) {
            if (plan.DataPkgSize > 0 && plan.DataPkgDays > 0 && plan.DataPkgPrice > 0) {
                var EachDayData = data / usedatadays;
                var day = void 0;
                var remainData = plan.FreeData;
                var remainDays = 30;
                for (day = 1; day <= usedatadays; day++) {
                    if (remainDays < 1 || remainData < 1) {
                        remainDays = 0;
                        remainData = 0;
                    }
                    if (remainData < EachDayData) {
                        while (remainData < EachDayData) {
                            p += plan.DataPkgPrice;
                            remainData += plan.DataPkgSize;
                        }
                        remainDays += plan.DataPkgDays;
                    }
                    remainData -= EachDayData;
                    remainDays -= 1;
                }
            }
            else {
                p += plan.DataPrice * data * 1000;
            }
        }
    }
    return Math.max(plan.MustSpend, p, 0);
}
var AllPhonePlans = [];
function BuildNewPlan(Name, AddonDescription, MNO, Signal, onSell, URL, MustSpend, MonthTake, FreeTalk, FreeText, TalkPrice, TextPrice, FreeData, DataPrice, DataPkgPrice, DataPkgDays, DataPkgSize, FamilyNumber, ViceCard, DataLimit, FreeDataApps) {
    var p = new PhonePlan(Name, MNO, Signal);
    p.AddonDescription = AddonDescription;
    p.onSell = onSell;
    p.URL = URL;
    p.MustSpend = MustSpend;
    p.MonthTake = MonthTake;
    p.FreeTalk = FreeTalk;
    p.FreeText = FreeText;
    p.TalkPrice = TalkPrice;
    p.TextPrice = TextPrice;
    p.FreeData = FreeData;
    p.DataPrice = DataPrice;
    p.DataPkgPrice = DataPkgPrice;
    p.DataPkgDays = DataPkgDays;
    p.DataPkgSize = DataPkgSize;
    p.FamilyNumber = FamilyNumber;
    p.ViceCard = ViceCard;
    p.DataLimit = DataLimit;
    p.FreeDataApps = FreeDataApps;
    AllPhonePlans.push(p);
}
BuildNewPlan("移动王卡", "连续12个月，每月领取1G流量或100分钟语音", MNO.中国移动, MNO.中国移动, true, "http://service.bj.10086.cn/m/num/num/commonNum/showFontPage.action?busiCode=YDWKQX", 0, 18, 0, 0, 0.19, 0.1, 0, 0, 1, 1, 1, 0, 0, 0, "百度系、阿里系、快手等");
BuildNewPlan("米粉王卡Plus", "", MNO.中国电信, MNO.中国电信, true, "http://service.micard.10046.mi.com/ctmiphone/cardSelling?channel_code=1006", 0, 19, 0, 0, 0.1, 0.1, 3, 0, 5, 30, 1, 0, 0, 0, "百度系、网易系、阿里系、头条系");
BuildNewPlan("抖音星卡69元", "", MNO.中国电信, MNO.中国电信, true, "http://www.189.cn/products/90361266094.html", 0, 39, 200, 0, 0.1, 0.1, 10, 0, 5, 30, 1, 0, 0, 0, "抖音、头条系APP");
BuildNewPlan("抖音星卡39元", "", MNO.中国电信, MNO.中国电信, true, "http://www.189.cn/products/90361266113.html", 0, 39, 100, 0, 0.1, 0.1, 5, 0, 5, 30, 1, 0, 0, 0, "抖音、头条系APP");
BuildNewPlan("抖音星卡19元", "", MNO.中国电信, MNO.中国电信, true, "http://www.189.cn/products/90361266111.html", 0, 19, 0, 0, 0.1, 0.1, 3, 0, 5, 30, 1, 0, 0, 0, "抖音、头条系APP");
BuildNewPlan("至青卡", "随机归属地", MNO.中国移动, MNO.中国移动, true, "https://card.wifibanlv.com/unify/index?promotion_product_id=182&channel=zhushou&activity=LJWYYC09910&seller_id=1544216&card=zhiqing&group_id=186&product_id=317&product_name=%E8%87%B3%E9%9D%92%E5%8D%A1", 0, 48, 1000, 0, 0.15, 0.1, 20, 0, 5, 30, 1, 0, 0, 0, "");
BuildNewPlan("天王星卡", "合约期12个月", MNO.中国移动, MNO.中国移动, true, "https://card.wifibanlv.com/unify/index?promotion_product_id=244&channel=zhushou&activity=LJWYYC09910&seller_id=1544216&card=kingstar&group_id=196&product_id=359&product_name=%E5%A4%A9%E7%8E%8B%E6%98%9F%E5%8D%A1", 0, 19, 100, 0, 0.19, 0.1, 11, 0, 1, 1, 1, 0, 0, 40, "头条系、阿里系、百度系等");
BuildNewPlan("水星卡", "激活24小时内必须充值50元，合约期12个月", MNO.中国移动, MNO.中国移动, true, "https://card.wifibanlv.com/unify/index?promotion_product_id=242&channel=zhushou&activity=LJWYYC09910&seller_id=1544216&card=shui&group_id=205&product_id=370&product_name=%E6%B0%B4%E6%98%9F%E5%8D%A19%E5%85%83", 0, 14, 100, 0, 0.19, 0.1, 6, 0, 1, 1, 1, 0, 0, 40, "头条系、阿里系、百度系等");
BuildNewPlan("木星卡", "激活24小时内必须充值50元，合约期12个月", MNO.中国移动, MNO.中国移动, true, "https://card.wifibanlv.com/unify/index?promotion_product_id=243&channel=zhushou&activity=LJWYYC09910&seller_id=1544216&card=mu&group_id=204&product_id=369&product_name=%E6%9C%A8%E6%98%9F%E5%8D%A124%E5%85%83", 0, 29, 80, 0, 0.19, 0.1, 15, 0, 1, 1, 1, 0, 0, 40, "头条系、阿里系、百度系等");
BuildNewPlan("金神卡", "流量是先扣费，次月退还，每月25日之后的流量不在套餐内", MNO.中国电信, MNO.中国电信, false, "https://card.wifibanlv.com/unify/index?promotion_product_id=231&channel=zhushou&activity=HZKD09910&seller_id=1544216&card=jin&group_id=200&product_id=362&product_name=%E9%87%91%E7%A5%9E%E5%8D%A119", 0, 19, 100, 0, 0.1, 0.1, 20, 0, 1, 1, 0.8, 0, 0, 0, "优酷、爱奇艺、UC浏览器等");
BuildNewPlan("火神卡", "流量是先扣费，次月退还", MNO.中国电信, MNO.中国电信, false, "https://card.wifibanlv.com/unify/index?promotion_product_id=230&channel=zhushou&activity=HZKD09910&seller_id=1544216&card=huo&group_id=199&product_id=361&product_name=%E7%81%AB%E7%A5%9E%E5%8D%A129", 0, 29, 100, 0, 0.1, 0.1, 40, 0, 1, 1, 0.8, 0, 0, 0, "优酷、爱奇艺、UC浏览器等");
BuildNewPlan("雷神卡", "流量是先扣费，次月退还", MNO.中国电信, MNO.中国电信, false, "https://card.wifibanlv.com/unify/index?promotion_product_id=229&channel=zhushou&activity=HZKD09910&seller_id=1544216&card=lei&group_id=198&product_id=360&product_name=%E9%9B%B7%E7%A5%9E%E5%8D%A139", 0, 39, 100, 0, 0.1, 0.1, 70, 0, 1, 1, 0.8, 0, 0, 0, "优酷、爱奇艺、UC浏览器等");
BuildNewPlan("芒果卡", "广东移动推出，全国可买，赠送芒果TV会员，电话1元30分钟（一天一次，一打电话先扣1元），用完就按0.19元每分钟", MNO.中国移动, MNO.中国移动, true, "https://detail.tmall.com/item.htm?id=608951990724", 0, 19, 0, 0, 0.19, 0.1, 1, 0, 1, 1, 1, 0, 0, 0, "芒果TV");
BuildNewPlan("百度花卡", "爱奇艺VIP一个月", MNO.中国移动, MNO.中国移动, true, "https://eopa.baidu.com/page/cmnetFlowerCard-y6NSJzJW?channelId=C10000015522&channelSeqId=26", 0, 19, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 1, 3, 0, 0, "百度系APP，其他热门APP自选两款");
BuildNewPlan("百度云圣卡", "在用卡即为百度网盘超级会员", MNO.中国联通, MNO.中国联通, true, "https://eopa.baidu.com/page/cloudCard-cALcnBUQ?channel=26", 0, 30, 0, 0, 0.1, 0.1, 2, 0, 5, 30, 1, 0, 0, 0, "百度系");
BuildNewPlan("网易白金卡", "在用卡就能获得每个月的网易云音乐黑胶VIP，最多领取两年", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=567639175467", 0, 19, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "网易系、百度系");
BuildNewPlan("百度超圣卡", "", MNO.中国电信, MNO.中国电信, false, "https://detail.tmall.com/item.htm?id=563587133985", 0, 49, 200, 0, 0.1, 0.1, 4, 0, 1, 1, 0.8, 0, 0, 0, "百度系、网易系");
BuildNewPlan("百度大圣卡", "", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=563587133985", 0, 19, 100, 0, 0.1, 0.1, 1, 0, 1, 1, 0.8, 0, 0, 0, "百度系、网易系");
BuildNewPlan("步步高卡 39元", "", MNO.中国电信, MNO.中国电信, false, "https://detail.tmall.com/item.htm?id=607034214759", 0, 39, 100, 0, 0.15, 0.1, 5, 0.03, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("步步高卡 19元", "", MNO.中国电信, MNO.中国电信, false, "https://detail.tmall.com/item.htm?id=607034214759", 0, 19, 100, 0, 0.15, 0.1, 2, 0.03, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("小抖卡", "", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=581667953017", 0, 19, 0, 0, 0.1, 0.1, 1, 0, 1, 1, 0.8, 0, 0, 0, "今日头条、抖音、爱奇艺");
BuildNewPlan("无忧卡", "套餐资费有效期两年", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=606808925254", 0, 5, 0, 0, 0.15, 0.1, 0.2, 0.02, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("电信尊王卡", "", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=573138850654", 0, 59, 300, 0, 0.1, 0.1, 3, 0, 1, 1, 0.8, 0, 0, 0, "百度系、爱奇艺、优酷、高德等");
BuildNewPlan("电信天王卡", "", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=573138850654", 0, 39, 200, 0, 0.1, 0.1, 1, 0, 1, 1, 0.8, 0, 0, 0, "百度系、爱奇艺、优酷、高德等");
BuildNewPlan("电信大王卡", "", MNO.中国电信, MNO.中国电信, true, "https://detail.tmall.com/item.htm?id=573138850654", 0, 19, 100, 0, 0.1, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "百度系、爱奇艺、优酷、高德等");
BuildNewPlan("米粉卡 1元", "", MNO.中国电信, MNO.中国电信, false, "http://www.mi.com/micard", 0, 5, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 1, 0, 0, 0, "");
BuildNewPlan("米粉卡 3元", "", MNO.中国电信, MNO.中国电信, false, "http://www.mi.com/micard", 0, 5, 0, 0, 0.1, 0.1, 0, 0, 3, 1, 999, 0, 0, 20, "");
BuildNewPlan("真实卡", "", MNO.中国电信, MNO.中国电信, true, "https://www.bilibili.com/blackboard/activity-new-freedata.html?", 0, 19, 100, 0, 0.1, 0.1, 2, 0, 1, 1, 0.8, 0, 0, 0, "B站APP");
BuildNewPlan("电信大鱼卡", "", MNO.中国电信, MNO.中国电信, true, "https://card.wi-fi.cn/promotion/product-land?promotion_product_id=64&channel=yizhan&activity=QGDXYC2010&seller_id=1723465&card=fish&group_id=75", 0, 19, 100, 0, 0.1, 0.1, 1, 0, 1, 1, 1, 0, 0, 0, "阿里系APP，优酷等");
BuildNewPlan("腾讯视频卡", "只送一个月的腾讯视频VIP", MNO.中国电信, MNO.中国电信, true, "https://card.wi-fi.cn/promotion/product-land?promotion_product_id=148&channel=yizhan&activity=QGDXYC2010&seller_id=1723465&card=txshipin&group_id=129", 0, 19, 0, 0, 0.1, 0.1, 0, 0, 3, 30, 1, 0, 0, 0, "");
BuildNewPlan("真爱卡", "12个月B站大会员等", MNO.中国电信, MNO.中国电信, true, "https://www.bilibili.com/blackboard/activity-new-freedata.html?", 0, 39, 100, 0, 0.1, 0.1, 5, 0, 1, 1, 1, 0, 0, 0, "B站APP");
BuildNewPlan("移动花卡宝藏版", "某热门APP会员一个月等", MNO.中国移动, MNO.中国移动, true, "https://rwk.cmicrwx.cn/rwx/rwkvue/young/#/?channelId=C10000014344", 0, 19, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 1, 3, 0, 0, "自选三款APP+移动旗下APP");
BuildNewPlan("移动花卡宝藏版 B站版", "3个月B站大会员等", MNO.中国移动, MNO.中国移动, true, "https://rwk.cmicrwx.cn/rwx/rwkvue/young/#/?channelId=C10000022501", 0, 19, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 1, 3, 0, 0, "B站+自选两款APP+移动旗下APP");
BuildNewPlan("乐享卡大乐卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=19&channel=invite&activity=LT2I20&seller_id=504186&card=lexiang&group_id=44", 0, 39, 500, 0, 0.1, 0.1, 1, 0, 1, 1, 1, 0, 0, 0, "");
BuildNewPlan("工行e卡 大e卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=23&channel=invite&activity=LT2I20&seller_id=504186&card=icbc&group_id=5", 0, 89, 600, 0, 0.1, 0.1, 6, 0, 10, 30, 1, 5, 0, 0, "字节系APP、工行系APP");
BuildNewPlan("工行e卡 梦想e卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=23&channel=invite&activity=LT2I20&seller_id=504186&card=icbc&group_id=5", 0, 19, 100, 0, 0.1, 0.1, 2, 0, 10, 30, 1, 5, 0, 0, "字节系APP、工行系APP");
BuildNewPlan("滴滴王卡 Mini卡", "专为滴滴司机推出，免费打给客户等", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=160&channel=invite&activity=ZZTX5020&seller_id=504186&card=didi&group_id=145", 0, 98, 1000, 0, 0.1, 0.1, 20, 0, 10, 30, 1, 3, 0, 0, "腾讯视频、滴滴录音");
BuildNewPlan("滴滴王卡 小王卡", "专为滴滴司机推出，免费打给客户等", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=160&channel=invite&activity=ZZTX5020&seller_id=504186&card=didi&group_id=145", 0, 58, 600, 0, 0.1, 0.1, 10, 0, 10, 30, 1, 3, 0, 0, "腾讯视频、滴滴录音");
BuildNewPlan("滴滴王卡 Mini卡", "专为滴滴司机推出，免费打给客户等", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=160&channel=invite&activity=ZZTX5020&seller_id=504186&card=didi&group_id=145", 0, 28, 150, 0, 0.1, 0.1, 2, 0, 10, 30, 1, 3, 0, 0, "腾讯视频、滴滴录音");
BuildNewPlan("懂我卡畅享版", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=161&channel=invite&activity=ZZTX5020&seller_id=504186&card=dong&group_id=146", 0, 19, 0, 0, 0.1, 0.1, 3, 0, 1, 1, 1, 0, 0, 0, "字节系APP");
BuildNewPlan("星芒卡 39元", "附赠芒果TV会员", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=159&channel=invite&activity=ZZTX5020&seller_id=504186&card=xingmang&group_id=147", 0, 39, 100, 0, 0.1, 0.1, 6, 0, 5, 30, 1, 5, 0, 0, "芒果TV、微博、淘宝等");
BuildNewPlan("星芒卡 19元", "附赠芒果TV会员", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=159&channel=invite&activity=ZZTX5020&seller_id=504186&card=xingmang&group_id=147", 0, 19, 0, 0, 0.1, 0.1, 1, 0, 1, 1, 0.8, 5, 0, 0, "芒果TV、微博、淘宝等");
BuildNewPlan("福享卡 19元", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=13&channel=invite&activity=LT2I20&seller_id=504186&card=ltfx&group_id=24", 0, 19, 150, 0, 0.1, 0.1, 2, 0, 10, 30, 1, 0, 0, 0, "");
BuildNewPlan("福享卡 39元", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=13&channel=invite&activity=LT2I20&seller_id=504186&card=ltfx&group_id=24", 0, 39, 200, 0, 0.1, 0.1, 5, 0, 10, 30, 1, 0, 0, 0, "");
BuildNewPlan("联通V粉卡 19元", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=120&channel=invite&activity=LT2I5020&seller_id=504186&card=vfen&group_id=114", 0, 19, 100, 0, 0.1, 0.1, 3, 0, 1, 1, 1, 0, 0, 0, "");
BuildNewPlan("联通V粉卡 39元", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=120&channel=invite&activity=LT2I5020&seller_id=504186&card=vfen&group_id=114", 0, 39, 300, 0, 0.1, 0.1, 5, 0, 1, 1, 1, 0, 0, 0, "VIVO应用商城、游戏中心等");
BuildNewPlan("天神卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=176&channel=invite&activity=KLT2I5020ZW1010&seller_id=504186&card=tianshen&group_id=117", 0, 19, 100, 0, 0.1, 0.1, 4, 0, 1, 1, 1, 5, 0, 0, "");
BuildNewPlan("小歪卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=175&channel=invite&activity=KLT2I5020ZW1010&seller_id=504186&card=waika&group_id=107", 0, 19, 100, 0, 0.1, 0.1, 2, 0, 1, 1, 1, 3, 0, 0, "今日头条、抖音、微博、央视影音等");
BuildNewPlan("米粉王卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=177&channel=invite&activity=KLT2I5020ZW1010&seller_id=504186&card=mifen&group_id=116", 0, 19, 100, 0, 0.1, 0.1, 3, 0, 5, 30, 1, 5, 0, 0, "");
BuildNewPlan("阿里小宝卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=21&channel=invite&activity=LT2I20&seller_id=504186&card=ali&group_id=43", 0, 19, 100, 0, 0.1, 0.1, 1, 0, 1, 1, 1, 0, 0, 20, "阿里系APP，优酷，今日头条等");
BuildNewPlan("22卡", "附赠一些B站权益", MNO.中国联通, MNO.中国联通, true, "https://www.bilibili.com/blackboard/activity-unicomopen.html?", 0, 22, 100, 0, 0.1, 0.1, 2, 0, 1, 1, 1, 0, 0, 0, "B站、微博、贴吧等");
BuildNewPlan("33卡", "附赠一些B站权益", MNO.中国联通, MNO.中国联通, true, "https://www.bilibili.com/blackboard/activity-unicomopen.html?", 0, 33, 100, 0, 0.1, 0.1, 3, 0, 1, 1, 1, 0, 0, 0, "B站、微博、贴吧等");
BuildNewPlan("米粉卡Pro", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=177&channel=invite&activity=KLT2I5020ZW1010&seller_id=504186&card=mifen&group_id=116", 0, 35, 500, 0, 0.1, 0.1, 10, 0, 1, 1, 1, 5, 0, 0, "");
BuildNewPlan("网易乐卡", "", MNO.中国联通, MNO.中国联通, true, "https://m.10010.com/scaffold-show/neteasylecard?channel=99&scene=126", 0, 39, 200, 0, 0.1, 0.1, 5, 0, 10, 30, 1, 0, 0, 0, "网易系APP，网易的游戏等");
BuildNewPlan("蚂蚁小宝卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=172&channel=invite&activity=DGLT5022&seller_id=504186&card=mayi&group_id=178", 0, 39, 200, 0, 0.1, 0.1, 5, 0, 10, 30, 1, 0, 0, 0, "阿里系APP，优酷，今日头条等");
BuildNewPlan("腾讯大王卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/lt2i/index?promotion_product_id=4&channel=invite&activity=LT2IWK5022&seller_id=504186&card=king&group_id=7", 0, 19, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "腾讯系APP");
BuildNewPlan("大歪卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=175&channel=invite&activity=KLT2I5020ZW1010&seller_id=504186&card=waika&group_id=107", 0, 59, 300, 0, 0.1, 0.1, 10, 0, 3, 30, 1, 3, 0, 0, "今日头条、抖音、微博、央视影音等");
BuildNewPlan("小电视卡", "附赠一些B站权益", MNO.中国联通, MNO.中国联通, true, "https://www.bilibili.com/blackboard/activity-unicomopen.html?", 0, 66, 300, 0, 0.1, 0.1, 5, 0, 1, 1, 1, 0, 0, 0, "B站、微博、贴吧等");
BuildNewPlan("腾讯地王卡", "", MNO.中国联通, MNO.中国联通, true, "https://m.10010.com/scaffold-show/pckingcard", 0, 39, 300, 0, 0.1, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "腾讯系APP");
BuildNewPlan("蚂蚁大宝卡", "", MNO.中国联通, MNO.中国联通, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=172&channel=invite&activity=DGLT5022&seller_id=504186&card=mayi&group_id=178", 0, 69, 400, 0, 0.1, 0.1, 8, 0, 10, 30, 1, 0, 0, 0, "阿里系APP，优酷，今日头条等");
BuildNewPlan("腾讯天王卡", "", MNO.中国联通, MNO.中国联通, true, "https://m.10010.com/scaffold-show/pckingcard", 0, 59, 800, 0, 0.1, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "腾讯系APP");
BuildNewPlan("小冰神卡", "", MNO.中国联通, MNO.中国联通, true, "http://mall.10010.com/goodsdetail/361909065802.html", 0, 99, 300, 0, 0.15, 0.1, 20, 0, 5, 30, 1, 0, 2, 0, "");
BuildNewPlan("大冰神卡", "", MNO.中国联通, MNO.中国联通, true, "http://mall.10010.com/goodsdetail/361909065803.html", 0, 199, 1000, 0, 0.15, 0.1, 40, 0, 3, 30, 1, 0, 2, 0, "");
BuildNewPlan("吃到饱 14.9元", "", MNO.小米移动, MNO.中国电信, true, "http://www.mi.com/mimobile", 0, 14.9, 0, 0, 0.1, 0.1, 3, 0, 0.5, 1, 0.1, 0, 0, 0, "");
BuildNewPlan("吃到饱 14.9元", "", MNO.小米移动, MNO.中国联通, true, "http://www.mi.com/mimobile", 0, 14.9, 0, 0, 0.1, 0.1, 3, 0, 0.5, 1, 0.1, 0, 0, 0, "");
BuildNewPlan("吃到饱 29元", "", MNO.小米移动, MNO.中国电信, true, "http://www.mi.com/mimobile", 0, 29, 0, 0, 0.1, 0.1, 10, 0, 1, 1, 0.5, 0, 0, 0, "");
BuildNewPlan("吃到饱 29元", "", MNO.小米移动, MNO.中国联通, true, "http://www.mi.com/mimobile", 0, 29, 0, 0, 0.1, 0.1, 10, 0, 1, 1, 0.5, 0, 0, 0, "");
BuildNewPlan("吃到饱 6元", "", MNO.小米移动, MNO.中国电信, true, "http://www.mi.com/mimobile", 0, 6, 0, 0, 0.12, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "");
BuildNewPlan("吃到饱 6元", "", MNO.小米移动, MNO.中国联通, true, "http://www.mi.com/mimobile", 0, 6, 0, 0, 0.12, 0.1, 0, 0, 1, 1, 0.8, 0, 0, 0, "");
BuildNewPlan("吃到饱 19元", "", MNO.小米移动, MNO.中国电信, true, "http://www.mi.com/mimobile", 0, 19, 60, 0, 0.1, 0.1, 0, 0, 1, 1, 999, 0, 0, 20, "");
BuildNewPlan("吃到饱 19元", "", MNO.小米移动, MNO.中国联通, true, "http://www.mi.com/mimobile", 0, 19, 60, 0, 0.1, 0.1, 0, 0, 1, 1, 999, 0, 0, 20, "");
BuildNewPlan("阿里大宝卡", "", MNO.小米移动, MNO.中国电信, true, "https://card.wifibanlv.com/promotion/product-land?promotion_product_id=21&channel=invite&activity=LT2I20&seller_id=504186&card=ali&group_id=43", 0, 59, 500, 0, 0.1, 0.1, 2, 0, 1, 1, 1, 0, 0, 0, "阿里系APP，优酷，今日头条等");
BuildNewPlan("任我行", "", MNO.小米移动, MNO.中国联通, false, "http://www.mi.com/mimobile", 0, 5, 0, 0, 0.1, 0.1, 0, 0.1, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("蜗牛全国流量王卡 19元", "合约期12个月，期限内不能换套餐", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2388-0-280.html", 0, 19, 0, 0, 0.12, 0.1, 2, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("蜗牛全国流量王卡 29元", "合约期12个月，期限内不能换套餐", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2388-0-280.html", 0, 29, 0, 0, 0.12, 0.1, 5, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("60免卡", "", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2243-0-239.html", 0, 6, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 0.3, 0, 0, 0, "");
BuildNewPlan("蜗牛全国流量王卡 39元", "合约期12个月，期限内不能换套餐", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2388-0-280.html", 0, 39, 0, 0, 0.12, 0.1, 10, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("蜗牛超级网红卡", "", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2638-0-323.html", 35, 41, 30, 0, 0.12, 0.1, 20, 0, 1, 1, 0.3, 0, 0, 0, "");
BuildNewPlan("蜗牛网红卡", "", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2638-0-323.html", 9.9, 15.9, 30, 0, 0.12, 0.1, 0, 0, 1, 1, 0.3, 0, 0, 0, "");
BuildNewPlan("蜗牛无限卡", "", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2507-0-318.html", 9, 15, 0, 0, 0.1, 0.1, 0, 0, 1, 1, 999, 0, 0, 20, "");
BuildNewPlan("蜗牛全国流量王卡 69元", "合约期12个月，期限内不能换套餐", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2388-0-280.html", 0, 69, 0, 0, 0.12, 0.1, 20, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("蜗牛全国流量王卡 99元", "合约期12个月，期限内不能换套餐", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2388-0-280.html", 0, 99, 0, 0, 0.12, 0.1, 40, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("畅玩12", "", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/1759-0-325.html", 2, 5, 0, 0, 0.12, 0.1, 0, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("蜗牛全国流量王卡 199元", "合约期12个月，期限内不能换套餐", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/2388-0-280.html", 0, 199, 0, 0, 0.12, 0.1, 100, 0.12, 0, 0, 0, 0, 0, 0, "");
BuildNewPlan("30免卡", "5元来电显示可取消", MNO.蜗牛移动, MNO.中国联通, true, "http://mall.snail.com/item/76-0-326.html", 0, 5, 0, 0, 0.15, 0.1, 0, 0.15, 0, 0, 0, 0, 0, 0, "");
function GetInputStr(id, def) {
    var e = document.getElementById(id);
    if (e == null) {
        return def;
    }
    var i = e;
    return i.value;
}
function GetInputNum(id, def) {
    var e = document.getElementById(id);
    if (e == null) {
        return def;
    }
    var i = e;
    return Math.min(Math.max(i.valueAsNumber, 0), 9999);
}
function GetInputBool(id, def) {
    var e = document.getElementById(id);
    if (e == null) {
        return def;
    }
    var i = e;
    return i.checked;
}
function DataSizeStr(n) {
    if (n >= 1) {
        return n.toFixed(1).replace(".0", "") + "G";
    }
    else {
        return (n * 1000).toString() + "M";
    }
}
function SortUsersPlan() {
    var supportSignals = [];
    if (GetInputBool("check1", true)) {
        supportSignals.push(MNO.中国电信);
    }
    if (GetInputBool("check2", true)) {
        supportSignals.push(MNO.中国移动);
    }
    if (GetInputBool("check3", true)) {
        supportSignals.push(MNO.中国联通);
    }
    var talkCount = GetInputNum("talkCount", 0);
    var textCount = GetInputNum("textCount", 0);
    var dataCount = GetInputNum("dataCount", 0);
    var useDataDays = GetInputNum("useDataDays", 0);
    var expensiveFirst = GetInputBool("checkExpensive", false);
    var useVirtual = GetInputBool("checkVirtual", true);
    var freedataapps = GetInputBool("checkFreeDataApps", false);
    var ShowNotOnSell = GetInputBool("checkShowNotOnSell", false);
    var keyword = GetInputStr("txtSearch", "").trim();
    var i, def = 999999;
    if (expensiveFirst) {
        def = -1;
    }
    for (i = 0; i < AllPhonePlans.length; i++) {
        var plan = AllPhonePlans[i];
        plan.LastCalcValue = def;
    }
    for (i = 0; i < AllPhonePlans.length; i++) {
        var plan = AllPhonePlans[i];
        if (ShowNotOnSell == false && plan.onSell == false) {
            continue;
        }
        var str = plan.Name + " " + MNO[plan.MNO] + " " + plan.AddonDescription + " " + plan.FreeDataApps;
        if (keyword.length > 0 && str.indexOf(keyword) < 0) {
            continue;
        }
        if (supportSignals.indexOf(plan.Signal) < 0) {
            continue;
        }
        if (useVirtual == false && plan.IsVirtualMNO) {
            continue;
        }
        if (freedataapps && plan.FreeDataApps.length < 1) {
            continue;
        }
        if (plan.DataLimit > 0 && dataCount > plan.DataLimit) {
            continue;
        }
        plan.LastCalcValue = CalcMonthBill(plan, talkCount, textCount, dataCount, useDataDays);
    }
    if (expensiveFirst) {
        AllPhonePlans.sort(ComparePlanLastCalcValueDESC);
    }
    else {
        AllPhonePlans.sort(ComparePlanLastCalcValueASC);
    }
}
function ComparePlanLastCalcValueASC(a, b) {
    var m1 = a.LastCalcValue;
    var m2 = b.LastCalcValue;
    if (m1 > m2) {
        return 1;
    }
    if (m1 < m2) {
        return -1;
    }
    return 0;
}
function ComparePlanLastCalcValueDESC(a, b) {
    return -ComparePlanLastCalcValueASC(a, b);
}
function DisplayPlans(showcount) {
    var h = document.getElementById("displayplans");
    if (h == null) {
        return;
    }
    var box = h;
    box.innerHTML = "以下结果仅供参考，请以运营商提供的最终服务为准。<br>";
    var i = -1, shown = 0, good = 0;
    var _loop_1 = function () {
        i += 1;
        if (i >= AllPhonePlans.length) {
            return "break";
        }
        var p = AllPhonePlans[i];
        var price = p.LastCalcValue;
        if (price < 0 || price > 900000) {
            return "continue";
        }
        good += 1;
        if (shown >= showcount) {
            return "continue";
        }
        var div = document.createElement("div");
        div.style.padding = "4px";
        div.style.margin = "4px";
        switch (p.MNO) {
            case MNO.中国电信:
                div.style.backgroundColor = "#c0d3ff";
                break;
            case MNO.中国移动:
                div.style.backgroundColor = "#83caff";
                break;
            case MNO.中国联通:
                div.style.backgroundColor = "#f6ffa4";
                break;
            default:
                div.style.backgroundColor = "rgb(255, 210, 192)";
                break;
        }
        var span = document.createElement("span");
        span.style.fontSize = "1.5em";
        span.innerText = p.Name;
        div.appendChild(span);
        var subdiv = document.createElement("div");
        subdiv.innerText = price.toFixed(2) + "元";
        subdiv.style.fontSize = "2em";
        subdiv.style.textAlign = "right";
        subdiv.style.float = "right";
        subdiv.style.margin = "5px";
        subdiv.appendChild(document.createElement("br"));
        span = document.createElement("span");
        span.style.fontSize = "14px";
        span.innerText = "套餐外：" + (price - Math.max(p.MonthTake, p.MustSpend)).toFixed(2) + "元";
        subdiv.appendChild(span);
        div.appendChild(subdiv);
        var link = document.createElement("a");
        link.href = p.URL;
        link.style.paddingLeft = "5px";
        link.target = "_blank";
        link.innerText = "详情";
        div.appendChild(link);
        div.appendChild(document.createElement("br"));
        var ul = document.createElement("ul");
        var addline = function (txt) {
            if (txt.length < 1) {
                return;
            }
            var li = document.createElement("li");
            li.innerText = txt;
            ul.appendChild(li);
        };
        var str = void 0;
        str = MNO[p.MNO];
        if (p.IsVirtualMNO) {
            str += "\uFF08\u4FE1\u53F7\uFF1A" + MNO[p.Signal] + "\uFF09";
        }
        if (p.onSell == false) {
            str += " 已停售此套餐";
        }
        addline(str);
        if (p.MonthTake > 0 || p.MustSpend > 0) {
            str = "";
            if (p.MonthTake > 0) {
                str += "\u57FA\u672C\u6708\u8D39\uFF1A" + p.MonthTake + "\u5143";
            }
            else {
                str += "无月费";
            }
            if (p.MustSpend > 0) {
                if (str.length > 0) {
                    str += "，";
                }
                str += "\u6708\u6700\u4F4E\u6D88\u8D39\uFF1A" + p.MustSpend + " \u5143";
            }
            addline(str);
        }
        if (p.FreeText > 0 || p.FreeText > 0 || p.FreeData > 0) {
            str = "";
            if (p.FreeTalk > 0) {
                str += "\u901A\u8BDD " + p.FreeTalk + " \u5206\u949F";
            }
            if (p.FreeText > 0) {
                if (str.length > 0) {
                    str += "，";
                }
                str += "\u77ED\u4FE1 " + p.FreeText + " \u6761";
            }
            if (p.FreeData > 0) {
                if (str.length > 0) {
                    str += "，";
                }
                str += "流量 " + DataSizeStr(p.FreeData);
            }
            str = "套餐包含：" + str;
            addline(str);
        }
        if (p.DataPkgSize > 0) {
            str = "流量包：";
            if (p.DataPkgDays == 1) {
                str += "日租";
            }
            else {
                if (p.DataPkgDays > 29) {
                    str += "月内用";
                }
                else {
                    str += p.DataPkgDays.toString() + "天内";
                }
            }
            str += "，" + p.DataPkgPrice + "元" + DataSizeStr(p.DataPkgSize);
            addline(str);
        }
        else {
            str = "\u6D41\u91CF\u6BCFM " + p.DataPrice + "\u5143";
            addline(str);
        }
        str = "\u7535\u8BDD\u6BCF\u5206\u949F " + p.TalkPrice + " \u5143\uFF0C\u77ED\u4FE1\u6BCF\u6761 " + p.TextPrice + " \u5143";
        addline(str);
        if (p.FreeDataApps.length > 0) {
            str = "免流：" + p.FreeDataApps;
            addline(str);
        }
        if (p.DataLimit > 0) {
            str = "\u6D41\u91CF\u9650\u5236\uFF1A" + p.DataLimit + "G";
            addline(str);
        }
        if (p.ViceCard > 0) {
            str = "\u53EF\u529E " + p.ViceCard + " \u5F20\u526F\u5361";
            addline(str);
        }
        if (p.FamilyNumber > 0) {
            str = "\u53EF\u6DFB\u52A0 " + p.FamilyNumber + " \u4E2A\u4EB2\u60C5\u53F7\u7801";
            addline(str);
        }
        addline(p.AddonDescription);
        div.appendChild(ul);
        box.appendChild(div);
        shown += 1;
    };
    while (true) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    if (good < 1) {
        box.innerHTML = "十分抱歉，没有对应的套餐，请修改规则。";
    }
    var topinfo = document.getElementById("topinfo");
    if (topinfo == null) {
        return;
    }
    topinfo.innerText = "\u5DF2\u7ECF\u4E00\u5171\u6536\u5F55\u4E86 " + AllPhonePlans.length + " \u4E2A\u5957\u9910\uFF0C\u7B26\u5408\u6761\u4EF6\u7684\u5171\u6709 " + good + " \u4E2A\u3002";
}
