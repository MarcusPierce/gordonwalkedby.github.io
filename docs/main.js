"use strict";
const mainBody = document.getElementsByTagName("main")[0];
(function () {
    const t404 = document.getElementById("t404");
    if (t404 == null) {
        return;
    }
    let url = location.href.toLowerCase();
    let str = location.search;
    const se = new URLSearchParams(str);
    const po = se.get("po");
    if (po != null && po.length > 0) {
        url = location.origin + "/" + po.toLowerCase();
    }
    if (url != location.href) {
        location.href = url;
    }
})();
(function () {
    const PostsJson = document.getElementById("indexpostsjson");
    if (PostsJson == null) {
        return;
    }
    const posts = JSON.parse(PostsJson.innerHTML);
    const divlist = document.createElement("div");
    divlist.className = "articleList";
    const divSort = document.createElement("div");
    divSort.className = "articleSort";
    const labSort = document.createElement("span");
    labSort.innerText = "";
    divSort.appendChild(labSort);
    const voidHref = "javascript:void(0);";
    const butViewAll = document.createElement("a");
    butViewAll.innerText = "取消筛选";
    butViewAll.href = voidHref;
    butViewAll.addEventListener("click", function () {
        SortTags("");
    });
    divSort.appendChild(butViewAll);
    mainBody.appendChild(divSort);
    const SortTags = function (t) {
        t = t.toLowerCase().replaceAll("#", "");
        const viewAll = t.length < 1;
        location.hash = t;
        posts.forEach(function (a) {
            const div = a.div;
            if (div == null) {
                return;
            }
            if (viewAll) {
                div.style.display = "";
            }
            else {
                div.style.display = a.Tags.includes(t) ? "" : "none";
            }
        });
        divSort.style.display = viewAll ? "none" : "block";
        labSort.innerText = "筛选标签： " + t;
        window.scroll(0, 0);
    };
    posts.forEach(function (a) {
        const box = document.createElement("div");
        box.className = "articleBox";
        const h2 = document.createElement("h2");
        const link = document.createElement("a");
        link.innerText = a.Title;
        link.href = "/" + a.FileName;
        h2.appendChild(link);
        box.appendChild(h2);
        const time = document.createElement("time");
        time.innerText = a.ReleaseDateDisplayStr;
        time.dateTime = a.ReleaseDateISOStr;
        box.appendChild(time);
        if (a.Tags.length > 0) {
            const divtags = document.createElement("div");
            divtags.className = "articleBox-tags";
            a.Tags.forEach(function (v) {
                const tag = document.createElement("a");
                tag.innerText = "#" + v;
                tag.href = voidHref;
                tag.addEventListener("click", function () {
                    SortTags(v);
                });
                divtags.appendChild(tag);
            });
            box.appendChild(divtags);
        }
        divlist.appendChild(box);
        a.div = box;
    });
    mainBody.appendChild(divlist);
    let searchTag = location.hash.replace("#", "");
    if (searchTag.length > 0) {
        SortTags(decodeURI(searchTag));
    }
})();
(function () {
    const articleFull = document.getElementsByClassName("articleFull")[0];
    if (articleFull == null) {
        return;
    }
    const divcontent = document.getElementsByClassName("articleContent")[0];
    const codelist = divcontent.querySelectorAll("pre code");
    if (codelist.length > 0) {
        const link = document.createElement("link");
        link.href = "/mono-blue.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        let js = document.createElement("script");
        js.src = "/highlight.min.js";
        document.body.appendChild(js);
        js.addEventListener("load", function () {
            eval("hljs.highlightAll();");
        });
        const None = "none";
        const Block = "block";
        const ShowCode = "显示代码";
        const HideCode = "隐藏代码";
        const CopyCode = "复制代码";
        let cantCopy = navigator.clipboard == null;
        const AfterCopyCode = "复制成功！";
        const CantCopyCode = "代码无法复制，浏览器不支持或没有开启HTTP";
        codelist.forEach(function (v) {
            const pre = v.parentElement;
            const txt = pre.innerText;
            if (txt.length > 500 || txt.split("\n").length > 9) {
                const divBefore = document.createElement("div");
                divBefore.className = "beforeCodeBlock";
                const butHide = document.createElement("button");
                butHide.innerText = ShowCode;
                butHide.addEventListener("click", function () {
                    if (pre.style.display == None) {
                        pre.style.display = Block;
                        butHide.innerText = HideCode;
                    }
                    else {
                        pre.style.display = None;
                        butHide.innerText = ShowCode;
                    }
                });
                const butCopy = document.createElement("button");
                butCopy.innerText = CopyCode;
                let lastTimer = 0;
                butCopy.addEventListener("click", function () {
                    if (cantCopy) {
                        butCopy.innerText = CantCopyCode;
                        return;
                    }
                    navigator.clipboard.writeText(txt);
                    butCopy.innerText = AfterCopyCode;
                    if (lastTimer != 0) {
                        clearTimeout(lastTimer);
                    }
                    lastTimer = setTimeout(function () {
                        butCopy.innerText = CopyCode;
                        lastTimer = 0;
                    }, 1300);
                });
                pre.style.display = None;
                divBefore.appendChild(butHide);
                divBefore.appendChild(butCopy);
                divcontent.insertBefore(divBefore, pre);
            }
        });
    }
    const divtags = document.getElementsByClassName("articleTags")[0];
    if (divtags != null) {
        const tags = divtags.getElementsByTagName("a");
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            tag.href = "/#" + tag.innerText;
        }
    }
})();
(function () {
    const searchInput = document.getElementById("inputsearch");
    const div = document.getElementById("searchOptions");
    if (searchInput == null || div == null) {
        return;
    }
    div.style.textAlign = "center";
    const links = [];
    const sources = new Map();
    const addSearch = function (title, url) {
        if (div == null) {
            return;
        }
        sources.set(title, url);
        let ak = document.createElement("a");
        ak.style.margin = "4px";
        ak.style.display = "table";
        ak.href = "#";
        ak.innerText = title;
        div.appendChild(ak);
        links.push(ak);
    };
    const SetSearch = function (str) {
        str = encodeURI(str);
        links.forEach(function (v) {
            let url = sources.get(v.innerText);
            if (url == null || str.length < 1) {
                url = "#";
                v.target = "";
            }
            else {
                url = url.replace("输入", str);
                v.target = "_blank";
            }
            v.href = url;
        });
    };
    searchInput.addEventListener("input", function () {
        SetSearch(this.value.trim());
    });
    addSearch("DuckDuckGo", "https://duckduckgo.com/?q=输入+site%3Awalkedby.com");
    addSearch("谷歌", "https://www.google.com/search?newwindow=1&safe=strict&q=输入+site%3Awalkedby.com");
    addSearch("必应中国版", "https://cn.bing.com/search?q=输入+site%3Awalkedby.com");
    addSearch("github（在线搜索汉字经常抽风）", "https://github.com/gordonwalkedby/gordonwalkedby.github.io/search?l=Markdown&q=输入");
    SetSearch(searchInput.value.trim());
})();
(function () {
    const imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        let s = img.src;
        if (s.length > 25) {
            s = s.substring(0, 25) + "...";
        }
        img.alt = "图片加载失败 " + s;
    }
})();
(function () {
    const links = document.getElementsByTagName("a");
    const myHost = location.host;
    for (let i = 0; i < links.length; i++) {
        const a = links[i];
        if (a.host.length > 0 && a.host != myHost) {
            a.target = "_blank";
        }
    }
})();
(function () {
    const toRemove = document.getElementById("removeWhenSuccess");
    if (toRemove == null) {
        return;
    }
    toRemove.remove();
})();
