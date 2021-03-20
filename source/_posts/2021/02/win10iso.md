---
title: 从微软官方直接下载win10镜像的办法（不依赖媒体创建工具）
date: 2021-02-24
tags: [杂]
---
![](https://s3.ax1x.com/2021/02/27/6Sh1eS.png)  

这是微软官网的 Windows 10 镜像下载页面，如果你要下载安装镜像，它会让你下载“媒体创建工具”。   
其实是可以避开这个工具从而直接下载镜像的。   
你只需要把浏览器UA换成非 Windows 就行。   
Firefox 可以使用这个 Mozilla 推荐扩展来换UA：  [点我](https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/)   
换了UA之后，然后再刷新这个页面。     

![](https://s3.ax1x.com/2021/02/27/6Sh8oQ.png)   

你就得到了 Windows 10 光盘镜像下载页面。
如果你换了UA之后刷新了也不能成功，试一下访问这个链接   [https://www.microsoft.com/zh-cn/software-download/windows10ISO](https://www.microsoft.com/zh-cn/software-download/windows10ISO)   


可惜的是，这个下载链接只能支持24小时。其实是一个微软官方的HTTP下载，但是需要 token ， token 24小时后就失效了。  

我第一次发现这个秘密，还是在我试着拿 Manjaro 替换 Windows 之后。   

![](https://s3.ax1x.com/2021/02/27/6ShtWn.png)  
