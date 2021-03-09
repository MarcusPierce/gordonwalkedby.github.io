---
title: GMod使用半条命2中文配音的办法
date: 2019-03-02
tags: [研究笔记,起源]
---
这篇文章讲述，怎么给 Steam 版 GMod 里的NPC使用中文的半条命2配音。  
需要的是 Steam 版的半条命2，首先记得把半条命2的语言开到中文。  

![](https://s2.ax1x.com/2019/03/02/kbTyZj.png)

接下来打开两个文件夹窗口，一个打开到 `C:\Program Files (x86)\Steam\steamapps\common\GarrysMod\bin`  
另外一个打开到 `C:\Program Files (x86)\Steam\steamapps\common\Half-Life 2\hl2`  
![](https://s2.ax1x.com/2019/03/02/kb7vhq.png)  
在 `GarrysMod\bin` 文件夹里找到 `vpk.exe`  
在 `Half-Life 2\hl2` 文件夹里找到 `hl2_sound_vo_schinese_dir.vpk` 文件  

然后把 `hl2_sound_vo_schinese_dir.vpk` 拖到 `vpk.exe` 里打开  
![](https://s2.ax1x.com/2019/03/02/kb7FYt.png)  
正常情况下应该会看见这个窗口  
![](https://s2.ax1x.com/2019/03/02/kb7kfP.png)  
你会看见一堆的 wav 文件，那些就是中文配音文件了  
等这个窗口自己消失，就可以得到全部需要的文件了。  
以上操作会把 `hl2_sound_vo_schinese_dir.vpk` 里包含的中文配音文件解压到 `C:\Program Files (x86)\Steam\steamapps\common\Half-Life 2\hl2\hl2_sound_vo_schinese_dir` 文件夹里  
![](https://s2.ax1x.com/2019/03/02/kb7lYq.png)  

接下来删除 `sound` 以外的三个文件夹，因为我们只需要声音文件  
然后移动整个 `hl2_sound_vo_schinese_dir` 文件夹到 `GarrysMod\garrysmod\addons` 文件夹里即可  
![](https://s2.ax1x.com/2019/03/02/kb7J6U.png)  

现在你就可以打开 GMod，然后体验中文配音的半条命2了  
这个办法也适用于HLS和EP1  
解包以下vpk并移动到 `garrysmod\addons` 文件夹里即可

- `Half-Life 2\hl1\hl1_sound_vo_schinese_dir.vpk`
- `Half-Life 2\episodic\ep1_sound_vo_schinese_dir.vpk`

