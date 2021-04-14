"use strict";
function RandomInt(a, b) {
    if (a == b) {
        return Math.floor(a);
    }
    let min = Math.round(Math.min(a, b)) - 0.49;
    let max = Math.round(Math.max(a, b)) + 0.49;
    let rnd = Math.random();
    return Math.round(rnd * (max - min) + min);
}
function RandomChoose(array) {
    let l = array.length;
    if (l < 2) {
        return array[0];
    }
    let index = RandomInt(0, l - 1);
    return array[index];
}
function RandomHSLColor(s = 100, b = 85) {
    let str = "hsl(";
    str += RandomInt(0, 359).toFixed() + ",";
    str += s.toFixed() + "%,";
    str += b.toFixed() + "%)";
    return str;
}
(function () {
    let iam404 = document.getElementById("iam404");
    if (iam404 == null) {
        return;
    }
    iam404.innerText = "这是一个 404 页面！";
})();
(function () {
    let str = location.search;
    let se = new URLSearchParams(str);
    let po = se.get("po");
    if (po != null && po.length > 0) {
        location.href = location.origin + "/" + po;
    }
})();
(function () {
    let SectionTitles = document.getElementsByClassName("sectionTitle");
    let titleWidth = Math.min(400, window.innerWidth * 0.7);
    for (let i = 0; i < SectionTitles.length; i++) {
        let t = SectionTitles[i];
        let str = t.innerText;
        for (let j = 0; j < 50; j++) {
            if (j < 1 && str.length > 0) {
                str = " " + str + " ";
            }
            str = "+" + str + "+";
            t.innerText = str;
            if (t.offsetWidth > titleWidth) {
                break;
            }
        }
    }
})();
(function () {
    let alist = document.getElementsByTagName("a");
    let domain = location.hostname;
    for (let i = 0; i < alist.length; i++) {
        let a = alist[i];
        if ((a.target == null || a.target.length < 1) && a.href.includes(domain) == false) {
            a.target = "_blank";
        }
    }
    let imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (img.alt == null || img.alt.includes("失败") == false) {
            let str = "图片加载失败 ";
            if (img.src.length < 70) {
                str += img.src;
            }
            else {
                str += img.src.substring(0, 70);
            }
            img.alt = str;
        }
    }
})();
(function () {
    let div = document.getElementById("randomSaying");
    if (div == null) {
        return;
    }
    let says = [
        "如果你不喜欢抑郁症患者，请你关闭本网页。",
        "性别就像国籍，也许很难改变，但是应该可以改变。通常一个“叛国者”会被大家唾弃。",
        "一夫一妻制比较好。嗯。。。。",
        "如果是 iPhone，我可以忍受低端机，如果是 Android，那是不能忍的。",
        "如果你想当一个职业UP主，你三个月内起码10万粉丝。戈登我做了大概6年的视频了，2万不到粉。我不可能做一个职业UP。",
        "Steam版中文半条命1，删除 valve_schinese 里面的 titles.txt 文件可以提升游戏体验。",
        "唉，为什么戈登碰见的大部分 MTF 都比戈登高。",
        "我喜欢Windows下的谷歌拼音，虽然它和java的GUI有兼容性问题，经常在java GUI退出的时候，让GUI崩溃。",
        "姐姐，对不起。",
        "千万不要服毒自杀，消化系统实在太漫长太痛苦了。",
        "我们的产品全球有售，注：不包括中华人民共和国",
        "我们再也不用理会什么帝国参议院了，陛下已经永久解除了议会。恐惧，将会使银河秩序使然。"
    ];
    div.innerText = RandomChoose(says);
})();
function AddFriendsLink(title, url) {
    let div = document.getElementById("friendLinksBox");
    if (div == null) {
        return;
    }
    let a = document.createElement("a");
    a.href = url;
    a.title = title;
    a.target = "_blank";
    a.className = "friendslink";
    a.innerText = title;
    let bg = "linear-gradient(to bottom," + RandomHSLColor() + "0%," + RandomHSLColor() + "50%," + RandomHSLColor() + "52%," + RandomHSLColor() + "100%)";
    a.style.background = bg;
    a.style.color = RandomHSLColor(100, 11);
    div.appendChild(a);
}
(function () {
    let links = [];
    links.push({
        k: "技术宅的结界",
        v: "https://www.0xaa55.com/"
    });
    links.push({
        k: "AceSheep",
        v: "https://blog.acesheep.com/"
    });
    links.push({
        k: "Sonic853",
        v: "https://blog.853lab.com/"
    });
    let len = links.length;
    for (let i = 0; i < len; i++) {
        let index = RandomInt(0, links.length - 1);
        let item = links[index];
        links.splice(index, 1);
        AddFriendsLink(item.k, item.v);
    }
})();
(function () {
    let searchInput = document.getElementById("inputsearch");
    let div = document.getElementById("searchOptions");
    if (searchInput == null || div == null) {
        return;
    }
    div.style.textAlign = "center";
    let links = [];
    let sources = new Map();
    let addSearch = function (title, url) {
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
    searchInput.addEventListener("input", function () {
        let input = searchInput;
        let str = encodeURI(input.value.trim());
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
    });
    addSearch("DuckDuckGo", "https://duckduckgo.com/?q=输入+site%3Awalkedby.com");
    addSearch("谷歌", "https://www.google.com/search?newwindow=1&safe=strict&q=输入+site%3Awalkedby.com");
    addSearch("必应中国版", "https://cn.bing.com/search?q=输入+site%3Awalkedby.com");
    addSearch("github", "https://github.com/gordonwalkedby/gordonwalkedby.github.io/search?l=Markdown&q=输入");
})();
