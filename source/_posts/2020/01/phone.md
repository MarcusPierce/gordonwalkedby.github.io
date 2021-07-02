---
title: 电话流量套餐筛选排列工具
date: 2020-01-08 20:12:01
tags: [我的垃圾软件]
---

# 本工具自从2020年4月之后已经不再提供更新。因为根本没人用。您可以离开了！

原脚本是typescript写的，我已经删了，你想看可以自己F12看js版本，不带混淆的。  

这个工具是为了根据电话的使用情况去选出最适合的电话套餐用的。  
这些套餐数据都是自己从各大网站搜集来的，没有直接采用他人整理的数据大全（其实是懒得去问授权）。  
只收录了一些互联网套餐，地区套餐、校园套餐、物联网套餐等都没收录，不好查有哪些，数量也不少。  
这是免费开源程序，源码见页面下方。      
绝大多数套餐都会对大量使用流量进行限速，所以计算大流量时不一定便宜的就是最好的。  
**任何的购卡行为之前都应该做好充足的查询与检查，确定卡就是自己想要的那种卡。 本工具提供的信息可能有误，以运营商提供的服务为准。**   

更新记录：  

- 2020年3月7日：新增了移动王卡和米粉王卡Plus，下架了一些套餐。
- 2020年2月25日：新增了移动的X星卡、电信的X神卡等10个套餐。
- 2020年1月10日：新增了百度的卡，还有芒果卡，步步高卡等13个套餐，新增简单的搜索机制，改进了计数器。
- 2020年1月9日：改为使用csv存储数据，pwsh运行编译脚本，新增选项“列出已经无法新办的卡”，新增之前忘记收录的15个套餐。
- 2020年1月8日：公开项目，包含45个套餐。

<div style="border: 3px solid black;">
    每个月，你都需要：（没有请写0，一切输入都最大为9999，最小为0）<br>
    打电话：<input id="talkCount" type="number" value="10">分钟，<br>
    发短信：<input id="textCount" type="number" value="1">条，<br>
    使用流量：<input id="dataCount" type="number" value="3">G （会隐藏限速限流的套餐），<br>
    一个月中，要用流量的日子有：<input id="useDataDays" type="number" value="30">天（最多30天）。<br><br>
    你的手机支持的运营商：
    <input id="check1" type="checkbox" checked="checked">中国电信
    <input id="check2" type="checkbox" checked="checked">中国移动
    <input id="check3" type="checkbox" checked="checked">中国联通
    <br><br>
    <input id="checkVirtual" type="checkbox">可以是虚拟运营商<br>
    <input id="checkFreeDataApps" type="checkbox">只看有免流APP的<br>
    <input id="checkShowNotOnSell" type="checkbox">列出已经无法新办的卡<br>
    <input id="checkExpensive" type="checkbox">先看贵的，不看便宜的<br>
    包含关键词：<input id="txtSearch" type="text">（关键词只能有一个，越精简越好，比如“腾讯”、“百度”）
    <br><br>
    <button onclick="SortUsersPlan();DisplayPlans(10);">选出10个最优套餐</button>
    <button onclick="SortUsersPlan();DisplayPlans(99999);">列出全部套餐</button><br>
    <span id="topinfo"></span>
    <br><br>
    <div id="displayplans"></div>
    <script src="/js/chooseyourphoneplan.js"></script>
</div>
