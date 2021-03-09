---
title: 给 Vegas \ Movie Studio 新版安裝 Frameserver 插件的办法
date: 2017-06-16 20:38:00
tags: [研究笔记,视频创作]
---

自己研究和谷歌了半天，終于，我成功給 [VEGAS Movie Studio 14 Steam Edition](https://store.steampowered.com/app/523110/VEGAS_Movie_Studio_14_Steam_Edition/) 安裝了 [DebugMode FrameServer](https://www.debugmode.com/frameserver/) 插件。下面是我的操作辦法。  

经实际测试，该办法同样适用于 15 版的 vegas。

本文參考了該[ Github 帖子](https://github.com/satishsampath/frame-server/issues/17)的內容（其實內容差不多）

----------


第一步，下載2.15版本的 DebugMode FrameServer 插件，也可以[點我](http://www.debugmode.com/download?fssetup_vegas13.exe)直接下載。


----------

第二步，安裝，請按照下面的圖片操作噢。

![](https://ooo.0o0.ooo/2017/06/16/5943d2f9e32d5.png)

一定要記得勾選這個Vegas64   
安装的路径选默认即可，第二个路径是 vegas 的路径，但是实际上不用管，随便选一个桌面即可。  


----------

第三步，新建一個文件夾。

在 vegas目录 的 FileIO Plug-Ins* 文件夾下

新建一個文件夾並命名為 *fsplug* 。

----------

第四步，複製文件。

把 *C:\Program Files (x86)\DebugMode\FrameServer* 文件夾

裡的 *dfscVegasV264Out.dll* 文件

複製到 *FileIO Plug-Ins\fsplug* 文件夾內。

![](https://ooo.0o0.ooo/2017/06/16/5943d4c0b20b5.png)



----------

第五步，在 vegas 安装文件夹

裡找到 *Release-x64.fio2007-config* 文件。

並用記事本或其他文本編輯軟體打開。

在裡面加上一行話：

```
fsplug=FileIO Plug-Ins\fsplug\dfscvegasv264out.dll
```

![](https://ooo.0o0.ooo/2017/06/16/5943d5bece96d.png)

然後保存，接下來在 Movie Studio 的渲染選項列表裡就能看見啦

![](https://ooo.0o0.ooo/2017/06/16/5943d65f42f99.png)


----------

接下來就是享受快感的時候啦！

![](https://ooo.0o0.ooo/2017/06/16/5943d7415e5e6.png)

導出再利用 MediaCoder x64 裡的 GPU 設置渲染，感覺渲染速度提高了不少的。

Movie Studio 去掉了 GPU 加速的功能是最坑爹的！居然只能 CPU 渲染！

下面是我對同一段視頻的渲染速度測試，僅供參考，看得出來，果然還是 GPU 靠譜啊！

![](https://ooo.0o0.ooo/2017/06/16/5943d99234640.png)

![](https://ooo.0o0.ooo/2017/06/16/5943d99271c6e.png)

說明：兩個同樣的視頻內容，其中包含一些 Vegas 自帶的特效處理。