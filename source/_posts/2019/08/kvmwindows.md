---
title: Linux 主机与 KVM 虚拟机内 Windows 进行 FTP 文件传输的配置说明
date: 2019-08-14 09:29:24
tags: [研究笔记,Linux]
---
我在 KVM 虚拟机里安装了 Windows 10 ，然后发现客户机与宿主机之间的文件传输还是很麻烦。  
动不动就塞一张 ISO 给虚拟 DVD 驱动器，太麻烦了。  
在网上翻来翻去也没研究透 SMB Mount 什么的用法。  
最后自己研究出了 FTP 的办法，接下来我把过程写在这里。  

1. 首先检查自己的 Linux 系统的代理，因为我被我自己的代理给坑死了，Privoxy 是不支持 FTP 代理的，而我居然还写了进去。  
    检查一下自己的 `export | grep ftp_proxy` ，最好为空，我不觉得现在还有人需要在 FTP 上挂代理了。  
    还有检查一下桌面的代理设置：  
    ![](https://s2.ax1x.com/2019/08/14/mPLlUU.png)  
2. 设置好虚拟机的网络，类型要 NAT ，不要桥接。 
    ![](https://s2.ax1x.com/2019/08/14/mPzhaq.png)  
    然后把虚拟机的 IP 给锁上，免得自己跑偏了。  
    ![](https://s2.ax1x.com/2019/08/14/mPzG8O.png)  
3. 接下来在 Windows 里用 IIS 开启一个粗暴的 FTP 服务器。
    ![](https://s2.ax1x.com/2019/08/14/mPOnRH.png)  
    首先要启用 IIS 和 FTP ，安装好之后，在开始菜单里找到并打开 IIS 。  
    ![](https://s2.ax1x.com/2019/08/14/mPOIw6.png)  
    接下来按图里操作，如果你懂的话，可以自己改改。  
    ![](https://s2.ax1x.com/2019/08/14/mPXEXn.png)  
    名字随便起，然后给它一个文件夹。  
    ![](https://s2.ax1x.com/2019/08/14/mPXY0x.png)  
    IP 不绑定，端口默认，然后 SSL 选没有。  
    ![](https://s2.ax1x.com/2019/08/14/mPXynI.png)   
    全员支持，全员读写。  
    ![](https://s2.ax1x.com/2019/08/14/mPXLNT.png)  
    FTP 服务器的创建到这里就完成了，但是其实还是有权限问题，默认还是只能读取不能写入的。  
    接下来跑到 Windows 文件管理器里打开这个文件夹的属性。  
    按照下面从左到右的顺序进行操作：  
    ![](https://s2.ax1x.com/2019/08/14/mPvpRg.png)  
    给 Everyone 来个全部控制允许就行了（粗暴）  
    ![](https://s2.ax1x.com/2019/08/14/mPvGo6.png)  
    然后一路 OK 保存，关闭属性窗口。  
    IIS 默认是开机自动启动在后台的，所以你不用自己手动让 FTP 服务器开机启动。 
4. 在虚拟机里把防火墙对 FTP 的封锁进行解除，当然你要是图省事，直接关了防火墙就好了。  
    https://jingyan.baidu.com/article/c35dbcb099987c8916fcbcee.html   

5. 给这个 FTP 文件夹先随便创建一个文件，免得等会看不出来有没有连接成功。
    ![](https://s2.ax1x.com/2019/08/14/mPvz01.png)
6. 接下来可以先用浏览器简单试试了，记得把浏览器代理也给关了或者跳过 192.168 的IP。
    ![](https://s2.ax1x.com/2019/08/14/mip2En.png)  
    成功了就好，不成功就真的拉倒了，我也不知道怎么办了。  
7. 然后就可以在系统自带的文件管理器里添加 FTP 文件夹了，我这里使用的是 KDE 的 Dolphin 。  
    ![](https://s2.ax1x.com/2019/08/14/miPk1f.png)    
    ![](https://s2.ax1x.com/2019/08/14/miiLLD.png)  
    ![](https://s2.ax1x.com/2019/08/14/miFPQf.png)  
    ![](https://s2.ax1x.com/2019/08/14/miF5nS.png)  
    能顺利连接和操作就好，不行就拉倒，我真的没什么办法了。  
