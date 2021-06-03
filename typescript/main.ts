const inline = "inline-block"
const none = "none"
const block = "block"
let CurrentAricle = "";

(function () {
    let iam404 = document.getElementById("iam404")
    if (iam404 == null) {
        return
    }
    iam404.innerText = "这是一个 404 页面！"
})();

(function () {
    let str = location.search
    let se = new URLSearchParams(str)
    let po = se.get("po")
    if (po != null && po.length > 0) {
        location.href = location.origin + "/" + po.toLowerCase()
    } else {
        let url = location.href.toLowerCase()
        url = url.replace("www.walkedby.com", "walkedby.com").replace(/\/donate[a-z0-9]+/, "/donate")
        if (location.href != url) {
            location.href = url
        } else {
            CurrentAricle = location.pathname.replace(/[\/\\]/gim, "")
        }
    }
})();

let articles: ArticleCollection[] = []

let leftBar = document.getElementById("leftBar") as HTMLDivElement
let rightBar = document.getElementById("rightBar") as HTMLDivElement
let articleDiv = document.getElementsByTagName("article")[0] as HTMLDivElement
let headerNav = document.getElementById("headerNav") as HTMLDivElement
let ButheaderNavExpand = document.getElementById("ButheaderNavExpand") as HTMLDivElement
let headerNavExpand = document.getElementById("headerNavExpand") as HTMLDivElement
let articleTitleSelect = document.getElementById("articleTitleSelect") as HTMLSelectElement
let rightHeaders = document.getElementById("rightHeaders") as HTMLDivElement;

(function () {
    let insidejson = document.getElementById("insidejson") as HTMLDivElement
    let jj = insidejson.innerText.trim()
    let data: InsideJSON = JSON.parse(jj)
    articles = data.Articles
})();

let articleTitleSelectIndex = -1

articles.forEach(function (c) {
    if (c.Articles.length > 0) {
        let div = document.createElement("div")
        div.innerText = c.Name
        div.className = "leftSectionTitle"
        leftBar.appendChild(div)
        let opt = document.createElement("option")
        opt.innerText = "--" + c.Name + "--"
        opt.value = ""
        articleTitleSelect.appendChild(opt)
        articleTitleSelectIndex += 1
        c.Articles.forEach(function (ac) {
            if (CurrentAricle.length < 1) {
                CurrentAricle = ac.FileName
            }
            let a = document.createElement("a")
            a.innerText = ac.Title
            a.href = ac.FileName
            leftBar.appendChild(a)
            if (CurrentAricle == ac.FileName) {
                a.className = "selectedTitle"
            }
            opt = document.createElement("option")
            opt.innerText = " " + ac.Title
            opt.value = ac.FileName
            articleTitleSelect.appendChild(opt)
            articleTitleSelectIndex += 1
            if (articleTitleSelect.selectedIndex < 1 && ac.FileName == CurrentAricle) {
                articleTitleSelect.selectedIndex = articleTitleSelectIndex
            }
        })
    }
})

articleTitleSelect.addEventListener("input", function () {
    let v = this.value
    console.log(v)
    if (v.length > 0) {
        location.href = "/" + v
    }
})

let headerLinks = new Map<string, string>()
headerLinks.set("首页", "/")
headerLinks.set("RSS", "/rsss")
headerLinks.set("搜索", "/search")
headerLinks.set("关于", "/about")
headerLinks.set("留言", "https://shimo.im/forms/WgWqrRWWjTYRDqCR/fill")
headerLinks.forEach(function (v, k) {
    let a = document.createElement("a")
    a.innerText = k
    a.href = v
    headerNav.appendChild(a)
    if (a.host != location.host) {
        a.target = "_blank"
    }
    let a2 = document.createElement("a")
    a2.innerText = k
    a2.href = v
    headerNavExpand.appendChild(a2)
    if (a2.host != location.host) {
        a2.target = "_blank"
    }
    a2.appendChild(document.createElement("br"))
})

ButheaderNavExpand.addEventListener("click", function () {
    if (headerNavExpand.offsetHeight < 10) {
        headerNavExpand.style.display = block
        this.style.color = "black"
        this.style.backgroundColor = "white"
    } else {
        headerNavExpand.style.display = none
        this.style.color = "white"
        this.style.backgroundColor = "black"
    }
})

function ResetView() {
    let phoneView = window.innerWidth < window.innerHeight || window.innerWidth < 800
    if (phoneView) {
        ButheaderNavExpand.style.display = inline
        headerNav.style.display = none
        articleTitleSelect.style.display = block
        leftBar.style.display = none
        articleDiv.style.marginLeft = "2px"
        articleDiv.style.marginRight = articleDiv.style.marginLeft
        rightBar.style.position = "relative"
        rightBar.style.left = "20px"
        rightBar.style.width = "90%"
    } else {
        ButheaderNavExpand.style.display = none
        headerNav.style.display = inline
        articleTitleSelect.style.display = none
        leftBar.style.display = block
        articleDiv.style.marginLeft = "180px"
        articleDiv.style.marginRight = "180px"
        headerNavExpand.style.display = none
        rightBar.style.left = (articleDiv.offsetLeft + articleDiv.offsetWidth).toFixed() + "px"
        rightBar.style.position = "fixed"
        rightBar.style.width = "180px"
    }
    leftBar.style.height = (window.innerHeight - 52).toFixed() + "px"
}
ResetView()

setInterval(ResetView, 40);

(function () {
    let selected = leftBar.getElementsByClassName("selectedTitle")
    if (selected.length > 0) {
        let s = selected[0] as HTMLDivElement
        leftBar.scrollTo(0, s.offsetTop - 60)
    }
})();

(function () {
    let h1s = articleDiv.getElementsByTagName("h2")
    if (h1s.length > 0) {
        for (let i = 0; i < h1s.length; i++) {
            let h1 = h1s[i]
            let pp = h1.parentElement
            if (pp != null) {
                let a = document.createElement("a")
                a.innerText = h1.innerText
                a.href = "#" + a.innerText
                rightHeaders.appendChild(a)
                let a2 = document.createElement("a")
                a2.id = a.innerText
                pp.insertBefore(a2, h1)
            }
        }
    } else {
        rightHeaders.remove()
    }
})();

(function () {
    let alist = document.getElementsByTagName("a")
    let domain = location.hostname
    for (let i = 0; i < alist.length; i++) {
        let a = alist[i] as HTMLAnchorElement
        if ((a.target == null || a.target.length < 1) && a.href.includes(domain) == false) {
            a.target = "_blank"
        }
    }
    let imgs = document.getElementsByTagName("img")
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i]
        if (img.alt == null || img.alt.includes("失败") == false) {
            let str = "图片加载失败 "
            if (img.src.length < 70) {
                str += img.src
            } else {
                str += img.src.substring(0, 70)
            }
            img.alt = str
        }
    }
})();

(function () {
    let searchInput = document.getElementById("inputsearch")
    let div = document.getElementById("searchOptions")
    if (searchInput == null || div == null) { return }
    div.style.textAlign = "center"
    let links: Array<HTMLAnchorElement> = []
    let sources = new Map<string, string>()
    let addSearch = function (title: string, url: string) {
        if (div == null) {
            return
        }
        sources.set(title, url)
        let ak = document.createElement("a")
        ak.style.margin = "4px"
        ak.style.display = "table"
        ak.href = "#"
        ak.innerText = title
        div.appendChild(ak)
        links.push(ak)
    }
    searchInput.addEventListener("input", function () {
        let input = searchInput as HTMLInputElement
        let str = encodeURI(input.value.trim())
        links.forEach(function (v) {
            let url = sources.get(v.innerText)
            if (url == null || str.length < 1) {
                url = "#"
                v.target = ""
            } else {
                url = url.replace("输入", str)
                v.target = "_blank"
            }
            v.href = url
        })
    })
    addSearch("DuckDuckGo", "https://duckduckgo.com/?q=输入+site%3Awalkedby.com")
    addSearch("谷歌", "https://www.google.com/search?newwindow=1&safe=strict&q=输入+site%3Awalkedby.com")
    addSearch("必应中国版", "https://cn.bing.com/search?q=输入+site%3Awalkedby.com")
    addSearch("github", "https://github.com/gordonwalkedby/gordonwalkedby.github.io/search?l=Markdown&q=输入")
})();
