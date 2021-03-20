
//　zindex调正，用add注册一个元素，然后元素被点击的时候会被设置为zIndex=9999，老的被点击的元素会变成1234
let IndexManager = {
    list: [] as HTMLElement[],
    lastSelected: null as HTMLElement | null,
    Add(e: HTMLElement) {
        if (this.list.includes(e)) {
            return
        }
        this.list.push(e)
        e.style.zIndex = "9999"
        let me = this
        let func = function () {
            if (me.lastSelected != null) {
                me.lastSelected.style.zIndex = "1234"
            }
            e.style.zIndex = "9999"
            me.lastSelected = e
        }
        func()
        e.addEventListener("mousedown", func)
    }
}

//　快速创建HTMLOptionElement
function CreateSelectOptionElement(title: string, value: string = ""): HTMLOptionElement {
    if (value.length < 1) { value = title }
    let s = document.createElement("option")
    s.innerText = title
    s.value = value
    return s
}

// 返回随机的 boolean
function RndBool(): boolean {
    let rnd = Math.random()
    return rnd > 0.5
}

// 获取这个class的第一个元素，如果不存在就throw
function GetFirstElementByClass(c: string): HTMLElement {
    let es = document.getElementsByClassName(c)
    if (es.length < 1) { throw "网页不包含class:" + c }
    let e = es[0] as HTMLElement
    return e
}

// 在新标签页打开链接
function OpenURL(url: string, newpage: boolean = false) {
    let a = document.createElement("a")
    a.href = url
    if (newpage) {
        a.target = "_blank"
    }
    document.body.appendChild(a)
    console.log("打开链接：", a.href, newpage)
    a.click()
    a.remove()
}

// 从数字范围里随便选一个整数
function RandomInt(a: number, b: number): number {
    if (b < a) {
        let tp = a
        a = b
        b = tp
    }
    let rnd = Math.round(Math.random() * (b - a) + a)
    return rnd
}

// 从数组里随便选一个
function RandomChoose(array: Array<any>): any {
    let l = array.length
    if (l < 1) { return null }
    if (l == 1) { return array[0] }
    let rnd = RandomInt(0, l - 1)
    return array[rnd]
}

// 复制一个数组
function CloneArray<T>(a: Array<T>): Array<T> {
    let b: Array<T> = []
    a.forEach(function (v) {
        b.push(v)
    })
    return b
}

// 获取链接的请求组合
function getQueryValues(url: string = ""): Map<string, string> {
    if (url.length < 2) {
        url = document.URL
    }
    let map = new Map<string, string>()
    if (url.indexOf("?") < 0) return map;
    let str = url.split("?")[1];
    if (str.indexOf("&") < 0) {
        if (str.indexOf("=") < 0) return map;
        let arr = str.split("=");
        map.set(arr[0], decodeURI(arr[1]))
        return map;
    }
    let ls = str.split("&");
    for (let i = 0; i < ls.length; i++) {
        let arr = ls[i].split("=");
        if (arr[0].length < 1) { continue }
        map.set(arr[0], decodeURI(arr[1]))
    }
    return map
}

//设置链接的后部分参数，但不会重新加载页面
function SetQueryURL(uu: string) {
    let url = location.protocol + "//" + location.host + location.pathname + uu
    if (location.href != uu) {
        history.pushState("", "", url)
    }
}

//获得鼠标点击位置相对于这个元素的左上角的坐标，返回一个数组，第一个是x，第二个是y
function GetMouseOffsetOfElement(div: HTMLElement, ev: MouseEvent): number[] {
    let realX: number = 0, realY: number = 0
    let he: HTMLElement | null = div
    while (he != null) {
        realX += he.offsetLeft
        realY += he.offsetTop
        he = he.offsetParent as HTMLElement | null
    }
    realX = ev.clientX - realX
    realY = ev.clientY - realY
    return [realX, realY]
}

//检测这个点的坐标是否在这个长方形里面，点数组是[x,y] ，长方形数组是[x,y,width,height]
function IsPointInRect(point: number[], rect: number[]): boolean {
    if (point.length != 2 || rect.length != 4) {
        console.error("IsPointInRect 错误的输入： ", point, rect)
        return false
    }
    if (point[0] >= rect[0] && point[0] <= rect[0] + rect[2]) {
        if (point[1] >= rect[1] && point[1] <= rect[1] + rect[3]) {
            return true
        }
    }
    return false
}

// 跳转到搜索页面，只在指定页面生效
function GoSearch(engine: string) {
    let input = document.getElementById("inputsearch") as HTMLInputElement
    let str = input.value
    str = str.trim()
    if (str.length < 1) {
        return
    }
    str = encodeURI(str)
    let url = ""
    switch (engine) {
        case "github":
            url = "https://github.com/gordonwalkedby/gordonwalkedby.github.io/search?q=" + str
            break
        case "google":
            url = "https://www.google.com/search?newwindow=1&safe=strict&q=" + str + "+site%3Awalkedby.com"
            break
        case "duck":
            url = "https://duckduckgo.com/?q=" + str + "+site%3Awalkedby.com"
            break
        case "bing":
            url = "https://cn.bing.com/search?q=" + str + "+site%3Awalkedby.com"
            break
        default:
            break
    }
    if (url.length > 5) {
        OpenURL(url, true)
    }
}

let OpenPost = function (id: string) {
    location.href = "/?po=" + id
}

function ChangeCodeAreaHTML(c: HTMLElement) {
    let alist = c.getElementsByTagName("a")
    for (let i = 0; i < alist.length; i++) {
        let ae = alist[i]
        let host1 = ae.href.includes(location.host)
        if (ae.target.length < 1 && host1 == false) {
            ae.target = "_blank"
        }
        if (host1 && ae.href.includes("/?po=")) {
            let reg = new RegExp("/?po=(.+?)[&|#]", "gim")
            let results = reg.exec(ae.href + "&")
            if (results != null) {
                let pot = results[1]
                ae.href = "javascript:void"
                ae.addEventListener("click", function () {
                    OpenPost(pot)
                })
            }
        }
    }
    let imglist = c.getElementsByTagName("img")
    for (let i = 0; i < imglist.length; i++) {
        let img = imglist[i]
        if (img.alt.length < 1) {
            img.alt = "【图片加载失败 " + img.src + "】"
        }
    }
    let precodes = c.querySelectorAll("pre code")
    for (let i = 0; i < precodes.length; i++) {
        let pre = precodes[i]
        hljs.highlightBlock(pre)
    }
    let scripts = c.getElementsByTagName("script")
    for (let i = 0; i < scripts.length; i++) {
        let sc = scripts[i]
        if (sc.src.length > 2) {
            let x = new XMLHttpRequest()
            x.open("GET", sc.src)
            x.timeout = 5000
            x.onloadend = function () {
                if (x.status == 200) {
                    let newsc = document.createElement("script")
                    newsc.innerHTML = x.responseText
                    document.body.appendChild(newsc)
                } else {
                    console.error("无法加载这个脚本", sc.src)
                }
            }
            x.send()
        } else {
            let newsc = document.createElement("script")
            newsc.innerHTML = sc.innerHTML
            document.body.appendChild(newsc)
        }
    }
}
