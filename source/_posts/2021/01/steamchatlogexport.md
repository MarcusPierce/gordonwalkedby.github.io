---
title: Steam 聊天记录导出脚本
date: 2021-01-28 22:19:54
tags: [我的软件,Steam]
---

这是我写的一个油猴脚本啦。  
可以在[steam官方的聊天记录存档页面](https://help.steampowered.com/zh-cn/accountdata/GetFriendMessagesLog)导出全部的数据（我指的是steam官方允许你能看见的那部分，也就是最近14天）。Steam官方只保留了14天，14天以前的steam就不提供了。      
Steam官方只保留了14天，14天以前的steam就不提供了。    
官方网页只能一页一页翻看聊天记录，不能导出。所以我就设计了这个。     

安装好之后，在steam官方的聊天记录存档页面这个页面时，网页左侧会有一个按钮，按了就会开始采集。采集完成后会提示你可以下载了，下载过来是csv或是json。   
如果你不懂编程：csv文件可以直接用Excel表格软件打开（Office或WPS）。如果你需要分享的话，用Excel表格软件另存为 .xlsx 也可以的。   
如果你逛普通的steam网站，在登录状态下，如果七天没有使用脚本备份数据的话，就会发提醒（超过七天之后是一天发一次）。    

安装请到： [greasy fork](https://greasyfork.org/scripts/420714-steam-chat-log-export)     
源码： [github](https://github.com/gordonwalkedby/Steam-Chat-Log-Export)    

# 截图： 
![这是效果图1](https://s3.ax1x.com/2021/01/28/y9wj8x.png)   
![这是效果图2](https://s3.ax1x.com/2021/01/28/y9wAjU.png)   

# 反馈
- [github issue](https://github.com/gordonwalkedby/Steam-Chat-Log-Export/issues)   
- [keylol](https://keylol.com/t680475-1-1)   
