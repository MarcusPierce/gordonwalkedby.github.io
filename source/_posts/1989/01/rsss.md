---
title: 订阅 RSS
date: 1989-01-13
tags: 我自己
---

RSS 订阅链接：  

<span id="RSSlink">https://walkedby.com/atom.xml</span><br>
<button id="copyRSSlink">点我复制到剪贴板</button><br>
<a id="RSSlinka" href="/atom.xml">点我直接打开</a>
<script>
    (function () {
        var ak = document.getElementById("RSSlinka")
        var span = document.getElementById("RSSlink")
        var link = ak.href
        span.innerText = ak.href
        var but = document.getElementById("copyRSSlink")
        var lastTimeout = -1
        but.onclick = function () {
            if (lastTimeout != -1) {
                clearTimeout(lastTimeout)
            }
            navigator.clipboard.writeText(link)
            but.innerText = "复制成功"
            lastTimeout = setTimeout(function () {
                but.innerText = "点我复制到剪贴板"
                lastTimeout = -1
            }, 1000)
        }
    })();
</script>

该 RSS 已经通过 W3C 验证检测。  
[![](https://validator.w3.org/feed/images/valid-atom.png)](https://validator.w3.org/feed/check.cgi?url=https%3A%2F%2Fwalkedby.com%2Fatom.xml)   

戈登推荐你使用一个浏览器扩展形式的 RSS 阅读器，在浏览器运行的时候，它会在后台自动更新订阅。   
戈登一直在用 [FeedBro](https://nodetics.com/feedbro/) ，支持大部分现代浏览器，而且还受到了 Mozilla 的官方认可。    
当你选择用 RSS 订阅的时候，你可以自豪地觉得自己比那些依赖手机推送的人要高雅。   

这里还可以使用谷歌旗下的 FeedBurner ，他可以云端检测RSS更新，更新后就会给你发送email。  
你需要翻墙才能成功登记 FeedBurner 服务。  
[点我去使用email订阅](https://feedburner.google.com/fb/a/mailverify?uri=walkedby/sIDA)   
