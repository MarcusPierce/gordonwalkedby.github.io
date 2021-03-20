---
title: B站六级计算器【不再更新】
date: 2019-08-11 09:27:58
tags: [我的软件,bilibili]
---

# 本工具自从2020年5月之后已经不再提供更新。可能与现在的B站规则不符合。我就不管啦。

源码要看自己F12看JS就好。 

在下面输入你的B站信息，然后我就可以计算出你还有多久才可以升级到 LV6 。

<script src="/js/whenlv6.js"></script>

<form id="calc" style="border: medium ridge black; width: 80%; padding: 10px;">
    <h2>请在下面填写你帐号目前的情况：</h2>
    经验值：<input id="ex" type="number" value="1000"><br><br>
    拥有的硬币数量：<input id="coins" type="number" value="10"><br><br>
    <input id="doCoins" type="checkbox" value="y" checked="checked"> 会每天给别人的视频投币5个（不足5个就投光你有的为止）<br><br>
    <input id="doShare" type="checkbox" value="y" checked="checked"> 会每天用手机APP分享视频<br><br>
    你投稿一个视频大概收到几个硬币（没有视频请写0）：<input id="videocoins" type="number" value="0"><br><br>
    你一个月大概投稿几个视频：<input id="videos" type="number" value="0"><br><br>
    你一个月大概花多少B币给别的UP主充电（或给某番剧承包花钱）：<input id="sends" type="number" value="0"><br><br>
    <input id="doLive" type="checkbox" value="y" checked="checked"> 会每天去B站直播那签到，并领取全部9个直播宝箱的900个银瓜子并换700个变成一个硬币<br><br>
    你一个月其实有几天能记得来B站做事刷经验：<input id="days" type="number" value="10"><br><br>
    <button type="button" onclick="CalcWhenLV6();" >点我计算</button>
    <h2>结果：</h2>
    <b><p id="out"></p></b>
</form>

# 当前计算准则：  

- 为计算方便，“你一个月其实有几天能记得来B站做事刷经验”的这几天都视作每月的前几天
- [B站六个等级](https://www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3?id=7251c4ab69d44a8ebbbd276dea46d790)的经验值：0, 200, 1500, 4500, 10800, 28800
- 这里只计算B站绑定了手机号的用户的等级，即经验最低为100
- 每天登录：硬币+1,经验+5
- 每天观看视频：经验+5
- 给别人的视频投币一个：经验+10，每天最多+50
- 自己的视频获得一个投币：经验+1，在每月的一日结算
- 给别人充电花费一B币（一元钱）或承包番剧花费一B币（一元钱）：经验+1，因为此处不便估计所以也在每月的一日结算，B站实际为立刻结算，所以其实冲钱就能马上升级
- 根据[av19231729](https://www.bilibili.com/video/av19231729)所说，投稿视频也可以硬币+1，经验+1，视频被收藏数每增加200硬币也+1，此处没有查到相关记录，不做计算
- 风纪委员的奖励不做计算
- 在B站直播每天可以开直播在线宝箱，最多一天开出内 (30+80+190)*3=900 个银瓜子
- 在B站直播每月可以连续签到5天换666银瓜子，此处不做计算
- 在B站直播购买月费会员或年费会员会立即附赠2-10万的银瓜子，此处不做计算
- 在B站直播可以[每天兑换700个银瓜子为一个硬币](https://live.bilibili.com/exchange)
- 当风纪委员，可以获得一定量的硬币，具体计算我并不知情，此处不做计算
