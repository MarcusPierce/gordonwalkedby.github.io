/// <reference path = "Helpers.ts" />
/// <reference path = "resizeElement.ts" />
/// <reference path = "dragElement.ts" />
/// <reference path = "VB6FileListBuilder.ts" />
/// <reference path = "VB6CodeFormBuilder.ts" />

(function () {
    if (myIndexType != 0) {
        return
    }

    let openedForms = new Map<string, VB6CodeFormBuilder>()
    let triedurls: string[] = []

    function RandomAddOrMinus(vv: number, add: number) {
        let rnd = Math.random()
        if (rnd >= 0.67) {
            return vv + add
        }
        if (rnd <= 0.33) {
            return vv - add
        }
        return vv
    }

    OpenPost = function (id: string) {
        if (triedurls.includes(id)) {
            console.error("链接已经在请求当中，避免同时二次访问", id)
            return
        }
        let x = new XMLHttpRequest()
        x.open("GET", "/posts/" + id + ".json")
        x.timeout = 5000
        triedurls.push(id)
        x.onloadend = function () {
            let pid = triedurls.indexOf(id)
            if (pid >= 0) {
                triedurls.splice(pid, 1)
            }
            let err = ""
            if (this.status == 200) {
                let jj = this.responseText
                try {
                    let obj = JSON.parse(jj) as BlogPost
                    if (obj.Title.length > 0 && obj.Time > 2000000 && obj.Content.length > 0) {
                        let old = openedForms.get(obj.Title)
                        if (old != null) {
                            old.maindiv.remove()
                        }
                        let x = new VB6CodeFormBuilder(obj.Title)
                        x.leftSelectOption.innerText = id
                        x.CodeArea.innerHTML = obj.Content
                        console.log("加载文章：", id)
                        let vv = window.innerWidth * 0.1
                        vv = RandomAddOrMinus(vv, 15)
                        x.maindiv.style.left = vv.toFixed() + "px"
                        vv = window.innerHeight * 0.1
                        vv = RandomAddOrMinus(vv, 15)
                        x.maindiv.style.top = vv.toFixed() + "px"
                        x.maindiv.style.height = (window.innerHeight * 0.8).toFixed() + "px"
                        x.maindiv.style.width = (window.innerWidth * 0.8).toFixed() + "px"
                        let openview = function () {
                            SetQueryURL("?po=" + id)
                            document.title = x.title + " - 戈登走過去的博客"
                        }
                        x.maindiv.addEventListener("mouseup", function () {
                            openview()
                        })
                        x.OnClose = function () {
                            SetQueryURL("")
                            document.title = "戈登走過去的博客"
                        }
                        openview()
                        ChangeCodeAreaHTML(x.CodeArea)
                        x.SetH1H2Items()
                        x.AfterResize()
                        openedForms.set(obj.Title, x)
                        return
                    } else {
                        throw "信息不完整"
                    }
                } catch (ex) {
                    err = "请求打开文章失败，传输内容有误：\n" + ex + "\n" + id
                }
            } else if (this.status == 0) {
                err = "获取文章内容超时，你网络真的不太行。\n本网站目前依赖 cloudflare CDN。\n" + id
            } else if (this.status == 404) {
                err = "对不起，你要获取的文章已经消失了。404了。\n 但是也可能它从来就不曾存在过。\n" + id
            } else {
                err = "请求打开文章失败，奇怪的错误：\n" + id + "\n" + this.status
            }
            if (err.length > 0) {
                alert(err)
                console.error(err)
            }
        }
        x.send()
    }

    let filelist = GetFirstElementByClass("filelist")
    dragElement(filelist, GetFirstElementByClass("filelistHeader"));
    IndexManager.Add(filelist)
    let filelistItems = GetFirstElementByClass("filelistItems")
    filelistItems.innerHTML = ""
    let vb6b = new VB6FileListBuilder(filelistItems);
    setInterval(() => {
        if (filelist.offsetWidth > 405) {
            filelist.style.width = "400px"
        }
    }, 400);

    (function () {
        let tt = "我的博客"
        vb6b.AddFolder(tt, true)
        vb6b.AddContent("首页", tt, function () {
            OpenURL("/")
        })
        vb6b.AddContent("RSS订阅", tt, function () {
            OpenPost("rsss")
        })
        vb6b.AddContent("关于我", tt, function () {
            OpenPost("about")
        })
        vb6b.AddContent("搜索本博客", tt, function () {
            OpenPost("search")
        })
        vb6b.AddContent("用money鼓励戈登登", tt, function () {
            OpenPost("donate")
        })
        let Sayings: string[] = [
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
        ]
        let usedSayings: string[] = []
        vb6b.AddContent("神秘发言", tt, function () {
            if (Sayings.length < 1) {
                if (usedSayings.length > 0) {
                    Sayings = CloneArray(usedSayings)
                    console.log("好消息，你成功读完了每一句话。")
                } else {
                    alert("我本来会在这里弹一句话，但是我这里没有一句话可以弹出。这很意外。")
                    return
                }
            }
            let index = RandomInt(0, Sayings.length - 1)
            let str = Sayings[index]
            usedSayings.push(str)
            Sayings.splice(index, 1)
            alert(str)
            return
        })
        vb6b.AddContent("我的软件作品列表", tt, function () {
            OpenPost("mysoftwares")
        })
        tt = "联系我"
        vb6b.AddFolder(tt, false)
        vb6b.AddContent("直接给我留言", tt, function () {
            OpenURL("https://shimo.im/forms/WgWqrRWWjTYRDqCR/fill", true)
        })
        vb6b.AddContent("Twitter", tt, function () {
            OpenURL("https://twitter.com/GDZGQ", true)
        })
        vb6b.AddContent("微博", tt, function () {
            OpenURL("https://weibo.com/5977985000/profile", true)
        })
        vb6b.AddContent("GitHub", tt, function () {
            OpenURL("https://github.com/gordonwalkedby", true)
        })
        vb6b.AddContent("GitLab", tt, function () {
            OpenURL("https://gitlab.com/gordonwalkedby", true)
        })
        vb6b.AddContent("Gitee", tt, function () {
            OpenURL("https://gitee.com/walkedby", true)
        })
        vb6b.AddContent("bilibili", tt, function () {
            OpenURL("https://space.bilibili.com/4523834", true)
        })
        vb6b.AddContent("acfun", tt, function () {
            OpenURL("https://www.acfun.cn/u/13194917", true)
        })
        vb6b.AddContent("YouTube", tt, function () {
            OpenURL("https://www.youtube.com/channel/UCpnf5wTnI9br8IxJbRV5Tew", true)
        })
        vb6b.AddContent("微信公众号", tt, function () {
            OpenURL("https://mp.weixin.qq.com/s/Nefso4vXOAt0cFc4fEStTQ", true)
        })
        tt = "我的好朋友们"
        vb6b.AddFolder(tt, true)
        vb6b.AddContent("技术宅的结界", tt, function () { OpenURL("https://www.0xaa55.com/", true) })
        vb6b.AddContent("AceSheep", tt, function () { OpenURL("https://blog.acesheep.com/", true) })
        vb6b.AddContent("Sonic 853", tt, function () { OpenURL("https://blog.853lab.com/", true) })
    })();

    (function () {
        let ques = getQueryValues()
        let post = ques.get("po")
        if (post != null && post.length > 0) {
            OpenPost(post)
        }
        hljs.initHighlightingOnLoad()
    })()

    // 首页的JS添加在这里

})();

(function () {
    if (myIndexType != 1) {
        return
    }
    (function () {
        let inside = document.getElementById("inside")
        if (inside == null) {
            throw "#inside is null"
        }
        let ques = getQueryValues()
        let post = ques.get("po") || ""
        let but = document.getElementById("gobackHome")
        if (but == null) {
            throw "#gobackHome is null"
        }
        but.onclick = function () {
            location.href = "/?po=" + post
        }
        if (post.length > 0) {
            let x = new XMLHttpRequest()
            x.open("GET", "/posts/" + post + ".json")
            x.timeout = 5000
            x.onloadend = function () {
                if (inside == null) {
                    throw "#inside is null"
                }
                let err = ""
                if (this.status == 200) {
                    try {
                        let obj = JSON.parse(this.responseText) as BlogPost
                        inside.innerHTML = obj.Content
                        document.title = obj.Title + " - 戈登走過去的博客"
                        ChangeCodeAreaHTML(inside)
                    } catch (error) {
                        err = "加载文章出现意外：" + error
                    }
                } else if (this.status == 0) {
                    err = "加载文章超时，你与服务器的连接可能太差了。 \n" + post
                } else {
                    err = "连接出错：" + this.status.toFixed() + "\n" + post
                }
                if (err.length > 0) {
                    inside.innerText = err
                    alert(err)
                }
            }
            x.send()
        } else {
            location.href = "/"
        }
        hljs.initHighlightingOnLoad()
    })();
})();