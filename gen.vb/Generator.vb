Imports Microsoft.SyndicationFeed
Imports Microsoft.SyndicationFeed.Atom
Imports NUglify

Public Module Generator

    Public Property Posts As List(Of BlogPost) = Nothing
    Public Property TemplateContent As New Dictionary(Of String, String)
    Public Property TagPosts As New Dictionary(Of String, List(Of BlogPost))
    Public Const ATOMxml As String = "atom.xml"
    Public Const SITEMAPSxml As String = "sitemaps.xml"

    Public Sub ReadLocalFiles()
        Posts = GetAllBlogPosts()
        Dim fd As New DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory, "html"))
        Dim ls As New Dictionary(Of String, String)
        For Each i In fd.GetFiles()
            ls.Add(i.Name, ResetLF(File.ReadAllText(i.FullName)))
        Next
        TemplateContent = ls
        Dim ts As New Dictionary(Of String, List(Of BlogPost))
        For Each p In Posts
            For Each t In p.Tags
                If ts.ContainsKey(t) = False Then
                    Dim list = New List(Of BlogPost) From {p}
                    ts.Add(t, list)
                Else
                    Dim list = ts.Item(t)
                    If list.Contains(p) = False Then
                        list.Add(p)
                    End If
                End If
            Next
        Next
        TagPosts = ts
    End Sub

    Public Function GenerateIndex() As String
        Dim html As String = TemplateContent.Item("index.html")
        Dim sb As New StringBuilder
        Dim addSection = Sub(title As String, ps As List(Of BlogPost))
                             sb.AppendLine($"<div class='pageSection'><div class='sectionTitleBox'><span class='sectionTitle'>{ HttpUtility.HtmlEncode(title)}</span></div><div class='secitonNavBox'>")
                             For Each p In ps
                                 sb.AppendLine($"<a href='/{p.FileName}'>{HttpUtility.HtmlEncode(p.Title)}</a>")
                             Next
                             sb.AppendLine("</div></div>")
                         End Sub
        addSection("最新文章", Posts.GetRange(0, 10))
        For Each tag In TagPosts.Keys
            Dim ps = TagPosts.Item(tag)
            If ps.Count > 0 Then
                addSection(tag, ps)
            End If
        Next
        html = html.Replace("这里是主页插入4134315", sb.ToString)
        Dim cs As New Html.HtmlSettings
        With cs
            .RemoveOptionalTags = False
        End With
        Dim r = Uglify.Html(html, cs)
        If Not r.HasErrors Then
            html = r.Code
        End If
        Return html
    End Function

    Public Function GeneratePostPage(p As BlogPost) As String
        Dim html As String = TemplateContent.Item("post.html")
        Dim sb As New StringBuilder
        sb.AppendLine(p.HTMLContent)
        For i As Integer = 5 To 1 Step -1
            Dim add = i + 1
            sb.Replace($"<h{i}>", $"<h{add}>")
            sb.Replace($"</h{i}>", $"</h{add}>")
        Next
        If p.Time.Year > 2010 Then
            Dim timestr As String
            If p.Time.Hour > 0 OrElse p.Time.Minute > 0 OrElse p.Time.Second > 0 Then
                timestr = p.Time.ToString("yyyy 年 MM 月 dd 日 HH:mm:ss")
            Else
                timestr = p.Time.ToString("yyyy 年 MM 月 dd 日")
            End If
            sb.Insert(0, $"<time datetime='{p.Time:yyyy-MM-dd HH:mm:ss.001+0800}' class='articleDate'>本文发布于公元 {timestr}</time>")
        End If
        Dim tt = HttpUtility.HtmlEncode(p.Title)
        html = html.Replace("<title>标题t</title>", $"<title>{tt} - 戈登走過去的博客</title>").Replace("我是文章标题7537537", tt).Replace("我是文章内容24542642", sb.ToString)
        Dim cs As New Html.HtmlSettings
        With cs
            .RemoveOptionalTags = False
        End With
        Dim r = Uglify.Html(html, cs)
        If Not r.HasErrors Then
            html = r.Code
        End If
        Return html
    End Function

    Public Function GenerateRSS() As String
        Using ms As New MemoryStream()
            Using xw = Xml.XmlWriter.Create(ms)
                Dim atom As New AtomFeedWriter(xw)
                With atom
                    .WriteId("https://walkedby.com/").Wait()
                    .WriteTitle("戈登走過去的博客").Wait()
                    .WriteUpdated(New DateTimeOffset(Posts.Item(0).Time)).Wait()
                    Dim link As New SyndicationLink(New Uri("https://walkedby.com/atom.xml"), "self")
                    .Write(link).Wait()
                    .Flush.Wait()
                End With
                Dim rssPerson As New SyndicationPerson("戈登走過去", "84y48tt8l@relay.firefox.com")
                Dim count = 0
                For Each p In Posts
                    Dim uu As New Uri($"https://walkedby.com/{p.FileName}")
                    Dim item As New SyndicationItem()
                    With item
                        .Id = uu.ToString
                        .LastUpdated = New DateTimeOffset(p.Time)
                        .Title = p.Title
                        .Published = .LastUpdated
                        .AddLink(New SyndicationLink(uu))
                        .AddContributor(rssPerson)
                        .Description = $"全文请看  {uu}"
                    End With
                    atom.Write(item).Wait()
                    atom.Flush.Wait()
                    count += 1
                    If count >= 15 Then
                        Exit For
                    End If
                Next
                Dim bytes = ms.ToArray()
                Dim str = UTF8.GetString(bytes)
                Const ends = "</feed>"
                If str.EndsWith(ends) = False Then
                    str += ends
                End If
                Return str
            End Using
        End Using
    End Function

    Public Function GenerateSiteMap() As String
        Dim sb As New SiteMapBuilder
        With sb
            For Each p In Posts
                Dim dt = p.Time
                If dt.Year < 2010 Then
                    dt = dt.AddYears(2010 - dt.Year)
                End If
                .AddURL($"https://walkedby.com/{p.FileName}", dt)
            Next
        End With
        Return sb.ToString
    End Function

    Public Sub CopyStaticFiles(dest As DirectoryInfo)
        Dim sr As New DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory, "source"))
        For Each i In sr.GetDirectories("*", SearchOption.TopDirectoryOnly)
            If i.Name.StartsWith("_") = False Then
                CopyFolder(i, New DirectoryInfo(Path.Combine(dest.FullName, i.Name)))
            End If
        Next
        For Each i In sr.GetFiles("*", SearchOption.TopDirectoryOnly)
            i.CopyTo(Path.Combine(dest.FullName, i.Name), True)
        Next
    End Sub

    Public Sub GenerateAll()
        Dim dest As New DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory, "docs"))
        If dest.Exists Then
            dest.Delete(True)
        End If
        dest.Create()
        Dim content = GenerateIndex()
        File.WriteAllText(Path.Combine(dest.FullName, "index.html"), content, UTF8)
        For Each p In Posts
            Dim fd = Path.Combine(dest.FullName, $"{p.FileName}")
            Directory.CreateDirectory(fd)
            content = GeneratePostPage(p)
            File.WriteAllText(Path.Combine(fd, "index.html"), content, UTF8)
        Next
        content = GenerateRSS()
        File.WriteAllText(Path.Combine(dest.FullName, ATOMxml), content, UTF8)
        content = GenerateSiteMap()
        File.WriteAllText(Path.Combine(dest.FullName, SITEMAPSxml), content, UTF8)
        File.WriteAllBytes(Path.Combine(dest.FullName, "404.html"), Get404)
        CopyStaticFiles(dest)
    End Sub

    Public Function Get404() As Byte()
        Dim cs As New Html.HtmlSettings
        With cs
            .RemoveOptionalTags = False
        End With
        Dim html = TemplateContent.Item("404.html")
        Dim r = Uglify.Html(html, cs)
        If Not r.HasErrors Then
            html = r.Code
        End If
        Return UTF8.GetBytes(html)
    End Function

    Public Function GetByURL(url As String) As Byte()
        If String.IsNullOrWhiteSpace(url) Then
            Return Nothing
        End If
        Const indexhtml = "/index.html"
        '去掉链接末尾的 /index.html
        If url.EndsWith(indexhtml) Then
            url = url.Remove(url.Length - indexhtml.Length, indexhtml.Length)
        End If
        url = url.Trim("/", "\", " ")
        '如果 url 长度为0，就是主页
        If url.Length < 1 Then
            Return UTF8.GetBytes(GenerateIndex())
        End If
        '如果url == atom.xml
        If url.Equals(ATOMxml) Then
            Return UTF8.GetBytes(GenerateRSS())
        End If
        '如果 url == sitemaps.xml
        If url.Equals(SITEMAPSxml) Then
            Return UTF8.GetBytes(GenerateSiteMap())
        End If
        '如果 url 是某文章的 filename
        For Each p In Posts
            If p.FileName.Equals(url) Then
                Return UTF8.GetBytes(GeneratePostPage(p))
            End If
        Next
        '如果 url 是以 下划线开头，就提供 null
        If url.StartsWith("_") Then
            Return Nothing
        End If
        '如果 url 指向的文件，是本地source文件夹里的文件，就返回那个文件的内容
        Dim fi = Path.Combine(Directory.GetCurrentDirectory, "source", url)
        If File.Exists(fi) Then
            Return File.ReadAllBytes(fi)
        End If
        Return Nothing
    End Function

    Public Sub StartTestServer()
        Dim t1 As New Task(Sub()
                               Do While True
                                   Try
                                       Generator.ReadLocalFiles()
                                   Catch ex As Exception
                                       Console.WriteLine($"扫描文件出错： {ex}")
                                   End Try
                                   Thread.Sleep(3000)
                               Loop
                           End Sub)
        t1.Start()
        Dim l As New HttpListener()
        With l
            .AuthenticationSchemes = AuthenticationSchemes.Anonymous
            .Prefixes.Add("http://127.0.0.1:2021/")
            .Start()
            For Each i In .Prefixes
                Console.WriteLine(i)
            Next
            Console.WriteLine("测试用监听服务器已启动")
        End With
        Do While True
            Dim ct = l.GetContext
            Dim rq = ct.Request
            Dim rp = ct.Response
            Console.WriteLine($"新请求：{rq.RawUrl} {rq.RemoteEndPoint} {rq.UserAgent}")
            Try
                Dim bs = GetByURL(rq.RawUrl)
                If bs Is Nothing Then
                    bs = Get404()
                    rp.StatusCode = 404
                End If
                rp.OutputStream.Write(bs)
            Catch ex As Exception
                Console.WriteLine($"出错： {ex}")
            End Try
            rp.Close()
        Loop
    End Sub

End Module
