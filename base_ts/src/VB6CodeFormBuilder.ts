/// <reference path = "VB6FileListBuilder.ts" />
/// <reference path = "Helpers.ts" />

class VB6CodeFormBuilder {
    constructor(title: string, icon?: VB6ContentIcon) {
        this.title = title
        let maindiv = document.createElement("div")
        maindiv.className = "winform"
        document.body.appendChild(maindiv)
        let ttdiv = document.createElement("div")
        ttdiv.innerText = title
        let imgname = ""
        if (icon == null) {
            icon = RandomChoose([VB6ContentIcon.Class, VB6ContentIcon.Form, VB6ContentIcon.Module]) as VB6ContentIcon
        }
        switch (icon) {
            case VB6ContentIcon.Form:
                imgname = "code"
                break
            case VB6ContentIcon.Class:
                imgname = RandomChoose(["code", "module2"])
                break
            case VB6ContentIcon.Module:
                imgname = "module2"
                break
            default:
                console.error("VB6CodeFormBuilder 无法识别的图标名字：", icon, title)
                throw "VB6CodeFormBuilder 无法识别的图标名字"
        }
        ttdiv.className = "winformtitle"
        ttdiv.style.backgroundImage = "url(\"vb6img/" + imgname + ".png\")"
        this.titleDiv = ttdiv
        maindiv.appendChild(ttdiv)
        let img = document.createElement("img")
        img.src = "/vb6img/3buttons.png"
        img.className = "winform3buttons"
        ttdiv.appendChild(img)
        let inside = document.createElement("div")
        inside.className = "winforminside"
        maindiv.appendChild(inside)
        let select1 = document.createElement("select")
        select1.className = "winformselect winborder2"
        this.leftSelectOption = CreateSelectOptionElement("Class")
        select1.add(this.leftSelectOption)
        inside.appendChild(select1)
        let select2 = document.createElement("select")
        select2.className = "winformselect winborder2"
        select2.add(CreateSelectOptionElement("欢迎阅读"))
        inside.appendChild(select2)
        maindiv.appendChild(inside)
        this.RightSelectMenu = select2
        this.maindiv = maindiv
        let bdiv = document.createElement("div")
        bdiv.className = "winformcodeareaborder winborder2"
        inside.appendChild(bdiv)
        let codearea = document.createElement("div")
        codearea.className = "winformcodearea"
        bdiv.appendChild(codearea)
        maindiv.style.width = "300px"
        this.CodeArea = codearea
        dragElement(maindiv, ttdiv)
        SetElementResizable(maindiv, 300, 300)
        let me = this
        maindiv.onresize = function () {
            me.AfterResize()
        }
        IndexManager.Add(maindiv)
        img.addEventListener("click", function (ev) {
            let x = maindiv.offsetLeft + maindiv.offsetWidth - ev.clientX - 8
            if (x <= 30) {
                console.log("关闭了窗口：", me.title)
                me.OnClose()
                maindiv.remove()
            } else if (x <= 60) {
                let ques = getQueryValues()
                let post = ques.get("po") || ""
                location.href = "/max.html?po=" + post
            }
        })
        select2.addEventListener("change", function () {
            console.log("修改了选择项：", this.value)
            let h1s = codearea.getElementsByTagName("h1")
            for (let i = 0; i < h1s.length; i++) {
                let h1 = h1s[i]
                if (h1.innerText == this.value) {
                    codearea.scroll({ left: 0, top: h1.offsetTop - maindiv.offsetHeight / 2 })
                    console.log("窗口内滚动到了：", h1.offsetTop, h1)
                    return
                }
            }
            h1s = codearea.getElementsByTagName("h2")
            for (let i = 0; i < h1s.length; i++) {
                let h1 = h1s[i]
                if (h1.innerText == this.value) {
                    codearea.scroll({ left: 0, top: h1.offsetTop - maindiv.offsetHeight / 2 })
                    console.log("窗口内滚动到了：", h1.offsetTop, h1)
                    return
                }
            }

        })
        this.AfterResize()
    }
    title: string
    maindiv: HTMLDivElement
    titleDiv: HTMLElement
    leftSelectOption: HTMLOptionElement
    RightSelectMenu: HTMLSelectElement
    CodeArea: HTMLDivElement
    OnClose: () => void = () => { }
    AfterResize() {
        this.CodeArea.style.height = (this.maindiv.offsetHeight - this.titleDiv.offsetHeight - this.RightSelectMenu.offsetHeight - 20).toFixed() + "px"
    }
    SetH1H2Items() {
        let titles: HTMLElement[] = []
        let h1s = this.CodeArea.getElementsByTagName("h1")
        for (let i = 0; i < h1s.length; i++) {
            let h1 = h1s[i]
            titles.push(h1)
        }
        h1s = this.CodeArea.getElementsByTagName("h2")
        for (let i = 0; i < h1s.length; i++) {
            let h1 = h1s[i]
            titles.push(h1)
        }
        let me = this
        if (titles.length < 1) {
            return
        }
        titles.sort(function (a, b): number {
            let ah = a.offsetTop
            let bh = b.offsetTop
            if (ah > bh) { return 1 }
            if (ah < bh) { return -1 }
            return 0
        })
        me.RightSelectMenu.innerHTML = ""
        titles.forEach(function (h1) {
            let txt = h1.innerText
            if (h1.tagName.toLowerCase() == "h2") {
                txt = " - " + txt
            }
            let e = CreateSelectOptionElement(txt, h1.innerText)
            me.RightSelectMenu.add(e)
        })
    }
}
