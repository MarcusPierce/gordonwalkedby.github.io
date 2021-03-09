---
title: 订阅 RSS
date: 2017-01-13
---

RSS 订阅链接：  

<span id="RSSlink">https://walkedby.com/atom.xml</span><br>
<button id="copyRSSlink">点我复制到剪贴板</button>
<script>
    (function () {
        var but = document.getElementById("copyRSSlink")
        var link = document.getElementById("RSSlink").innerText
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

戈登推荐你使用一个浏览器扩展形式的 RSS 阅读器，在浏览器运行的时候，它会在后台自动更新订阅。   
戈登一直在用 [FeedBro](https://nodetics.com/feedbro/) ，支持大部分现代浏览器，而且还受到了 Mozilla 的官方认可。    
当你选择用 RSS 订阅的时候，你可以自豪地觉得自己比那些依赖手机推送的人要高雅。  

