/// <reference path="init.ts" />
/// <reference path="indexPage.ts" />
/// <reference path="post.ts" />

(function () {
    const imgs = document.getElementsByTagName("img")
    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        let s = img.src
        if (s.length > 25) {
            s = s.substring(0, 25) + "..."
        }
        img.alt = "图片加载失败 " + s
    }
})();

(function () {
    const links = document.getElementsByTagName("a")
    const myHost = location.host
    for (let i = 0; i < links.length; i++) {
        const a = links[i]
        if (a.host.length > 0 && a.host != myHost) {
            a.target = "_blank"
        }
    }
})();

(function () {
    const toRemove = document.getElementById("removeWhenSuccess")
    if (toRemove == null) { return }
    toRemove.remove()
})();
