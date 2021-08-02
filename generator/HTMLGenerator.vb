Module HTMLGenerator

    Const WebsiteTitle = "戈登走過去的树洞"
    Const WebsiteURL = "https://walkedby.com/"
    Const AtomURL = "atom.xml"
    Const htmlIndex = "index"
    Const htmlPost = "post"
    Const html404 = "404"
    Const HTMLIndexHead = "<!-- %头部附加% -->"
    Const HTMLIndexCenter = "<!-- %中心% -->"
    Public ReadOnly HTMLFileContents As New Dictionary(Of String, (String, Date))
    Public ReadOnly PostFileContents As New Dictionary(Of String, (String, Date))
    Public ReadOnly SubProjectContents As New Dictionary(Of String, (String, Date))
    Public ReadOnly Posts As New Dictionary(Of String, Post)

    Public Function IsGoodFileName(str As String) As Boolean
        Static r As New Regex("^[a-z|0-9|\-]*$", RegexOptions.Compiled And RegexOptions.Singleline)
        If String.IsNullOrWhiteSpace(str) Then Return False
        Return r.IsMatch(str)
    End Function

    ''' <summary>
    ''' 从 folder 里过滤出符合 searchPattern 的文件，读取 utf8 文本存入 dict 里，返回的是新读取的文件的名字数组。这只适用于文件名不重复的情况.
    ''' 如果 searchPattern 不包含?或者*，那么会使用父文件夹的名字存入 dict。
    ''' </summary>
    Public Function RefreshReadTextFiles(folder As DirectoryInfo, dict As Dictionary(Of String, (String, Date)), searchPattern As String, throwIOex As Boolean) As String()
        Static bypassFolders As String() = {".vs", "node_modules"}
        Dim timeNow = Date.Now
        Dim out As New List(Of String)
        Dim readNames As New List(Of String)
        For Each f In folder.GetFiles(searchPattern, SearchOption.AllDirectories)
            Dim fullDic = f.DirectoryName
            Dim skip As Boolean = False
            For Each fdname In bypassFolders
                If fullDic.Contains(fdname, StringComparison.OrdinalIgnoreCase) Then
                    skip = True
                    Exit For
                End If
            Next
            If skip Then
                Continue For
            End If
            Dim name = f.Name
            If searchPattern.Contains("*") = False AndAlso searchPattern.Contains("?") = False Then
                name = f.Directory.Name.ToLower
            Else
                name = Path.ChangeExtension(name, Nothing).ToLower
            End If
            If Not IsGoodFileName(name) Then
                Throw New Exception($"The name can only use English letters and numbers: {f.FullName}")
            End If
            If readNames.Contains(name) Then
                Throw New Exception($"Got multi files that has the same name: {f.FullName}")
            End If
            readNames.Add(name)
            Dim noNeedRead As Boolean = dict.ContainsKey(name) AndAlso dict.Item(name).Item2 >= f.LastWriteTime
            If noNeedRead Then
                Continue For
            End If
            Dim content As String = Nothing
            Try
                content = ReadFileAllText(f.FullName)
            Catch ex As Exception
                Console.WriteLine($"File IO error: {f.FullName}")
                If throwIOex Then
                    Throw
                End If
                Console.WriteLine(ex)
            End Try
            If content IsNot Nothing Then
                out.Add(name)
                If dict.ContainsKey(name) Then
                    dict.Item(name) = (content, timeNow)
                Else
                    dict.Add(name, (content, timeNow))
                End If
            End If
        Next
        Return out.ToArray
    End Function

    Public Sub RefreshHTMLFiles()
        Static needs As String() = {htmlIndex, html404, htmlPost}
        Static readTimes As Integer = 0
        RefreshReadTextFiles(HtmlFolder, HTMLFileContents, "*.html", readTimes < 1)
        For Each i In needs
            If Not HTMLFileContents.ContainsKey(i) Then
                Throw New FileNotFoundException($"I cannot find: {i}.html")
            End If
        Next
        readTimes += 1
    End Sub

    Public Sub RefreshPosts()
        Static readTimes As Integer = 0
        Dim news = RefreshReadTextFiles(PostsFolder, PostFileContents, "*.md", readTimes < 1)
        For Each name In news
            If SubProjectContents.ContainsKey(name) Then
                Throw New Exception($"This post name has been used in subproject: {name}")
            End If
            Dim ct = PostFileContents.Item(name).Item1
            Dim a As Post = Post.Create(name, ct)
            Posts.Remove(a.FileName)
            Posts.Add(a.FileName, a)
        Next
        news = RefreshReadTextFiles(PostsFolder, SubProjectContents, "index.html", readTimes < 1)
        For Each name In news
            If PostFileContents.ContainsKey(name) Then
                Throw New Exception($"This subproject name has been used in normal post: {name}")
            End If
            Dim ct = SubProjectContents.Item(name).Item1
            Dim a As Post = Post.Create(name, ct)
            Posts.Remove(a.FileName)
            Posts.Add(a.FileName, a)
        Next
        readTimes += 1
    End Sub

    Public Function BuildPostHTML(a As Post) As String
        Dim tt = HttpUtility.HtmlEncode(a.Title)
        Dim sb As New StringBuilder
        sb.Append("<title>")
        sb.Append(tt)
        sb.Append(" - ")
        sb.Append(WebsiteTitle)
        sb.Append("</title>")
        sb.Append("<meta name=""description"" content=""")
        Dim preview = a.TextContent.Replace(vbCr, " ").Replace(vbLf, " ").Trim
        If preview.Length > 100 Then
            preview = preview.Substring(0, 90)
        End If
        sb.Append(HttpUtility.HtmlEncode(preview))
        sb.Append("..."" />")
        Dim html = HTMLFileContents.Item(htmlIndex).Item1
        html = html.Replace(HTMLIndexHead, sb.ToString)
        Dim div = HTMLFileContents.Item(htmlPost).Item1
        div = div.Replace("%时间内部%", HttpUtility.HtmlAttributeEncode(a.ReleaseDateISOStr))
        div = div.Replace("%时间显示%", HttpUtility.HtmlEncode(a.ReleaseDateDisplayStr))
        div = div.Replace("%TAG标签区%", a.TagsHTML)
        div = div.Replace("%标题%", tt)
        div = div.Replace("%HTML内容%", a.HTMLContent)
        html = html.Replace(HTMLIndexCenter, div)
        Return html
    End Function

    Public Function BuildIndexHTML() As String
        Dim html = HTMLFileContents.Item(htmlIndex).Item1
        Dim sb As New StringBuilder
        sb.Append("<title>")
        sb.Append(WebsiteTitle)
        sb.Append("</title>")
        sb.Append("<meta name=""description"" content=""只是我一个人发牢骚的博客（树洞）"" />")
        html = html.Replace(HTMLIndexHead, sb.ToString)
        sb.Clear()
        sb.Append("<code id=""indexpostsjson"">")
        sb.Append(Post.GetPostsJson(Posts.Values))
        sb.Append("</code>")
        html = html.Replace(HTMLIndexCenter, sb.ToString)
        Return html
    End Function

    Public Function Build404HTML() As String
        Dim html = HTMLFileContents.Item(htmlIndex).Item1
        html = html.Replace(HTMLIndexHead, "<title>404</title>")
        Dim ct = HTMLFileContents.Item(html404).Item1
        html = html.Replace(HTMLIndexCenter, ct)
        Return html
    End Function

    Public Function BuildAtomXML() As String
        Dim ls As New List(Of Post)
        ls.AddRange(Posts.Values)
        ls.Sort()
        Static selfURL As String = WebsiteURL + AtomURL
        Dim lastUpdate = ls.Item(0).ReleaseDate
        Dim ag As New AtomGenerator(WebsiteTitle, WebsiteURL, selfURL, lastUpdate, "Walkedby")
        For Each a In ls
            Dim u = $"{WebsiteURL}{a.FileName}"
            Dim u2 = WebUtility.HtmlEncode(u)
            ag.AddEntry(a.Title, u, a.ReleaseDate)
        Next
        Return ag.ToString
    End Function

    Public Sub GenerateAllFiles()
        Static docsfullname As String = DocsFolder.FullName
        Static staticsfullname As String = StaticsFolder.FullName
        DocsFolder.Refresh()
        If DocsFolder.Exists Then
            Console.WriteLine("Deleting old docs folder.")
            DocsFolder.Delete(True)
        End If
        DocsFolder.Create()
        Dim staticfiles = StaticsFolder.GetFiles("*", SearchOption.AllDirectories)
        For Each f In staticfiles
            Dim target As New FileInfo(Path.Combine(docsfullname, f.FullName.Replace(staticsfullname, "").Trim(" "c, "/"c, "\"c).ToLower))
            Dim dc = target.Directory
            If Not dc.Exists Then
                dc.Create()
            End If
            Console.WriteLine($"Coping: {target.FullName}")
            f.CopyTo(target.FullName)
        Next
        Dim html = BuildIndexHTML()
        Console.WriteLine($"Writing: index.html")
        File.WriteAllText(Path.Combine(docsfullname, "index.html"), html)
        html = Build404HTML()
        Console.WriteLine($"Writing: 404.html")
        File.WriteAllText(Path.Combine(docsfullname, "404.html"), html)
        html = BuildAtomXML()
        Console.WriteLine($"Writing: {AtomURL}")
        File.WriteAllText(Path.Combine(docsfullname, AtomURL), html)
        For Each a In Posts.Values
            Dim fd = DocsFolder.CreateSubdirectory(a.FileName)
            html = BuildPostHTML(a)
            Console.WriteLine($"Writing: {a.FileName}/index.html")
            File.WriteAllText(Path.Combine(fd.FullName, "index.html"), html)
        Next
        Console.WriteLine("Finish.")
    End Sub

    Public Sub StartHTTPListener(port As Integer)
        Dim h As New HttpListener
        With h
            .AuthenticationSchemes = AuthenticationSchemes.Anonymous
            .Prefixes.Add($"http://127.0.0.1:{port}/")
            .Prefixes.Add($"http://localhost:{port}/")
            .Start()
            Console.WriteLine("Http listener started:")
            For Each i In .Prefixes
                Console.WriteLine(i)
            Next
        End With
        Dim utf8 As New UTF8Encoding(False)
        Const Thtml = "text/html; charset=utf-8"
        Const IndexTail = "/index.html"
        Dim t1 As New Task(Sub()
                               Do While True
                                   Thread.Sleep(1500)
                                   RefreshHTMLFiles()
                                   RefreshPosts()
                               Loop
                           End Sub)
        t1.Start()
        Do While True
            Try
                Dim context = h.GetContext
                Dim request = context.Request
                Dim response = context.Response
                Dim rawurl = request.RawUrl
                Console.WriteLine(rawurl)
                If rawurl.EndsWith(IndexTail) Then
                    rawurl = rawurl.Substring(0, rawurl.Length - IndexTail.Length)
                End If
                rawurl = rawurl.Trim("/"c, "\"c)
                Dim a As Post = Nothing
                If rawurl.Length < 1 Then
                    response.ContentType = Thtml
                    response.OutputStream.Write(utf8.GetBytes(BuildIndexHTML))
                ElseIf Posts.TryGetValue(rawurl, a) Then
                    response.ContentType = Thtml
                    response.OutputStream.Write(utf8.GetBytes(BuildPostHTML(a)))
                ElseIf rawurl.Equals(AtomURL) Then
                    response.ContentType = "text/xml"
                    response.OutputStream.Write(utf8.GetBytes(BuildAtomXML))
                Else
                    Dim f As New FileInfo(Path.Combine(StaticsFolder.FullName, rawurl))
                    If f.Exists Then
                        Dim bufferSize As Integer = 1024 * 2
                        Dim buffer(bufferSize) As Byte
                        Dim filelen As Long = f.Length
                        Dim ctp As String = GetMIMEType(f.Extension)
                        If ctp IsNot Nothing Then
                            response.ContentType = ctp
                        End If
                        Using st = f.Open(FileMode.Open, FileAccess.Read, FileShare.ReadWrite)
                            Dim leftBytes As Long = filelen
                            Do While True
                                Dim readlen As Integer = CInt(Math.Min(leftBytes, bufferSize))
                                st.Read(buffer, 0, readlen)
                                response.OutputStream.Write(buffer, 0, readlen)
                                leftBytes -= readlen
                                If leftBytes < 1 Then Exit Do
                            Loop
                        End Using
                    Else
                        Console.WriteLine($"404: {rawurl}")
                        response.StatusCode = 404
                        response.ContentType = Thtml
                        response.OutputStream.Write(utf8.GetBytes(Build404HTML))
                    End If
                End If
                response.Close()
            Catch ex As Exception
                Console.WriteLine(ex)
            End Try
        Loop
    End Sub

End Module
