---
title: 使用第三代ID 的 STEAM 个人主页链接
date: 2019-08-22 10:58:26
tags: [研究笔记,Steam]
---
 
现在 Steam 推出了用一个数字 ID 来加好友的功能，这个 ID 其实一直都在，
我们的 [SteamRepCN](https://steamrepcn.com/) 管它叫“Steam 第三代 ID”，老外一般管它叫 SteamID3 ，下面我把它简称为 ID3 ，与ID64区分。  
![](https://s2.ax1x.com/2019/08/22/mdSh9S.png)  
![](https://s2.ax1x.com/2019/08/22/maX89H.png)
![](https://s2.ax1x.com/2019/08/22/mdiwyF.png)  
这个 ID3 其实也可以用来当个人主页链接的（是我火星了，原来早有了），用法如下：
```bash
https://steamcommunity.com/profiles/[U:1:139200659]
# 注意 U 必须是大写的U，其他符号必须是英文半角，最后一个方括号可以省略
https://steamcommunity.com/profiles/[U:1:139200659
```
\[U:1:139200659\] 其实这里前面的 U 就是指的是 User ，前面的 1 应该指的是这个帐号是公开正常的。具体可以参考[这篇百科](https://developer.valvesoftware.com/wiki/SteamID)  

所以目前有三种链接可以跳到一个人的主页：
```bash
# 以下这个自定义ID是可变的
https://steamcommunity.com/id/gordonwalkedby
# 以下的数字ID都不可变
https://steamcommunity.com/profiles/76561198099466387
https://steamcommunity.com/profiles/[U:1:139200659
```

给开发者的提示，以下API都可以用，返回的内容自己看，我就不说了：
```bash
# 完整的个人主页链接后面加个 ?xml=1 
https://steamcommunity.com/profiles/[U:1:139200659?xml=1
https://steamcommunity.com/profiles/76561198099466387?xml=1
https://steamcommunity.com/id/gordonwalkedby?xml=1
# 使用 ID3 
https://steamcommunity.com/miniprofile/139200659/json
# 使用 ID3 ，返回一个 html 片段，这个比较特殊，如果带上COOKIE，可以获得备注昵称
https://steamcommunity.com/miniprofile/139200659/xml
```
