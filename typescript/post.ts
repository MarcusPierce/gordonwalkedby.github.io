/// <reference path="init.ts" />

(function () {
    const articleFull = document.getElementsByClassName("articleFull")[0]
    if (articleFull == null) {
        return
    }
    const divcontent = document.getElementsByClassName("articleContent")[0] as HTMLDivElement
    const codelist = divcontent.querySelectorAll("pre code")
    if (codelist.length > 0) {
        const link = document.createElement("link")
        link.href = "/mono-blue.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)
        let js = document.createElement("script")
        js.src = "/highlight.min.js"
        document.body.appendChild(js)
        js.addEventListener("load", function () {
            eval("hljs.highlightAll();")
        })
    }
    const divtags = document.getElementsByClassName("articleTags")[0]
    if (divtags != null) {
        const tags = divtags.getElementsByTagName("a")
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i]
            tag.href = "/#" + tag.innerText
        }
    }
})();

(function () {
    const searchInput = document.getElementById("inputsearch") as HTMLInputElement | null
    const div = document.getElementById("searchOptions")
    if (searchInput == null || div == null) { return }
    div.style.textAlign = "center"
    const links: Array<HTMLAnchorElement> = []
    const sources = new Map<string, string>()
    const addSearch = function (title: string, url: string) {
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
    const SetSearch = function (str: string) {
        str = encodeURI(str)
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
    }
    searchInput.addEventListener("input", function (this) {
        SetSearch(this.value.trim())
    })
    addSearch("DuckDuckGo", "https://duckduckgo.com/?q=输入+site%3Awalkedby.com")
    addSearch("谷歌", "https://www.google.com/search?newwindow=1&safe=strict&q=输入+site%3Awalkedby.com")
    addSearch("必应中国版", "https://cn.bing.com/search?q=输入+site%3Awalkedby.com")
    addSearch("github（在线搜索汉字经常抽风）", "https://github.com/gordonwalkedby/gordonwalkedby.github.io/search?l=Markdown&q=输入")
    SetSearch(searchInput.value.trim())
})();
