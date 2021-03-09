---
title: Surface Book 一代安装最新版显卡驱动的办法
date: 2020-01-06 16:14:45
tags: [研究笔记,硬件]
---
本文讲的是微软 Surface Book 一代安装最新显卡驱动的办法，Surface Book 2 还有其他 Surface 产品的我就不清楚了。  
请注意：安装最新版的显卡驱动之后，要降级是比较麻烦的。  

# Intel HD Graphics 520
这个是 Book 必备的核显，你要是把键盘丢了，N卡独显就可以不要了x  
先去 [INTEL 官网的下载中心的显卡驱动下载页面](https://downloadcenter.intel.com/product/80939/Graphics-Drivers)，找到 Windows 10 的 DCH 驱动。[什么是 DCH 驱动？](https://www.zhihu.com/question/311670069/answer/734734237)  
![](https://s2.ax1x.com/2020/01/06/ls6M1f.png)
进去页面之后看左边，下载 .zip 文件，不要下载 .exe 驱动安装包，那个是安装不了的。  
![](https://s2.ax1x.com/2020/01/06/ls63ng.png)  
下载好之后解压到一个文件夹里，打开系统的设备管理器，找到 Intel 核显然后打开 属性-驱动-更新驱动-从本地文件里选择  

![](https://s2.ax1x.com/2020/01/06/lsclP1.png)   
然后选择我们之前解压到的那个文件夹，直接安装即可，安装是需要几分钟时间的，安装好之后就可以在开始菜单的程序列表里找到新增的 Intel 显卡控制面板了。    
日后的更新，我也不知道能不能更新，应该控制面板里是可以更新的，反正这个玩意没必要更新太勤快。毕竟给 Surface 重装系统可没给普通电脑重装那么容易。  
![](https://s2.ax1x.com/2020/01/06/lsgQeg.png)  
![](https://s2.ax1x.com/2020/01/06/lsggl6.png)  
在 Intel 显卡控制面板里面是可以自定义分辨率的，你可以给自己开个 1500x1000，那样就是100% DPI了，但是肉眼看起来还是很不舒服就是了。

# Nvidia Geforce GPU 
**注意，安装了新版的驱动之后，拔下屏幕再重新插入，N卡不会正常工作。需要到设备管理器里禁用N卡，再重新启用N卡才行。  
所以不是特别推荐更新。**  

如果你使用 Nvidia 的 GeForce Experience 的话，直接在里面更新就是了。  
手动更新的话，到 [NVIDIA 官网下载驱动的地方](https://www.geforce.cn/drivers)，搜索型号 GeForce Notebook 940M，然后下载最新版即可。  
![](https://s2.ax1x.com/2020/01/06/lsT7V0.png)  
Book 的N卡虽然各方面贴近 940M 但是实际上并不是 940M，最起码显存类型就不一样。  
其实NVIDIA给的显卡驱动都是通用的，看文件名就能看出来，我们这里下载到的只是笔记本电脑的通用N卡驱动。    
![](https://s2.ax1x.com/2020/01/06/ls7PIK.png)  
这里安装的也是 DCH 驱动，安装好之后也会在开始菜单程序列表里多一个 NVIDIA 显卡控制面板（可能需要一点时间之后才会出现），这个新的控制面板会替换掉老的桌面右键打开的那个。  
