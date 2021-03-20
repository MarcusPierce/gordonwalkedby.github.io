
Module Program

    Dim workingFolder As DirectoryInfo
    Dim sourceFolder As DirectoryInfo
    Dim baseTSFolder As DirectoryInfo
    Dim postsFolder As DirectoryInfo

    Sub Main(args As String())
        Console.WriteLine("Gordon Walkedby's Blog. This version was started on 2021-Feb-1st.")
        If args.Length < 1 Then
            Console.WriteLine("No arg found. 
Please open me with args:
new xxx - Create a new post named xxx.
g - Generate all posts and save them into 'docs/' folder.
s - Open local test server.
")
            Environment.Exit(0)
        End If
        Dim dc = New DirectoryInfo(AppContext.BaseDirectory)
        Dim isgoodFolder = False
        For retry As Integer = 1 To 15
            Dim folders = dc.GetDirectories("*", SearchOption.TopDirectoryOnly)
            Dim goodnames = {"base_ts", "base_vb", "source"}
            Dim ok = False
            For Each name In goodnames
                ok = False
                For Each i In folders
                    If i.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase) Then
                        ok = True
                        Exit For
                    End If
                Next
                If Not ok Then
                    dc = dc.Parent
                    Console.WriteLine($"Go scan: {dc.FullName}")
                    If dc Is Nothing Then
                        Exit For
                    End If
                    Exit For
                End If
            Next
            If ok Then
                isgoodFolder = True
                Exit For
            End If
        Next
        If isgoodFolder = False Then
            Console.WriteLine(dc.FullName)
            Throw New Exception("No, i cant work in wrong places.")
        End If
        Directory.SetCurrentDirectory(dc.FullName)
        workingFolder = dc
        sourceFolder = New DirectoryInfo(Path.Combine(workingFolder.FullName, "source"))
        postsFolder = New DirectoryInfo(Path.Combine(sourceFolder.FullName, "_posts"))
        baseTSFolder = New DirectoryInfo(Path.Combine(workingFolder.FullName, "base_ts"))
        Console.WriteLine($"I will work here: {Directory.GetCurrentDirectory}")
        Console.WriteLine("Your args:")
        For Each i As String In args
            Console.WriteLine(i)
        Next
        Console.WriteLine("===")
        Dim command As String = args(0)
        Select Case command
            Case "new"
                If args.Length > 1 Then
                    Dim name = args(1)
                    CreateEmptyPost(name)
                Else
                    Throw New Exception("You must set a title of the post.")
                End If
            Case "g"
                Dim p = Path.Combine(workingFolder.FullName, "docs")
                If Directory.Exists(p) Then
                    Directory.Delete(p, True)
                End If
                GenearteBlog(p, True)
            Case "s"
                Dim port As Integer = 4100
                If args.Length > 1 Then
                    port = Val(args(1))
                    If port < 1000 OrElse port > 65500 Then
                        Throw New Exception($"This is not a good port number.I want 1000~65500. {port} ")
                    End If
                End If
                StartTestServer(port)
            Case Else
                Throw New Exception("No command found.")
        End Select
    End Sub

    Public Sub CreateEmptyPost(title As String)
        Dim t2 = HttpUtility.UrlEncode(title) + ".md"
        Dim mds = postsFolder.GetFiles("*.md", SearchOption.AllDirectories)
        For Each md In mds
            If md.Name.Equals(t2, StringComparison.CurrentCulture) Then
                Throw New Exception($"This post name has been used: {md.FullName}")
            End If
        Next
        Dim td = Now
        Dim dc As New DirectoryInfo(Path.Combine(postsFolder.FullName, td.ToString("yyyy"), td.ToString("MM")))
        If dc.Exists = False Then
            dc.Create()
        End If
        Dim f As New FileInfo(Path.Combine(dc.FullName, t2))
        Dim sb As New StringBuilder
        sb.AppendLine("---")
        sb.AppendLine($"title: {title}")
        sb.AppendLine($"date: {Now:yyyy-MM-dd}")
        sb.AppendLine($"tags: [无标签]")
        sb.AppendLine("---")
        sb.AppendLine("say somthing here.")
        File.WriteAllText(f.FullName, sb.ToString)
        Console.WriteLine(f.FullName)
        Console.WriteLine("Your post file is ready to be edited. ")
    End Sub

    Public Sub GenearteBlog(dest As String, Output As Boolean)
        Static lastGen As Date = #1999-01-01#
        Dim destf As New DirectoryInfo(dest)
        If Not destf.Exists Then
            destf.Create()
        End If
        Dim mds = postsFolder.GetFiles("*.md", SearchOption.AllDirectories)
        If Output Then Console.WriteLine($"Start reading *.md files. Count: {mds.Length}")
        Dim goods As Integer = 0
        Dim posts As New List(Of BlogPost)
        Dim usednames As New List(Of String)
        For Each f In mds
            Dim p As New BlogPost(f)
            If usednames.Contains(p.FileName) Then
                Throw New Exception($"This posts file name has been used. {f.FullName}")
            End If
            posts.Add(p)
            usednames.Add(p.FileName)
            goods += 1
        Next
        Dim p2Folder As New DirectoryInfo(Path.Combine(destf.FullName, "posts"))
        If p2Folder.Exists = False Then
            p2Folder.Create()
        End If
        If Output Then Console.WriteLine($"Start writing *.json  posts files. Count: {posts.Count}")
        Dim jsSB As New StringBuilder()
        jsSB.AppendLine()
        jsSB.AppendLine("(function () { let  tt = 'error';")
        Dim lastmn As String = ""
        posts.Sort()
        Dim xw = Xml.XmlWriter.Create(Path.Combine(destf.FullName, "atom.xml"))
        Dim atom As New AtomFeedWriter(xw)
        With atom
            .WriteId("https://walkedby.com/")
            .WriteTitle("戈登走過去的博客")
            .WriteUpdated(New DateTimeOffset(posts.Item(0).Time))
            Dim link As New SyndicationLink(New Uri("https://walkedby.com/atom.xml"), "self")
            .Write(link)
        End With
        Dim smb As New SiteMapBuilder
        Dim tags As New Dictionary(Of String, List(Of BlogPost))
        For Each i In posts
            For Each tag In i.Tags
                Dim list As List(Of BlogPost)
                If tags.ContainsKey(tag) = False Then
                    list = New List(Of BlogPost)
                    tags.Add(tag, list)
                Else
                    list = tags.Item(tag)
                End If
                list.Add(i)
            Next
        Next
        Dim addFolder = Sub(title As String, open As Short)
                            Dim oo = "RndBool()"
                            If open = 0 Then
                                oo = "false"
                            ElseIf open = 1 Then
                                oo = "true"
                            End If
                            jsSB.AppendLine($"tt = {HttpUtility.JavaScriptStringEncode(title, True)};vb6b.AddFolder(tt, {oo});")
                        End Sub
        Dim addPost = Sub(p As BlogPost)
                          jsSB.AppendLine($"vb6b.AddContent({HttpUtility.JavaScriptStringEncode(p.Title, True)}, tt,function (){{OpenPost({HttpUtility.JavaScriptStringEncode(p.FileName, True)});}});")
                      End Sub
        addFolder("最新文章", 1)
        Dim index As Integer = -1
        Dim rssPerson As New SyndicationPerson("戈登走過去", "84y48tt8l@relay.firefox.com")
        For Each i In posts
            index += 1
            Dim uu As New Uri("https://walkedby.com/?po=" + i.FileName)
            Dim jj As String = i.ToJSON()
            File.WriteAllText(Path.Combine(p2Folder.FullName, i.FileName + ".json"), jj)
            smb.AddURL(uu.ToString, i.Time)
            If index < 11 Then
                addPost(i)
            End If
            If index < 15 Then
                Dim rss As New SyndicationItem()
                With rss
                    .Id = uu.ToString
                    .LastUpdated = New DateTimeOffset(i.Time)
                    .Title = i.Title
                    .Published = .LastUpdated
                    .AddLink(New SyndicationLink(uu))
                    .AddContributor(rssPerson)
                    .Description = i.Content
                End With
                atom.Write(rss).Wait()
            End If
        Next
        xw.Close()
        Dim rnd As New Random
        For Each i In tags.Keys
            addFolder(i, 0)
            For Each p In tags.Item(i)
                addPost(p)
            Next
        Next
        jsSB.AppendLine("})();")
        For Each i As String In {"index.html", "main.css", "main.js", "404.html", "max.html"}
            Dim f As New FileInfo(Path.Combine(baseTSFolder.FullName, i))
            If Not f.Exists Then
                Throw New Exception($"Important file missed: {f.FullName}")
            End If
            Dim copyto As New FileInfo(Path.Combine(destf.FullName, i))
            Dim ct = File.ReadAllText(f.FullName)
            If i.Equals("main.js") Then
                ct = ct.Replace("// 首页的JS添加在这里", jsSB.ToString)
            End If
            Dim r As UglifyResult = Nothing
            Dim compressed As Boolean = True
            Select Case f.Extension.ToLower
                Case ".html"
                    r = Uglify.Html(ct)
                Case ".js"
                    r = Uglify.Js(ct)
                Case ".css"
                    r = Uglify.Css(ct)
                Case Else
                    compressed = False
            End Select
            If compressed Then
                If Not r.HasErrors Then
                    ct = r.Code
                Else
                    For Each ie In r.Errors
                        Console.WriteLine(ie.ToString)
                    Next
                    Throw New Exception($"compress error: {f.FullName} ")
                End If
            End If
            File.WriteAllText(copyto.FullName, ct)
        Next
        If Output Then Console.WriteLine("Important files copied.")
        For Each i In sourceFolder.GetDirectories("*", SearchOption.TopDirectoryOnly)
            If i.Name.StartsWith("_") = False Then
                CopyFolder(i, New DirectoryInfo(Path.Combine(destf.FullName, i.Name)))
            End If
        Next
        For Each i In sourceFolder.GetFiles("*", SearchOption.TopDirectoryOnly)
            i.CopyTo(Path.Combine(destf.FullName, i.Name), True)
        Next
        smb.SaveToFile(Path.Combine(destf.FullName, "sitemaps.xml"))
        If Output Then Console.WriteLine("Over")
        lastGen = Now
    End Sub

    Public Sub StartTestServer(port As Integer)
        Dim sv As New HttpListener
        Dim u As String = $"http://localhost:{port}/"
        With sv
            .AuthenticationSchemes = AuthenticationSchemes.Anonymous
            .Prefixes.Add(u)
            .IgnoreWriteExceptions = True
        End With
        sv.Start()
        Console.WriteLine($"Http server started. URL:   {u}")
        Dim testfolder As New DirectoryInfo(Path.Combine(workingFolder.FullName, "test"))
        If testfolder.Exists Then
            testfolder.Delete(True)
        End If
        Dim t1 As New Task(Sub()
                               Do While True
                                   GenearteBlog(testfolder.FullName, False)
                                   Thread.Sleep(5000)
                               Loop
                           End Sub)
        t1.Start()
        Dim f404 As New FileInfo(Path.Combine(testfolder.FullName, "404.html"))
        Do While True
            Try
                Dim r = sv.GetContext
                Dim req = r.Request
                Dim res = r.Response
                Dim requestfile As String = req.RawUrl
                Dim qmindex As Integer = requestfile.IndexOf("?")
                If qmindex > 0 Then
                    requestfile = requestfile.Substring(0, qmindex)
                End If
                Console.WriteLine($"File: {requestfile}  Query: {req.QueryString.Count}")
                If requestfile.Equals("/") Then
                    requestfile += "index.html"
                End If
                Dim finfo As New FileInfo(Path.Combine(testfolder.FullName, requestfile.Remove(0, 1)))
                If finfo.Exists Then
                    Dim bytes = File.ReadAllBytes(finfo.FullName)
                    res.OutputStream.Write(bytes)
                    Console.WriteLine($"write: {finfo.FullName}")
                ElseIf f404.Exists Then
                    res.StatusCode = 404
                    Dim bytes = File.ReadAllBytes(f404.FullName)
                    res.OutputStream.Write(bytes)
                    Console.WriteLine($"write: {f404.FullName}")
                Else
                    res.StatusCode = 500
                    Console.WriteLine($"nothing match.  {finfo.FullName}")
                End If
                res.Close()
            Catch ex As Exception
                Console.WriteLine($"Error: {ex}")
            End Try
        Loop
    End Sub

End Module
