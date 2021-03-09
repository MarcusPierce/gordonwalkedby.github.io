---
title: 在 Windows 上给 Git SSH 设置代理
date: 2019-09-01 07:44:20
tags: [研究笔记,Git]
---
百度搜到的很多给 git 设置代理的办法，都是给 http 设置代理，而不是给 SSH 设置代理。那个 `git config --global http.proxy http://127.0.0.1:1080` 设置起来，只针对 http 的 git 有效果。  
然后就是 `ProxyCommand nc -v -x 127.0.0.1:1080 %h %p` ，那个分明是给 linux 才能用的， windows 上哪里来的 nc 程序？  

# 我的操作：  
1. 在自己的用户文件夹找到 .ssh 文件夹，比如我的是 `C:\Users\wby\.ssh` ，在里面新建一个空白文件，取名 `config`。  
   注意不是 `config.txt` ！  
   我强烈建议把 Windows 的后缀显示给打开，不然你根本不知道自己到底在编辑什么文件。  
   都用 Git 了不至于还害怕自己把文件后缀名给改错了吧？ 
   ![](https://s2.ax1x.com/2019/09/01/nSe1X9.png)  
2. 在 `config` 文件里写上一行就行：  
   `ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p`  
   这里 git 的安装路径和后面的代理自己看着填，不要试着用相对路径，保证要吃亏。因为 `Program Files` 文件夹中间带一个空格，所以这里需要把整个路径给引号引起来。  后面的代理的话，`-S` 指是 socks 代理，默认是 socks5，后面的 `%h %p` 意思是 Host 和 Port，必须得写上，我也不知道为什么要这么设计。  如果要使用 HTTP 代理，就写 `-H`，更多代理类型（比如 socks4）请参[这个](https://bitbucket.org/gotoh/connect/wiki/Home#!more-detail)。     
   以上这个写法是针对全局的，如果想只针对某个网站的话，就这么写：
```
Host github.com
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p

Host gitlab.com
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p
```
1. 接下来可以先初步尝试一下，找个地方随便 clone 个仓库试试。比如 `git clone git@github.com:nodejs/node.git`，nodejs 的官方库，clone过来有800MB+，作为速度测试还是蛮可以的。
   这时候会出现一个问题，程序会对你询问代理的密码，如果你代理没有设置密码就直接回车即可。
   确定没有问题了再说。如图是我的情况，速度可以达到 7 MiB/s，比不开代理的 SSH 快了几百倍。
   ![](https://s2.ax1x.com/2019/09/01/nSnuM4.png)  
2. 那个代理密码输入是每次都会来询问你的，所以如果你想省事，只能靠设置环境变量来实现。  
   设置环境变量不来的看[这个](https://www.jianshu.com/p/895f4e80305a)好了，我也懒得说。  
   如果要设置默认密码：
   ```
   SOCKS5_PASSWD
   HTTP_PROXY_PASSWORD
   ```
   如果要设置默认用户名：
   ```
   SOCKS_USER
   HTTP_PROXY_USER
   ```
   如果你的代理设置里，对用户名和密码没有要求，随便填写一个密码即可（代理会直接确认通过的），代理的默认用户名就是你的系统用户名。  
   ![](https://s2.ax1x.com/2019/09/01/nSubNt.png)  
   更多类型的代理用户名密码设置可以看[这个](https://bitbucket.org/gotoh/connect/wiki/Home#!specifying-user-name-via-environment-variables)。
3. 测试一下速度，下面是我的情况：  
   clone 速度普遍在 5 MiB/s 以上：  
   ![](https://s2.ax1x.com/2019/09/01/nSMjmQ.png)  
   push 速度还是比较慢的，只有 120 KiB/s 左右：  
   ![](https://s2.ax1x.com/2019/09/01/nSQjgK.png)  
   可能是 git 文件结构的关系，都是零散的小文件，不过整体是比不开代理快的，不开代理的 push 速度简直是随缘。  
