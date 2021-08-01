---
title: 简单介绍微软官方谷歌内核.NET浏览器控件WebView2
date: 2020-12-13 14:30:45
tags: [.NET]
---
# 来源 
从不知道多老开始，VB6那时候就有一个浏览器控件，WebBrower，反正用的IE内核贼垃圾。  
Win10推出之后，微软的edge浏览器是用的edgeHTML这个内核，当时推出了一个浏览器控件叫 WebView 。    
这个控件体验也很差，早期还只支持 UWP 不支持 WIN32 。   
自从微软把edge浏览器变成了谷歌浏览器内核（Chromium），一切都开始明朗起来了。  
推出了新的浏览器控件 WebView2 ，接下来我们就讲一讲怎么玩耍这个东西。  

# 官方文档
如果你不想看我BB，直接去看[官方文档](https://docs.microsoft.com/zh-cn/microsoft-edge/webview2/)。    
   

# 安装
首先，你必须在你的电脑上安装 [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)。可以说你不安装新版edge只要安装这个runtime就行了，这是为了防止做出的操作对系统环境使用的 edge 造成破坏或干扰。  
在软件的用户的电脑上也必须安装这个runtime才能正常工作。  
 
微软特地给你提供了离线安装版，在线安装版和固定不更新版本。  
在线安装版，就是 Evergreen Bootstrapper。    
离线安装版，就是 Evergreen Standalone Installer。    
Evergreen 指的是常青的，比如常青藤（意义不明）。  
这两个都只能安装到 C:\Program Files (x86)\Microsoft\EdgeWebView\Application 里面，而且好像会自动更新（具体不清楚，官方文档里写的很含糊）。  
还有一个解压即用版，就是 Fixed Version ，其实指的是固定版本，这个是不会自动更新的。  
如果你要使用这个 Fixed Version ，最好好好阅读一下[这个](https://docs.microsoft.com/zh-cn/microsoft-edge/webview2/concepts/distribution)   

安装好runtime之后，到你的 .NET 项目里面安装这个 NUGET 包。   
![](https://z3.ax1x.com/2020/12/13/rew5K1.png)   
注意只能在以下平台运行：   
![](https://z3.ax1x.com/2020/12/13/rewIDx.md.png)  

# 入门，链接跳转
下面我全部的内容使用的都是 .NET Framework 4.8 ， Windows Forms， VB .NET 。  
不同的版本会有小的差异。    
你应该可以在这个控件工具箱列表里找到这个控件，放置出来就可以了。   
![](https://z3.ax1x.com/2020/12/13/rewHUO.png)   
尽量不要操作右边的属性栏，把要初始化的代码都写在窗体的Load里面就好。  
下面我把这个控件实例命名为 edge 。  
在窗体的 Load 事件里面写上：    
```vb
edge.Source = New Uri("https://www.baidu.com")
```
Source 属性可以让控件跳到指定的链接。可以是`http://localhost`，也可以是 `file:///C:/xxx.html` 格式的本地文件链接，还可以是 `edge://version` ，不过好像没有那个小恐龙游戏了。     
运行程序，看见窗口内的浏览器控件自动跳到了百度，说明咱们成功了。  
![](https://z3.ax1x.com/2020/12/13/re00iD.png)  
还有，别让用户手贱把这些进程给关了。  
![](https://z3.ax1x.com/2020/12/13/reBNlj.png)  

# 设置运行环境，保存用户数据 
在不设置运行环境的情况下，默认的用户数据是保存在webview2 runtime里面的，和用户平时的edge是隔离的，但是会在所有webview2程序里共享。   
如果你登陆了B站，并且选择了记住信息，那么下次打开程序还是会自动登陆B站。  
要避免共享，可以设置用户数据保存的文件夹，和其他人的独立开来。  
首先需要引用（如果是wpf的自己改）：
```vb
Imports Microsoft.Web.WebView2.Core
Imports Microsoft.Web.WebView2.WinForms
```
在窗体的 Load 事件里面写上： 
```vb
Dim ev = CoreWebView2Environment.CreateAsync(, AppContext.BaseDirectory)
edge.EnsureCoreWebView2Async(ev.Result)
edge.Source = New Uri("https://baidu.com")
```
尽管这上面两个函数都是异步的，后面我会讲异步的关系。  
`CoreWebView2Environment.CreateAsync`这个函数有三个可选参数，留空都是默认，第一个是webview2 runtime的路径，就是有msedgewebview2.exe的那个文件夹。第二个是用户数据文件夹。第三个是一些可选设置，可以添加自定义进程启动设置。    
用户数据文件夹的那个路径下，webview2会创建一个文件夹叫做`EBWebView`，然后一切用户数据都是在里面的。  

# 正确设置 Core
`CoreWebView2` 是核心，用控件的只读属性 `CoreWebView2` 来获得，上面说到的 `EnsureCoreWebView2Async` 函数就是修改这个核心的设置。  
但是问题来了，这个异常奇葩，属性 `CoreWebView2`  获得的核心默认是 nothing (null) 的，你必须先使用 `EnsureCoreWebView2Async` 函数。  
但是这个函数居然是个异步函数，就很刺激了。  
经过我的测试，如果你直接 `Task.Wait()` 这个玩意会永远卡死下去。  
正确的办法是这样：  
```vb
Private Async Sub Form1_Load(sender As Object, e As EventArgs) Handles Me.Load
    Dim ev = CoreWebView2Environment.CreateAsync(, AppContext.BaseDirectory)
    Await ev
    Dim t As Task = edge.EnsureCoreWebView2Async(ev.Result)
    Await t
    Debug.WriteLine(edge.CoreWebView2.BrowserProcessId)
    edge.Source = New Uri("https://baidu.com")
End Sub
```
能不能不设置核心就用这个控件呢？  
可以是可以，很多功能就少了，垃圾微软什么奇葩设计啊，core有的功能不继承到具体实现里面。  

# 阻止新窗口弹出
在实际使用中，这玩意会动不动打开新窗口，然后新窗口就完全不受程序控制了。所以我们可以给 core 新增一个事件，让新窗口的链接转移到本窗口里来。   
把下面的代码放在上面的 `Await t` 之后，就是要保证已经 `EnsureCoreWebView2Async` 完成了。  
```vb
Dim core = edge.CoreWebView2
AddHandler core.NewWindowRequested, Sub(ss As Object, ee As CoreWebView2NewWindowRequestedEventArgs)
                                        ee.Handled = True
                                        edge.Source = New Uri(ee.Uri)
                                    End Sub
```

这样就可以了。  

# 阻止用户使用浏览器自带功能 
默认情况下，在网页右键是可以和普通浏览器一样打开菜单的，还居然可以打开一个F12窗口，真心NB。  
如果你不想让用户这么做的话，可以在 `core.Settings` 里面修改：  
```vb
core.Settings.AreDefaultContextMenusEnabled = False
core.Settings.AreDevToolsEnabled = False
core.Settings.IsZoomControlEnabled = False
```
第三个就是不允许用户通过 ctrl 加滚轮修改网页大小，还有一些设置自己探索一下，我就懒得说了。  

# 在网页上运行 javascript
在窗口上新增一个按钮，然后添加下列代码：   
必须使用 Async 和 Await 异步操作，`Task.Wait()` 或 `Task.Result` 都会一直卡死，无法继续！  
```vb
Private Async Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
    Dim t = edge.ExecuteScriptAsync("confirm('你是帅哥嘛?')")
    Await t
    Debug.WriteLine(t.Result)
End Sub
```
![](https://z3.ax1x.com/2020/12/13/reyw2F.png)  
效果就是这样，然后debug那边应该会显示一个 true 或者 false ，返回的一定是字符串，如果啥都没有就是`"null"`了。  

# 网页传递信息到程序
这里说的是信息指的是 WebMessage ，使用方法如下：   
准备一个本地网页，随便写点什么，然后一定要在 `<script>` 里面写上下面这段javascript并引发与运行：
```javascript
var m = {}
m.Age = 15
m.Name = 'John'
window.chrome.webview.postMessage(m)
```
然后在程序代码里准备好 core，按下面这么操作，最好写在窗体Load里面。那个链接就写自己的本地html的文件链接就好。      
```vb
Dim core = edge.CoreWebView2
core.Settings.IsWebMessageEnabled = True
edge.Source = New Uri("file:///D:/test.html")
```
接下来给 webview2 控件新建一个事件：
```vb
Private Sub edge_WebMessageReceived(sender As Object, e As CoreWebView2WebMessageReceivedEventArgs) Handles edge.WebMessageReceived
    Debug.WriteLine(e.WebMessageAsJson)
End Sub
```
这样，在加载这个html，运行到那段js的时候，就会引发这个WebMessageReceived事件，传过来的是对象的json字符串。   

# 抓包
这个功能很有意思啊，可以拿来获取 httponly 的 cookie 和一些奇怪的 CSRF 之类的。   
首先要给core添加一条过滤规则，指定哪些链接和内容是我们要抓包的。  
如果想抓全部，就写这个：  
```vb
core.AddWebResourceRequestedFilter("*", CoreWebView2WebResourceContext.All)
```
接下来需要添加一个捕获事件，就像这样：  
```vb
AddHandler core.WebResourceRequested, Sub(ss As Object, ee As CoreWebView2WebResourceRequestedEventArgs)
                                            If ee.Request.Headers.Contains("Cookie") Then
                                                Debug.WriteLine(ee.Request.Headers.GetHeader("Cookie"))
                                            End If
                                            '最好先检测一下是不是Headers.Contains
                                            '否则 GetHeader 遇到不存在的头会扔出一个错误。
                                        End Sub
```
在API里，```CoreWebView2WebResourceRequestedEventArgs```是有一个属性叫`Response`，不过没有合适的办法来获取它的值，访问就是nothing(null)，如果在task里或者thread里去访问这个值，直接就throw了一个COM不支持的错误出来。  
[github有神仙](https://github.com/MicrosoftEdge/WebView2Feedback/issues/275#issuecomment-652911352)通过修改官方dll实现了获取这个`Response`，想看可以自己看看。  

# 回复我
- [b站](https://t.bilibili.com/468203769441965711?tab=2)
- [A5的论坛 技术宅的结界](https://www.0xaa55.com/thread-26227-1-1.html)

