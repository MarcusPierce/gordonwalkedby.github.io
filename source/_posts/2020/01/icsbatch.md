---
title: 描述性文本转 ICS 文件在线转换器【不再更新】
date: 2020-01-04 19:31:36
tags: [我的软件,日历]
---

# 本软件不再更新！因为对普通人来说没有任何意义。您可以离开了！

此工具是用来把一个描述性的文本转变成 ICS 日历文件的，仅支持以今年开始一年一次的事件，用起来比较硬核，最初是我为了记录好朋友的生日准备的，需要一定的正则表达式编写能力。  

使用的农历JS库：  https://github.com/jjonline/calendar.js  

<div>
在下面输入单个事件的正则匹配表达式，需要用括号括出月数字、日数字、事件名：<br>
<input id="regexEvent" type="text" value="([0-9]+?)-([0-9]+?) (.+)" style="width: 90%;">
<br>
月匹配位置： $<input id="regexMonth" type="number" value="1" max="9" min="1"><br>
日匹配位置： $<input id="regexDate" type="number" value="2" max="9" min="1"><br>
事件名匹配位置：$<input id="regexName" type="number" value="3" max="9" min="1"><br>
事件名添加前缀后缀，$0指的是原事件名：<input id="regexEventName" type="text" value="$0的生日" style="width: 90%;"><br>
<input id="useLunarCalendar" type="checkbox">使用农历（农历将会创造10年的各年的独立事件，考虑到大部分日历软件不支持农历事件）<br>
在下面输入文本： <button id="butGenerateICS" style="margin-left: 100px;" onclick="ButClicked();">点我生成 ICS 文件</button><br>
<textarea id="inputText" style="resize: none; width: 90%;" rows="20">01-24 戈登登</textarea>
<script src="/js/solarlunar.min.js"></script>
<script src="/js/ics-batch.js"></script>
</div>
