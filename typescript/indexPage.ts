/// <reference path="init.ts" />

(function () {
    const PostsJson = document.getElementById("indexpostsjson")
    if (PostsJson == null) {
        return
    }
    const posts: Post[] = JSON.parse(PostsJson.innerHTML)
    const divlist = document.createElement("div")
    divlist.className = "articleList"

    const divSort = document.createElement("div")
    divSort.className = "articleSort"
    const labSort = document.createElement("span")
    labSort.innerText = ""
    divSort.appendChild(labSort)
    const voidHref = "javascript:void(0);"
    const butViewAll = document.createElement("a")
    butViewAll.innerText = "取消筛选"
    butViewAll.href = voidHref
    butViewAll.addEventListener("click", function () {
        SortTags("")
    })
    divSort.appendChild(butViewAll)
    mainBody.appendChild(divSort)

    const SortTags = function (t: string) {
        t = t.toLowerCase().replaceAll("#","")
        const viewAll = t.length < 1
        location.hash = t
        posts.forEach(function (a) {
            const div = a.div
            if (div == null) { return }
            if (viewAll) {
                div.style.display = ""
            } else {
                div.style.display = a.Tags.includes(t) ? "" : "none"
            }
        })
        divSort.style.display = viewAll ? "none" : "block"
        labSort.innerText = "筛选标签： " + t
        window.scroll(0, 0)
    }
    posts.forEach(function (a) {
        const box = document.createElement("div")
        box.className = "articleBox"
        const h2 = document.createElement("h2")
        const link = document.createElement("a")
        link.innerText = a.Title
        link.href = "/" + a.FileName
        h2.appendChild(link)
        box.appendChild(h2)
        const time = document.createElement("time")
        time.innerText = a.ReleaseDateDisplayStr
        time.dateTime = a.ReleaseDateISOStr
        box.appendChild(time)
        if (a.Tags.length > 0) {
            const divtags = document.createElement("div")
            divtags.className = "articleBox-tags"
            a.Tags.forEach(function (v) {
                const tag = document.createElement("a")
                tag.innerText = "#" + v
                tag.href = voidHref
                tag.addEventListener("click", function (this) {
                    SortTags(v)
                })
                divtags.appendChild(tag)
            })
            box.appendChild(divtags)
        }
        divlist.appendChild(box)
        a.div = box
    })
    mainBody.appendChild(divlist)
    let searchTag = location.hash.replace("#", "")
    if (searchTag.length > 0) {
        SortTags(decodeURI(searchTag))
    }
})();
