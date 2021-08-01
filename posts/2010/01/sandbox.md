---
title: 沙盒测试页  
date: 2010-01-04  
tags: 我自己
---
这个页面只是用作沙盒测试的  
试试博客和网页渲染的一些功能是否正常  
 
<div>
你的浏览器UA是： 
<span id="uaaa"></span>

<br>
你的浏览器 <span id="webrtcsupports"></span> WebRTC。
<br><br>
</div>
<script>
(function(){
document.getElementById("uaaa").innerText =navigator.userAgent
var s="支持"
if(typeof(RTCPeerConnection)=="undefined"){s="不"+s;}
document.getElementById("webrtcsupports").innerText = s
})()
  </script>  

如果要关闭 firefox webRTC， 请到 about:config 然后找到 media.peerconnection.enabled ，设置为false

我是**粗体abc**，我是*斜体xyz*，对吗？

- [cloudflare 测试页面](https://test1.gordonwalkedby.workers.dev)   

H1-H6:  

# 标题1，你`能x`*斜体*看见**粗体**吗[dd](https://ww.baidu.com)超链接 #
## 标题2，啦`code me`ddww ##
### 标题3ddddd[百度](https://ww.baidu.com)超链接
#### 标题4，能*斜体*看见**粗体**吗
##### 标题5，嗷
###### 标题6  

Markdown表格，不受支持：   

| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |


下面是 `<table>` ，里面有几个 EMOJI:  

<table>
<tr><td>姓名</td><td>身高</td></tr>
<tr><td>小捞</td><td>35131CM</td></tr>
<tr><td>分阶段😊卡拉囧里个囧❤懒得</td><td>35.131CM</td></tr>
<tr><td>接👀发阿迪</td><td>315✈CM</td></tr>
</table>

大代码框：

```javascript

class StreamUpdate{
    constructor(Url,BufferSize = 1024 * 1024 * 128) { //Url 链接地址
        this.Url = Url
        this.Buffer = new ArrayBuffer(BufferSize);

    }
}

class Stream{
    constructor() {
    }
}
```

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

```

文章内水平线：  

---

插入一张jpg，图床：[sm.ms](https://sm.ms/)：  
![如果你看见我，说明图片加载失败了。](https://i.loli.net/2019/02/05/5c59826724b4f.jpg)

试试 PNG ：

![如果你看见我，说明图片加载失败了。](https://i.loli.net/2019/02/03/5c56c8b6a87a1.png)

无序列表：
- Steam
- Origin
    - 大 d你`能x`*斜体*看见**粗体**吗[dd](https://ww.baidu.com)超链接
    - 小
- 中
- Uplay
    - 育碧
- UBI
- 育碧商城

有序列表：
1. SS4`<dddsss>`314134
2. SSR3**fda1**413
3. SSRR431431
    1. www
    2. wwww
    3. wwwww13431你`能x`*斜体*看见**粗体**吗[dd](https://ww.baidu.com)超链接
4. SSRRR43`ds代码a`1413413
5. SSRRRR23414
    1. 国weqewq
        1. 家dsadasdsad
            1. 大sadsadas
                1. 事dsadsa

小代码框：   
你想试试 `Ctrl + F` 吗？  

> 引用块：
> 1. SS
> 1. SSR
> 1. SSRR
> 
> 我是**粗体abc**，我是*斜体xyz*，对吗？
> 
> ```
> int main(){return 0;}
> ```
> 
> - fdajkd
> - 7fdfdajkd
> - ddf456d/8745adsajkd
> - fd87ajkd
> 
 
> 
> Garry's Mod（讲道理，我很讨厌这个大的撇号，不知道是不是字体还是渲染器的问题）   
> I don’t want to go!  
> 这里应该有换行才是正确的  
> “中文”  
> "English"  
> 《》【】『』：；  
> > < > [ ] { } : ;  
> > ## [Strict](https://github.com/17/hexo-theme-strict) 主题的介绍语：  
> A clean, minimal and responsive theme for hexo.  
> 
> 你知道`Ctrl + C`和`Ctrl + V`吗？  

# 嵌入外部元素：   
[Steam购买 Bang Bang Racing](https://store.steampowered.com/app/207020)：  

<iframe src="https://store.steampowered.com/widget/207020/" frameborder="0" width="646" height="190"></iframe>
  

[推特](https://twitter.com/Twitter/status/1090657246227369984)：  

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Here&#39;s<br> ⊂_ヽ<br> 　 ＼＼ <br> 　　 ＼( ͡° ͜ʖ ͡°)<br> 　　　 &gt;　⌒ヽ<br> 　　　/ 　 へ＼<br> 　　 /　　/　＼＼the<br> 　　 ﾚ　ノ　　 ヽ_つ<br> 　　/　/<br> 　 /　/|<br> 　(　(ヽ<br> 　|　|、＼Tweet<br> 　| 丿 ＼ ⌒)<br> 　| |　　) /<br> ノ )　　Lﾉ<br> (_／</p>&mdash; Twitter (@Twitter) <a href="https://twitter.com/Twitter/status/1090657246227369984?ref_src=twsrc%5Etfw">January 30, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
 

[B站视频](https://www.bilibili.com/video/av18190165)：

<iframe src="//player.bilibili.com/player.html?aid=18190165&cid=30188411&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="853px" height="480px"> </iframe>
<br>
<br><br><br><br><br>


<iframe src="https://t.bilibili.com/320496953620275161?tab=2" width="800px" ></iframe>

