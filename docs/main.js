"use strict";
//　zindex调正，用add注册一个元素，然后元素被点击的时候会被设置为zIndex=9999，老的被点击的元素会变成1234
let IndexManager = {
    list: [],
    lastSelected: null,
    Add(e) {
        if (this.list.includes(e)) {
            return;
        }
        this.list.push(e);
        e.style.zIndex = "9999";
        let me = this;
        let func = function () {
            if (me.lastSelected != null) {
                me.lastSelected.style.zIndex = "1234";
            }
            e.style.zIndex = "9999";
            me.lastSelected = e;
        };
        func();
        e.addEventListener("mousedown", func);
    }
};
//　快速创建HTMLOptionElement
function CreateSelectOptionElement(title, value = "") {
    if (value.length < 1) {
        value = title;
    }
    let s = document.createElement("option");
    s.innerText = title;
    s.value = value;
    return s;
}
// 获取这个class的第一个元素，如果不存在就throw
function GetFirstElementByClass(c) {
    let es = document.getElementsByClassName(c);
    if (es.length < 1) {
        throw "网页不包含class:" + c;
    }
    let e = es[0];
    return e;
}
// 在新标签页打开链接
function OpenURL(url, newpage = false) {
    let a = document.createElement("a");
    a.href = url;
    if (newpage) {
        a.target = "_blank";
    }
    document.body.appendChild(a);
    console.log("打开链接：", a.href, newpage);
    a.click();
    a.remove();
}
// 从数字范围里随便选一个整数
function RandomInt(a, b) {
    if (b < a) {
        let tp = a;
        a = b;
        b = tp;
    }
    let rnd = Math.round(Math.random() * (b - a) + a);
    return rnd;
}
// 从数组里随便选一个
function RandomChoose(array) {
    let l = array.length;
    if (l < 1) {
        return null;
    }
    if (l == 1) {
        return array[0];
    }
    let rnd = RandomInt(0, l - 1);
    return array[rnd];
}
// 复制一个数组
function CloneArray(a) {
    let b = [];
    a.forEach(function (v) {
        b.push(v);
    });
    return b;
}
// 获取链接的请求组合
function getQueryValues(url = "") {
    if (url.length < 2) {
        url = document.URL;
    }
    let map = new Map();
    if (url.indexOf("?") < 0)
        return map;
    let str = url.split("?")[1];
    if (str.indexOf("&") < 0) {
        if (str.indexOf("=") < 0)
            return map;
        let arr = str.split("=");
        map.set(arr[0], decodeURI(arr[1]));
        return map;
    }
    let ls = str.split("&");
    for (let i = 0; i < ls.length; i++) {
        let arr = ls[i].split("=");
        if (arr[0].length < 1) {
            continue;
        }
        map.set(arr[0], decodeURI(arr[1]));
    }
    return map;
}
//设置链接的后部分参数，但不会重新加载页面
function SetQueryURL(uu) {
    let url = location.protocol + "//" + location.host + location.pathname + uu;
    if (location.href != uu) {
        history.pushState("", "", url);
    }
}
//获得鼠标点击位置相对于这个元素的左上角的坐标，返回一个数组，第一个是x，第二个是y
function GetMouseOffsetOfElement(div, ev) {
    let realX = 0, realY = 0;
    let he = div;
    while (he != null) {
        realX += he.offsetLeft;
        realY += he.offsetTop;
        he = he.offsetParent;
    }
    realX = ev.clientX - realX;
    realY = ev.clientY - realY;
    return [realX, realY];
}
//检测这个点的坐标是否在这个长方形里面，点数组是[x,y] ，长方形数组是[x,y,width,height]
function IsPointInRect(point, rect) {
    if (point.length != 2 || rect.length != 4) {
        console.error("IsPointInRect 错误的输入： ", point, rect);
        return false;
    }
    if (point[0] >= rect[0] && point[0] <= rect[0] + rect[2]) {
        if (point[1] >= rect[1] && point[1] <= rect[1] + rect[3]) {
            return true;
        }
    }
    return false;
}
// 跳转到搜索页面，只在指定页面生效
function GoSearch(engine) {
    let input = document.getElementById("inputsearch");
    let str = input.value;
    str = str.trim();
    if (str.length < 1) {
        return;
    }
    str = encodeURI(str);
    let url = "";
    switch (engine) {
        case "github":
            url = "https://github.com/gordonwalkedby/gordonwalkedby.github.io/search?q=" + str;
            break;
        case "google":
            url = "https://www.google.com/search?newwindow=1&safe=strict&q=" + str + "+site%3Awalkedby.com";
            break;
        case "duck":
            url = "https://duckduckgo.com/?q=" + str + "+site%3Awalkedby.com";
            break;
        case "bing":
            url = "https://cn.bing.com/search?q=" + str + "+site%3Awalkedby.com";
            break;
        default:
            break;
    }
    if (url.length > 5) {
        OpenURL(url, true);
    }
}
let OpenPost = function (id) {
    location.href = "/?po=" + id;
};
function ChangeCodeAreaHTML(c) {
    let alist = c.getElementsByTagName("a");
    for (let i = 0; i < alist.length; i++) {
        let ae = alist[i];
        let host1 = ae.href.includes(location.host);
        if (ae.target.length < 1 && host1 == false) {
            ae.target = "_blank";
        }
        if (host1 && ae.href.includes("/?po=")) {
            let reg = new RegExp("/?po=(.+?)[&|#]", "gim");
            let results = reg.exec(ae.href + "&");
            if (results != null) {
                let pot = results[1];
                ae.href = "javascript:void";
                ae.addEventListener("click", function () {
                    OpenPost(pot);
                });
            }
        }
    }
    let imglist = c.getElementsByTagName("img");
    for (let i = 0; i < imglist.length; i++) {
        let img = imglist[i];
        if (img.alt.length < 1) {
            img.alt = "【图片加载失败 " + img.src + "】";
        }
    }
    let precodes = c.querySelectorAll("pre code");
    for (let i = 0; i < precodes.length; i++) {
        let pre = precodes[i];
        hljs.highlightBlock(pre);
    }
    let scripts = c.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
        let sc = scripts[i];
        if (sc.src.length > 2) {
            let x = new XMLHttpRequest();
            x.open("GET", sc.src);
            x.timeout = 5000;
            x.onloadend = function () {
                if (x.status == 200) {
                    let newsc = document.createElement("script");
                    newsc.innerHTML = x.responseText;
                    document.body.appendChild(newsc);
                }
                else {
                    console.error("无法加载这个脚本", sc.src);
                }
            };
            x.send();
        }
        else {
            let newsc = document.createElement("script");
            newsc.innerHTML = sc.innerHTML;
            document.body.appendChild(newsc);
        }
    }
}
var VB6ContentIcon;
(function (VB6ContentIcon) {
    VB6ContentIcon[VB6ContentIcon["Form"] = 0] = "Form";
    VB6ContentIcon[VB6ContentIcon["Module"] = 1] = "Module";
    VB6ContentIcon[VB6ContentIcon["Class"] = 2] = "Class";
})(VB6ContentIcon || (VB6ContentIcon = {}));
class VB6FileListBuilder {
    //请使用 #filelistItems 对应的那种 div
    constructor(div) {
        this.folderdivs = new Map();
        this.contentdivs = new Map();
        this.contentlines = new Map();
        this.selectedSpan = null;
        //点击文件夹事件，opened表示点了之后是打开还是关闭
        this.OnClickFolder = function () { };
        //点击文件夹里的文件事件
        this.OnClickItem = function () { };
        this.lastUsedIcon = VB6ContentIcon.Class;
        this.mainDiv = div;
        let linebox = document.createElement("div");
        linebox.style.position = "relative";
        let line = document.createElement("div");
        line.style.width = "1px";
        line.style.height = "1px";
        line.style.position = "absolute";
        line.style.marginLeft = "4px";
        line.style.borderLeft = "1px dotted rgb(109,109,109)";
        line.style.marginTop = "-2px";
        div.appendChild(linebox);
        linebox.appendChild(line);
        this.leftline = line;
    }
    AddFolder(title, opened, icon) {
        const OpenedFolderIMG = "url(\"/vb6img/openedfolder.png\")";
        const ClosedFolderIMG = "url(\"/vb6img/closedfolder.png\")";
        if (this.folderdivs.has(title)) {
            console.error("重复添加文件夹，拒绝：", title);
            return;
        }
        let imgname = "";
        if (icon == null) {
            while (true) {
                icon = RandomChoose([VB6ContentIcon.Class, VB6ContentIcon.Form, VB6ContentIcon.Module]);
                if (icon != this.lastUsedIcon) {
                    break;
                }
            }
        }
        switch (icon) {
            case VB6ContentIcon.Form:
                imgname = "form";
                break;
            case VB6ContentIcon.Class:
                imgname = "class";
                break;
            case VB6ContentIcon.Module:
                imgname = "module";
                break;
            default:
                console.error("VB6FileListBuilder 无法识别的图标名字：", icon, title);
                return;
        }
        this.lastUsedIcon = icon;
        let topdiv = document.createElement("div");
        if (opened) {
            topdiv.setAttribute("open", "open");
            topdiv.style.backgroundImage = OpenedFolderIMG;
        }
        else {
            topdiv.setAttribute("open", "0");
            topdiv.style.backgroundImage = ClosedFolderIMG;
        }
        topdiv.style.backgroundRepeat = "no-repeat";
        topdiv.style.backgroundPosition = "0px 3px";
        topdiv.style.height = "17px";
        topdiv.style.paddingLeft = "34px";
        topdiv.style.fontSize = "15px";
        topdiv.style.marginTop = "2px";
        topdiv.style.position = "relative";
        topdiv.style.zIndex = "2";
        this.mainDiv.appendChild(topdiv);
        this.folderdivs.set(title, topdiv);
        let span = document.createElement("span");
        topdiv.appendChild(span);
        span.style.userSelect = "none";
        span.style.whiteSpace = "nowrap";
        span.innerText = title;
        let content = document.createElement("div");
        if (opened) {
            content.style.display = "block";
        }
        else {
            content.style.display = "none";
        }
        content.style.marginLeft = "23px";
        content.setAttribute("itemicon", imgname);
        this.mainDiv.appendChild(content);
        let linebox = document.createElement("div");
        linebox.style.position = "relative";
        let line = document.createElement("div");
        line.style.width = "1px";
        line.style.height = "20px";
        line.style.position = "absolute";
        line.style.borderLeft = "1px dotted rgb(109,109,109)";
        line.style.marginTop = "-5px";
        content.appendChild(linebox);
        linebox.appendChild(line);
        this.contentlines.set(title, line);
        this.contentdivs.set(title, content);
        let me = this;
        topdiv.addEventListener("click", function (ev) {
            if (ev.detail > 1) {
                return;
            }
            let opened = this.getAttribute("open") == "open";
            if (opened) {
                this.setAttribute("open", "0");
                content.style.display = "none";
                topdiv.style.backgroundImage = ClosedFolderIMG;
            }
            else {
                this.setAttribute("open", "open");
                topdiv.style.backgroundImage = OpenedFolderIMG;
                content.style.display = "block";
            }
            me.RefreshLine();
            opened = !opened;
            console.log("打开或关闭了vb6文件夹：", title, opened);
            me.OnClickFolder(title, opened);
            me.SetSelectedSpan(span);
        });
        this.RefreshLine();
    }
    AddContent(text, folder, onclick = () => { }) {
        let ct = this.contentdivs.get(folder);
        if (ct == null) {
            console.error("找不到这个文件夹：", folder, text);
            return;
        }
        let imgname = ct.getAttribute("itemicon");
        if (imgname == null) {
            console.error("这个内容div没有标记 itemicon：", folder, text, ct);
            return;
        }
        let div = document.createElement("div");
        div.style.backgroundImage = "url('/vb6img/" + imgname + ".png')";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "1px 3px";
        div.style.height = "17px";
        div.style.paddingLeft = "30px";
        div.style.fontSize = "15px";
        div.style.marginTop = "2px";
        div.style.position = "relative";
        div.style.zIndex = "2";
        let span = document.createElement("span");
        span.innerText = text;
        span.style.userSelect = "none";
        span.style.whiteSpace = "nowrap";
        ct.appendChild(div);
        div.appendChild(span);
        let me = this;
        div.addEventListener("click", function (ev) {
            me.OnClickItem(folder, text, ev.detail);
            me.SetSelectedSpan(span);
            let clicks = 2;
            if (window.innerWidth < window.innerHeight) {
                clicks = 1;
            }
            if (ev.detail == clicks) {
                onclick(folder, text);
            }
            console.log("点击了vb6文件", folder, text, ev.detail);
        });
        this.RefreshLine();
    }
    SetSelectedSpan(sp) {
        if (this.selectedSpan != null) {
            this.selectedSpan.style.backgroundColor = "";
            this.selectedSpan.style.border = "";
            this.selectedSpan.style.color = "black";
        }
        if (sp != null) {
            sp.style.color = "white";
            sp.style.backgroundColor = "rgb(0,120,215)";
            sp.style.border = "1px dotted rgb(255,135,40)";
        }
        this.selectedSpan = sp;
    }
    RefreshLine() {
        let me = this;
        let height = 0;
        me.folderdivs.forEach(function (v) {
            height += v.clientHeight;
        });
        let lastcontentheight = 0;
        me.contentdivs.forEach(function (v, k) {
            if (v.style.display != "none") {
                let h = v.clientHeight;
                height += h;
                lastcontentheight = h;
                let line = me.contentlines.get(k);
                if (line == null) {
                    return;
                }
                if (v.innerText.length > 0) {
                    h -= 1;
                }
                else {
                    h = 0;
                }
                line.style.height = h.toFixed() + "px";
            }
            else {
                lastcontentheight = 0;
            }
        });
        height -= lastcontentheight;
        me.leftline.style.height = height.toFixed() + "px";
    }
}
/// <reference path = "VB6FileListBuilder.ts" />
/// <reference path = "Helpers.ts" />
class VB6CodeFormBuilder {
    constructor(title, icon) {
        this.OnClose = () => { };
        this.title = title;
        let maindiv = document.createElement("div");
        maindiv.className = "winform";
        document.body.appendChild(maindiv);
        let ttdiv = document.createElement("div");
        ttdiv.innerText = title;
        let imgname = "";
        if (icon == null) {
            icon = RandomChoose([VB6ContentIcon.Class, VB6ContentIcon.Form, VB6ContentIcon.Module]);
        }
        switch (icon) {
            case VB6ContentIcon.Form:
                imgname = "code";
                break;
            case VB6ContentIcon.Class:
                imgname = RandomChoose(["code", "module2"]);
                break;
            case VB6ContentIcon.Module:
                imgname = "module2";
                break;
            default:
                console.error("VB6CodeFormBuilder 无法识别的图标名字：", icon, title);
                throw "VB6CodeFormBuilder 无法识别的图标名字";
        }
        ttdiv.className = "winformtitle";
        ttdiv.style.backgroundImage = "url(\"vb6img/" + imgname + ".png\")";
        this.titleDiv = ttdiv;
        maindiv.appendChild(ttdiv);
        let img = document.createElement("img");
        img.src = "/vb6img/3buttons.png";
        img.className = "winform3buttons";
        ttdiv.appendChild(img);
        let inside = document.createElement("div");
        inside.className = "winforminside";
        maindiv.appendChild(inside);
        let select1 = document.createElement("select");
        select1.className = "winformselect winborder2";
        this.leftSelectOption = CreateSelectOptionElement("Class");
        select1.add(this.leftSelectOption);
        inside.appendChild(select1);
        let select2 = document.createElement("select");
        select2.className = "winformselect winborder2";
        select2.add(CreateSelectOptionElement("欢迎阅读"));
        inside.appendChild(select2);
        maindiv.appendChild(inside);
        this.RightSelectMenu = select2;
        this.maindiv = maindiv;
        let bdiv = document.createElement("div");
        bdiv.className = "winformcodeareaborder winborder2";
        inside.appendChild(bdiv);
        let codearea = document.createElement("div");
        codearea.className = "winformcodearea";
        bdiv.appendChild(codearea);
        maindiv.style.width = "300px";
        this.CodeArea = codearea;
        dragElement(maindiv, ttdiv);
        SetElementResizable(maindiv, 300, 300);
        let me = this;
        maindiv.onresize = function () {
            me.AfterResize();
        };
        IndexManager.Add(maindiv);
        img.addEventListener("click", function (ev) {
            let x = maindiv.offsetLeft + maindiv.offsetWidth - ev.clientX - 8;
            if (x <= 30) {
                console.log("关闭了窗口：", me.title);
                me.OnClose();
                maindiv.remove();
            }
            else if (x <= 60) {
                let ques = getQueryValues();
                let post = ques.get("po") || "";
                location.href = "/max.html?po=" + post;
            }
        });
        select2.addEventListener("change", function () {
            console.log("修改了选择项：", this.value);
            let h1s = codearea.getElementsByTagName("h1");
            for (let i = 0; i < h1s.length; i++) {
                let h1 = h1s[i];
                if (h1.innerText == this.value) {
                    codearea.scroll({ left: 0, top: h1.offsetTop - maindiv.offsetHeight / 2 });
                    console.log("窗口内滚动到了：", h1.offsetTop, h1);
                    return;
                }
            }
            h1s = codearea.getElementsByTagName("h2");
            for (let i = 0; i < h1s.length; i++) {
                let h1 = h1s[i];
                if (h1.innerText == this.value) {
                    codearea.scroll({ left: 0, top: h1.offsetTop - maindiv.offsetHeight / 2 });
                    console.log("窗口内滚动到了：", h1.offsetTop, h1);
                    return;
                }
            }
        });
        this.AfterResize();
    }
    AfterResize() {
        this.CodeArea.style.height = (this.maindiv.offsetHeight - this.titleDiv.offsetHeight - this.RightSelectMenu.offsetHeight - 20).toFixed() + "px";
    }
    SetH1H2Items() {
        let titles = [];
        let h1s = this.CodeArea.getElementsByTagName("h1");
        for (let i = 0; i < h1s.length; i++) {
            let h1 = h1s[i];
            titles.push(h1);
        }
        h1s = this.CodeArea.getElementsByTagName("h2");
        for (let i = 0; i < h1s.length; i++) {
            let h1 = h1s[i];
            titles.push(h1);
        }
        let me = this;
        if (titles.length < 1) {
            return;
        }
        titles.sort(function (a, b) {
            let ah = a.offsetTop;
            let bh = b.offsetTop;
            if (ah > bh) {
                return 1;
            }
            if (ah < bh) {
                return -1;
            }
            return 0;
        });
        me.RightSelectMenu.innerHTML = "";
        titles.forEach(function (h1) {
            let txt = h1.innerText;
            if (h1.tagName.toLowerCase() == "h2") {
                txt = " - " + txt;
            }
            let e = CreateSelectOptionElement(txt, h1.innerText);
            me.RightSelectMenu.add(e);
        });
    }
}
//来源： https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(element, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.style.userSelect = "none";
    header.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = Math.min(Math.max(element.offsetTop - pos2, 1), window.innerHeight - element.offsetHeight).toFixed() + "px";
        element.style.left = Math.min(Math.max(element.offsetLeft - pos1, 1), window.innerWidth - element.offsetWidth).toFixed() + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
//来源　https://htmldom.dev/make-a-resizable-element/
function SetElementResizable(ele, minX, minY) {
    let r1 = document.createElement("div");
    r1.className = "resizer-r";
    ele.appendChild(r1);
    let r2 = document.createElement("div");
    r2.className = "resizer-b";
    ele.appendChild(r2);
    // The current position of mouse
    let x = 0;
    let y = 0;
    // The dimension of the element
    let w = 0;
    let h = 0;
    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        // Calculate the dimension of element
        const styles = window.getComputedStyle(ele);
        w = parseInt(styles.width, 10);
        h = parseInt(styles.height, 10);
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;
        let fx = Math.min(Math.max(w + dx, minX), window.innerWidth);
        let fy = Math.min(Math.max(h + dy, minY), window.innerHeight);
        ele.dispatchEvent(new Event("resize"));
        // Adjust the dimension of element
        ele.style.width = `${fx}px`;
        ele.style.height = `${fy}px`;
    };
    const mouseUpHandler = function () {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    r1.onmousedown = mouseDownHandler;
    r2.onmousedown = mouseDownHandler;
}
/// <reference path = "Helpers.ts" />
/// <reference path = "resizeElement.ts" />
/// <reference path = "dragElement.ts" />
/// <reference path = "VB6FileListBuilder.ts" />
/// <reference path = "VB6CodeFormBuilder.ts" />
(function () {
    if (myIndexType != 0) {
        return;
    }
    let openedForms = new Map();
    let triedurls = [];
    function RandomAddOrMinus(vv, add) {
        let rnd = Math.random();
        if (rnd >= 0.67) {
            return vv + add;
        }
        if (rnd <= 0.33) {
            return vv - add;
        }
        return vv;
    }
    OpenPost = function (id) {
        if (triedurls.includes(id)) {
            console.error("链接已经在请求当中，避免同时二次访问", id);
            return;
        }
        let x = new XMLHttpRequest();
        x.open("GET", "/posts/" + id + ".json");
        x.timeout = 5000;
        triedurls.push(id);
        x.onloadend = function () {
            let pid = triedurls.indexOf(id);
            if (pid >= 0) {
                triedurls.splice(pid, 1);
            }
            let err = "";
            if (this.status == 200) {
                let jj = this.responseText;
                try {
                    let obj = JSON.parse(jj);
                    if (obj.Title.length > 0 && obj.Time > 2000000 && obj.Content.length > 0) {
                        let old = openedForms.get(obj.Title);
                        if (old != null) {
                            old.maindiv.remove();
                        }
                        let x = new VB6CodeFormBuilder(obj.Title);
                        x.leftSelectOption.innerText = id;
                        x.CodeArea.innerHTML = obj.Content;
                        console.log("加载文章：", id);
                        let vv = window.innerWidth * 0.1;
                        vv = RandomAddOrMinus(vv, 15);
                        x.maindiv.style.left = vv.toFixed() + "px";
                        vv = window.innerHeight * 0.1;
                        vv = RandomAddOrMinus(vv, 15);
                        x.maindiv.style.top = vv.toFixed() + "px";
                        x.maindiv.style.height = (window.innerHeight * 0.8).toFixed() + "px";
                        x.maindiv.style.width = (window.innerWidth * 0.8).toFixed() + "px";
                        let openview = function () {
                            SetQueryURL("?po=" + id);
                            document.title = x.title + " - 戈登走過去的博客";
                        };
                        x.maindiv.addEventListener("mouseup", function () {
                            openview();
                        });
                        x.OnClose = function () {
                            SetQueryURL("");
                            document.title = "戈登走過去的博客";
                        };
                        openview();
                        ChangeCodeAreaHTML(x.CodeArea);
                        x.SetH1H2Items();
                        x.AfterResize();
                        openedForms.set(obj.Title, x);
                        return;
                    }
                    else {
                        throw "信息不完整";
                    }
                }
                catch (ex) {
                    err = "请求打开文章失败，传输内容有误：\n" + ex + "\n" + id;
                }
            }
            else if (this.status == 0) {
                err = "获取文章内容超时，你网络真的不太行。\n本网站目前依赖 cloudflare CDN。\n" + id;
            }
            else if (this.status == 404) {
                err = "对不起，你要获取的文章已经消失了。404了。\n 但是也可能它从来就不曾存在过。\n" + id;
            }
            else {
                err = "请求打开文章失败，奇怪的错误：\n" + id + "\n" + this.status;
            }
            if (err.length > 0) {
                alert(err);
                console.error(err);
            }
        };
        x.send();
    };
    let filelist = GetFirstElementByClass("filelist");
    dragElement(filelist, GetFirstElementByClass("filelistHeader"));
    IndexManager.Add(filelist);
    let filelistItems = GetFirstElementByClass("filelistItems");
    filelistItems.innerHTML = "";
    let vb6b = new VB6FileListBuilder(filelistItems);
    setInterval(() => {
        if (filelist.offsetWidth > 405) {
            filelist.style.width = "400px";
        }
    }, 400);
    (function () {
        let tt = "我的博客";
        vb6b.AddFolder(tt, true);
        vb6b.AddContent("首页", tt, function () {
            OpenURL("/");
        });
        vb6b.AddContent("RSS订阅", tt, function () {
            OpenPost("rsss");
        });
        vb6b.AddContent("关于我", tt, function () {
            OpenPost("about");
        });
        vb6b.AddContent("搜索本博客", tt, function () {
            OpenPost("search");
        });
        vb6b.AddContent("用money鼓励戈登登", tt, function () {
            OpenPost("donate");
        });
        let Sayings = [
            "如果你不喜欢抑郁症患者，请你关闭本网页。",
            "性别就像国籍，也许很难改变，但是应该可以改变。通常一个“叛国者”会被大家唾弃。",
            "一夫一妻制比较好。嗯。。。。",
            "如果是 iPhone，我可以忍受低端机，如果是 Android，那是不能忍的。",
            "你知道吗？这个对话框的其实是一张图片，哈哈，我不能写超过70个字，否则会漏出来。",
            "虽然这个博客主题是VB6的，但是你现在让我用VB6写个程序我已经啥都写不出来了。我都忘记了vb6不能定义和赋值在同一行。",
            "如果你想当一个职业UP主，你三个月内起码10万粉丝。戈登我做了大概6年的视频了，2万不到粉。我不可能做一个职业UP。",
            "Steam版中文半条命1，删除valve_schinese里面的titles.txt文件可以提升游戏体验。",
            "唉，为什么戈登碰见的大部分MTF都比戈登高。",
            "我喜欢Windows下的谷歌拼音，虽然它和java的GUI有兼容性问题，经常在java GUI退出的时候，让GUI崩溃。",
            "姐姐，对不起。",
            "搞定了吗，尤里？不，总理大人，一切才刚刚开始。",
            "千万不要服毒自杀，消化系统实在太漫长太痛苦了。",
            "喵呜。蹭蹭姐姐。",
            "我们的产品全球有售，注：不包括中华人民共和国",
            "Exterminate!"
        ];
        let usedSayings = [];
        vb6b.AddContent("神秘发言", tt, function () {
            if (Sayings.length < 1) {
                if (usedSayings.length > 0) {
                    Sayings = CloneArray(usedSayings);
                    console.log("好消息，你成功读完了每一句话。");
                }
                else {
                    alert("我本来会在这里弹一句话，但是我这里没有一句话可以弹出。这很意外。");
                    return;
                }
            }
            let index = RandomInt(0, Sayings.length - 1);
            let str = Sayings[index];
            usedSayings.push(str);
            Sayings.splice(index, 1);
            alert(str);
            return;
        });
        vb6b.AddContent("我的软件作品列表", tt, function () {
            OpenPost("mysoftwares");
        });
        tt = "联系我";
        vb6b.AddFolder(tt, false);
        vb6b.AddContent("直接给我留言", tt, function () {
            OpenURL("https://shimo.im/forms/WgWqrRWWjTYRDqCR/fill", true);
        });
        vb6b.AddContent("Twitter", tt, function () {
            OpenURL("https://twitter.com/GDZGQ", true);
        });
        vb6b.AddContent("微博", tt, function () {
            OpenURL("https://weibo.com/5977985000/profile", true);
        });
        vb6b.AddContent("GitHub", tt, function () {
            OpenURL("https://github.com/gordonwalkedby", true);
        });
        vb6b.AddContent("GitLab", tt, function () {
            OpenURL("https://gitlab.com/gordonwalkedby", true);
        });
        vb6b.AddContent("Gitee", tt, function () {
            OpenURL("https://gitee.com/walkedby", true);
        });
        vb6b.AddContent("bilibili", tt, function () {
            OpenURL("https://space.bilibili.com/4523834", true);
        });
        vb6b.AddContent("acfun", tt, function () {
            OpenURL("https://www.acfun.cn/u/13194917", true);
        });
        vb6b.AddContent("YouTube", tt, function () {
            OpenURL("https://www.youtube.com/channel/UCpnf5wTnI9br8IxJbRV5Tew", true);
        });
        tt = "我的好朋友们";
        vb6b.AddFolder(tt, true);
        vb6b.AddContent("技术宅的结界", tt, function () { OpenURL("https://www.0xaa55.com/", true); });
        vb6b.AddContent("AceSheep", tt, function () { OpenURL("https://blog.acesheep.com/", true); });
        vb6b.AddContent("Sonic 853", tt, function () { OpenURL("https://blog.853lab.com/", true); });
    })();
    (function () {
        let ques = getQueryValues();
        let post = ques.get("po");
        if (post != null && post.length > 0) {
            OpenPost(post);
        }
        hljs.initHighlightingOnLoad();
    })();
    
(function () { let  tt = 'error';
tt = "2021年 03月";vb6b.AddFolder(tt, true);
vb6b.AddContent("简单介绍目前可用的免费静态站部署平台（Pages 服务）", tt,function (){OpenPost("pages");});
tt = "2021年 02月";vb6b.AddFolder(tt, true);
vb6b.AddContent("【不再更新】服毒自杀的我", tt,function (){OpenPost("fdzsdw");});
vb6b.AddContent("从微软官方直接下载win10镜像的办法（不依赖媒体创建工具）", tt,function (){OpenPost("win10iso");});
vb6b.AddContent("我曾经两次改变B站的UI与设计", tt,function (){OpenPost("change");});
vb6b.AddContent("【不再更新】Steam好友与聊天记录器", tt,function (){OpenPost("steamfriendsmonitor");});
tt = "2021年 01月";vb6b.AddFolder(tt, true);
vb6b.AddContent("Steam 聊天记录导出脚本", tt,function (){OpenPost("steamchatlogexport");});
vb6b.AddContent("为什么我讨厌我的父母（碎碎念3）", tt,function (){OpenPost("ssn3");});
vb6b.AddContent("张小龙生成器【不再更新】", tt,function (){OpenPost("zxlgen");});
vb6b.AddContent("碎碎念2", tt,function (){OpenPost("ssn2");});
vb6b.AddContent("我想自杀（碎碎念1）", tt,function (){OpenPost("ssn");});
tt = "2020年 12月";vb6b.AddFolder(tt, true);
vb6b.AddContent("那些离开戈登的人", tt,function (){OpenPost("why");});
vb6b.AddContent("讲几句关于我的租房室友", tt,function (){OpenPost("someguy");});
vb6b.AddContent("实现奥克斯售后/苏宁售后与MYSQL连接【不再更新】", tt,function (){OpenPost("porkball");});
vb6b.AddContent("简单介绍微软官方谷歌内核.NET浏览器控件WebView2", tt,function (){OpenPost("webview2");});
vb6b.AddContent("VB.NET与C#的语法比较", tt,function (){OpenPost("vbcs");});
tt = "2020年 11月";vb6b.AddFolder(tt, true);
vb6b.AddContent("幻想：2050年的跨性别", tt,function (){OpenPost("2050trans");});
vb6b.AddContent("高考全校第一是怎么样的体验", tt,function (){OpenPost("no1");});
tt = "2020年 10月";vb6b.AddFolder(tt, true);
vb6b.AddContent("记录一次跳楼自杀被阻止的经历", tt,function (){OpenPost("jump");});
vb6b.AddContent("大学舒适度评分自测表【不再更新】", tt,function (){OpenPost("university");});
tt = "2020年 08月";vb6b.AddFolder(tt, true);
vb6b.AddContent("Steam创意工坊列出工具【不再更新】", tt,function (){OpenPost("steamworkshoplistout");});
tt = "2020年 07月";vb6b.AddFolder(tt, true);
vb6b.AddContent("我在找工作过程中遇到的性别问题", tt,function (){OpenPost("genderandjob");});
vb6b.AddContent("记录一次自杀失败的经历", tt,function (){OpenPost("lhb");});
tt = "2020年 06月";vb6b.AddFolder(tt, true);
vb6b.AddContent("全校第一的我为什么选择了退学", tt,function (){OpenPost("mythoughts");});
tt = "2020年 04月";vb6b.AddFolder(tt, true);
vb6b.AddContent("把日历文件导入苹果日历的办法", tt,function (){OpenPost("icloudcalendarimport");});
vb6b.AddContent("抑郁症怎么看医生", tt,function (){OpenPost("depression");});
tt = "2020年 03月";vb6b.AddFolder(tt, true);
vb6b.AddContent("手机任务管理器重制版【不再更新】", tt,function (){OpenPost("runtaskmanageronyourphone");});
vb6b.AddContent("在 .NET 5.0 中已计划的 VB 支持情况概述", tt,function (){OpenPost("vbindotnet5");});
tt = "2020年 02月";vb6b.AddFolder(tt, true);
vb6b.AddContent("B站投稿封面效果预览工具【不再更新】", tt,function (){OpenPost("bilibilicoverpreview");});
tt = "2020年 01月";vb6b.AddFolder(tt, true);
vb6b.AddContent("中国邮政 国内、港澳台、国际平邮邮费 留档", tt,function (){OpenPost("chinapostprices");});
vb6b.AddContent("电话流量套餐筛选排列工具【不再更新】", tt,function (){OpenPost("phone");});
vb6b.AddContent("Surface Book 一代安装最新版显卡驱动的办法", tt,function (){OpenPost("surfacebooklatestgpudriver");});
vb6b.AddContent("描述性文本转 ICS 文件在线转换器【不再更新】", tt,function (){OpenPost("icsbatch");});
tt = "2019年 12月";vb6b.AddFolder(tt, true);
vb6b.AddContent("使用 GitHub Actions 编译 .NET Framework 程序", tt,function (){OpenPost("dotnetframeworkingithubactions");});
tt = "2019年 10月";vb6b.AddFolder(tt, true);
vb6b.AddContent("用来测试网络的网址收藏", tt,function (){OpenPost("webtest");});
vb6b.AddContent("手机任务管理器【不再更新】", tt,function (){OpenPost("remotetaskmanager");});
tt = "2019年 09月";vb6b.AddFolder(tt, true);
vb6b.AddContent("在 Windows 上给 Git SSH 设置代理", tt,function (){OpenPost("sshwindowsproxy");});
tt = "2019年 08月";vb6b.AddFolder(tt, true);
vb6b.AddContent("使用第三代ID 的 STEAM 个人主页链接", tt,function (){OpenPost("steamid3");});
vb6b.AddContent("Steam 好友检查器【不再更新】", tt,function (){OpenPost("steamfriendschecker");});
vb6b.AddContent("Linux 主机与 KVM 虚拟机内 Windows 进行 FTP 文件传输的配置说明", tt,function (){OpenPost("kvmwindows");});
vb6b.AddContent("B站六级计算器【不再更新】", tt,function (){OpenPost("whenlv6");});
vb6b.AddContent("Steam正版GTA4存档导入的正确姿势", tt,function (){OpenPost("gtaivsavedgames");});
vb6b.AddContent("Steam 各国家区域的价格、锁区情况梗概", tt,function (){OpenPost("steam-countries");});
tt = "2019年 03月";vb6b.AddFolder(tt, true);
vb6b.AddContent("GMod使用半条命2中文配音的办法", tt,function (){OpenPost("gmodchinesevoice");});
tt = "2019年 02月";vb6b.AddFolder(tt, true);
vb6b.AddContent("使用 CPU-Z 来分享你的电脑配置信息", tt,function (){OpenPost("usecpuz");});
vb6b.AddContent("早期软件集合", tt,function (){OpenPost("oldsoftwares");});
tt = "2018年 11月";vb6b.AddFolder(tt, true);
vb6b.AddContent("我的起源开发笔记", tt,function (){OpenPost("sourcedevnotes");});
vb6b.AddContent(".NET HttpListener 监听局域网其他设备HTTP请求的说明", tt,function (){OpenPost("httplistneroverlan");});
tt = "2018年 08月";vb6b.AddFolder(tt, true);
vb6b.AddContent("Steam 社区的神奇保护机制", tt,function (){OpenPost("steamcommunitys");});
tt = "2018年 03月";vb6b.AddFolder(tt, true);
vb6b.AddContent("Telegram 贴纸包批量下载解决方案", tt,function (){OpenPost("tgsticks");});
tt = "2018年 02月";vb6b.AddFolder(tt, true);
vb6b.AddContent("GMod 传奇：《Haven》的诞生", tt,function (){OpenPost("gmod-stories-the-making-of-haven");});
tt = "2018年 01月";vb6b.AddFolder(tt, true);
vb6b.AddContent("在 VB.NET 里进行文件拖入和拖出的方法", tt,function (){OpenPost("how-to-drag-in-vb");});
vb6b.AddContent("我当素食者的故事", tt,function (){OpenPost("vegetarian");});
tt = "2017年 09月";vb6b.AddFolder(tt, true);
vb6b.AddContent("Movie Studio 14 Platinum 不 Platinum 的区别在哪里", tt,function (){OpenPost("vegasms14");});
tt = "2017年 06月";vb6b.AddFolder(tt, true);
vb6b.AddContent("给 Vegas \\ Movie Studio 新版安裝 Frameserver 插件的办法", tt,function (){OpenPost("vegasplugins");});
tt = "2017年 01月";vb6b.AddFolder(tt, true);
vb6b.AddContent("订阅 RSS", tt,function (){OpenPost("rsss");});
vb6b.AddContent("我的软件作品列表", tt,function (){OpenPost("mysoftwares");});
vb6b.AddContent("给戈登登MONEY！", tt,function (){OpenPost("donate");});
vb6b.AddContent("搜索本博客", tt,function (){OpenPost("search");});
vb6b.AddContent("沙盒测试页", tt,function (){OpenPost("sandbox");});
vb6b.AddContent("关于戈登走過去", tt,function (){OpenPost("about");});
})();

})();
(function () {
    if (myIndexType != 1) {
        return;
    }
    (function () {
        let inside = document.getElementById("inside");
        if (inside == null) {
            throw "#inside is null";
        }
        let ques = getQueryValues();
        let post = ques.get("po") || "";
        let but = document.getElementById("gobackHome");
        if (but == null) {
            throw "#gobackHome is null";
        }
        but.onclick = function () {
            location.href = "/?po=" + post;
        };
        if (post.length > 0) {
            let x = new XMLHttpRequest();
            x.open("GET", "/posts/" + post + ".json");
            x.timeout = 5000;
            x.onloadend = function () {
                if (inside == null) {
                    throw "#inside is null";
                }
                let err = "";
                if (this.status == 200) {
                    try {
                        let obj = JSON.parse(this.responseText);
                        inside.innerHTML = obj.Content;
                        document.title = obj.Title + " - 戈登走過去的博客";
                        ChangeCodeAreaHTML(inside);
                    }
                    catch (error) {
                        err = "加载文章出现意外：" + error;
                    }
                }
                else if (this.status == 0) {
                    err = "加载文章超时，你与服务器的连接可能太差了。 \n" + post;
                }
                else {
                    err = "连接出错：" + this.status.toFixed() + "\n" + post;
                }
                if (err.length > 0) {
                    inside.innerText = err;
                    alert(err);
                }
            };
            x.send();
        }
        else {
            location.href = "/";
        }
        hljs.initHighlightingOnLoad();
    })();
})();
