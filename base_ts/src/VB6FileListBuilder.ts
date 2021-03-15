
enum VB6ContentIcon {
    Form,
    Module,
    Class
}

class VB6FileListBuilder {
    //请使用 #filelistItems 对应的那种 div
    constructor(div: HTMLElement) {
        this.mainDiv = div
        let linebox = document.createElement("div")
        linebox.style.position = "relative"
        let line = document.createElement("div")
        line.style.width = "1px"
        line.style.height = "1px"
        line.style.position = "absolute"
        line.style.marginLeft = "4px"
        line.style.borderLeft = "1px dotted rgb(109,109,109)"
        line.style.marginTop = "-2px"
        div.appendChild(linebox)
        linebox.appendChild(line)
        this.leftline = line
    }
    leftline: HTMLDivElement
    mainDiv: HTMLElement
    folderdivs = new Map<string, HTMLElement>()
    contentdivs = new Map<string, HTMLElement>()
    contentlines = new Map<string, HTMLElement>()
    selectedSpan: HTMLSpanElement | null = null
    //点击文件夹事件，opened表示点了之后是打开还是关闭
    OnClickFolder: (this: VB6FileListBuilder, name: string, opened: boolean) => void = function () { }
    //点击文件夹里的文件事件
    OnClickItem: (this: VB6FileListBuilder, folder: string, name: string, clicks: number) => void = function () { }
    lastUsedIcon: VB6ContentIcon = VB6ContentIcon.Class
    AddFolder(title: string, opened: boolean, icon?: VB6ContentIcon) {
        const OpenedFolderIMG = "url(\"/vb6img/openedfolder.webp\")"
        const ClosedFolderIMG = "url(\"/vb6img/closedfolder.webp\")"
        if (this.folderdivs.has(title)) {
            console.error("重复添加文件夹，拒绝：", title)
            return
        }
        let imgname = ""
        if (icon == null) {
            while (true) {
                icon = RandomChoose([VB6ContentIcon.Class, VB6ContentIcon.Form, VB6ContentIcon.Module]) as VB6ContentIcon
                if (icon != this.lastUsedIcon) {
                    break
                }
            }
        }
        switch (icon) {
            case VB6ContentIcon.Form:
                imgname = "form"
                break
            case VB6ContentIcon.Class:
                imgname = "class"
                break
            case VB6ContentIcon.Module:
                imgname = "module"
                break
            default:
                console.error("VB6FileListBuilder 无法识别的图标名字：", icon, title)
                return
        }
        this.lastUsedIcon = icon
        let topdiv = document.createElement("div")
        if (opened) {
            topdiv.setAttribute("open", "open")
            topdiv.style.backgroundImage = OpenedFolderIMG
        } else {
            topdiv.setAttribute("open", "0")
            topdiv.style.backgroundImage = ClosedFolderIMG
        }
        topdiv.style.backgroundRepeat = "no-repeat"
        topdiv.style.backgroundPosition = "0px 3px"
        topdiv.style.height = "17px"
        topdiv.style.paddingLeft = "34px"
        topdiv.style.fontSize = "15px"
        topdiv.style.marginTop = "2px"
        topdiv.style.position = "relative"
        topdiv.style.zIndex = "2"
        this.mainDiv.appendChild(topdiv)
        this.folderdivs.set(title, topdiv)
        let span = document.createElement("span")
        topdiv.appendChild(span)
        span.style.userSelect = "none"
        span.style.whiteSpace = "nowrap"
        span.innerText = title
        let content = document.createElement("div")
        if (opened) {
            content.style.display = "block"
        } else {
            content.style.display = "none"
        }
        content.style.marginLeft = "23px"
        content.setAttribute("itemicon", imgname)
        this.mainDiv.appendChild(content)
        let linebox = document.createElement("div")
        linebox.style.position = "relative"
        let line = document.createElement("div")
        line.style.width = "1px"
        line.style.height = "20px"
        line.style.position = "absolute"
        line.style.borderLeft = "1px dotted rgb(109,109,109)"
        line.style.marginTop = "-5px"
        content.appendChild(linebox)
        linebox.appendChild(line)
        this.contentlines.set(title, line)
        this.contentdivs.set(title, content)
        let me = this
        topdiv.addEventListener("click", function (this, ev) {
            if (ev.detail > 1) { return }
            let opened = this.getAttribute("open") == "open"
            if (opened) {
                this.setAttribute("open", "0")
                content.style.display = "none"
                topdiv.style.backgroundImage = ClosedFolderIMG
            } else {
                this.setAttribute("open", "open")
                topdiv.style.backgroundImage = OpenedFolderIMG
                content.style.display = "block"
            }
            me.RefreshLine()
            opened = !opened
            console.log("打开或关闭了vb6文件夹：", title, opened)
            me.OnClickFolder(title, opened)
            me.SetSelectedSpan(span)
        })
        this.RefreshLine()
    }
    AddContent(text: string, folder: string, onclick: (folder: string, text: string) => void = () => { }) {
        let ct = this.contentdivs.get(folder)
        if (ct == null) {
            console.error("找不到这个文件夹：", folder, text)
            return
        }
        let imgname = ct.getAttribute("itemicon")
        if (imgname == null) {
            console.error("这个内容div没有标记 itemicon：", folder, text, ct)
            return
        }
        let div = document.createElement("div")
        div.style.backgroundImage = "url('/vb6img/" + imgname + ".webp')"
        div.style.backgroundRepeat = "no-repeat"
        div.style.backgroundPosition = "1px 3px"
        div.style.height = "17px"
        div.style.paddingLeft = "30px"
        div.style.fontSize = "15px"
        div.style.marginTop = "2px"
        div.style.position = "relative"
        div.style.zIndex = "2"
        let span = document.createElement("span")
        span.innerText = text
        span.style.userSelect = "none"
        span.style.whiteSpace = "nowrap"
        ct.appendChild(div)
        div.appendChild(span)
        let me = this
        div.addEventListener("click", function (this, ev) {
            me.OnClickItem(folder, text, ev.detail)
            me.SetSelectedSpan(span)
            let clicks = 2
            if (window.innerWidth < window.innerHeight) {
                clicks = 1
            }
            if (ev.detail == clicks) {
                onclick(folder, text)
            }
            console.log("点击了vb6文件", folder, text, ev.detail)
        })
        this.RefreshLine()
    }
    SetSelectedSpan(sp: HTMLSpanElement | null) {
        if (this.selectedSpan != null) {
            this.selectedSpan.style.backgroundColor = ""
            this.selectedSpan.style.border = ""
            this.selectedSpan.style.color = "black"
        }
        if (sp != null) {
            sp.style.color = "white"
            sp.style.backgroundColor = "rgb(0,120,215)"
            sp.style.border = "1px dotted rgb(255,135,40)"
        }
        this.selectedSpan = sp
    }
    RefreshLine() {
        let me = this
        let height = 0
        me.folderdivs.forEach(function (v) {
            height += v.clientHeight
        })
        let lastcontentheight = 0
        me.contentdivs.forEach(function (v, k) {
            if (v.style.display != "none") {
                let h = v.clientHeight
                height += h
                lastcontentheight = h
                let line = me.contentlines.get(k)
                if (line == null) { return }
                if (v.innerText.length > 0) {
                    h -= 1
                } else {
                    h = 0
                }
                line.style.height = h.toFixed() + "px"
            } else {
                lastcontentheight = 0
            }
        })
        height -= lastcontentheight
        me.leftline.style.height = height.toFixed() + "px"
    }
}
