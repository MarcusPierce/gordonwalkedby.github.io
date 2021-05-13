---
title: 开源的保险箱（搭配 Github Gist）
date: 2021-05-14
tags: [我的软件]
---
其实只是一个 AES 加解密工具页面，但是集成了快捷读取 github gist （只能读取 gist 里的第一个文件）。   

我的建议用法就是新建一个 secret gist ，然后把我想存储的信息用AES和密码加密。然后全选复制，手动粘贴到那个 sectet gist 里。  
以后想读取的时候，就打开保险箱页面读取，输入密码解密。修改之后再加密，然后全选复制，再粘贴到 gist 里。  
注： secret gist 是知道 gist id 的任何人都能读取，只是他很可能不知道你的AES解密密码。但是写入是需要登录 github 账户的。    

在线使用： [https://box.walkedby.com/](https://box.walkedby.com/)  

源码： [Github](https://github.com/gordonwalkedby/gistsecury)     

![](https://z3.ax1x.com/2021/05/14/grk7VS.png)   
