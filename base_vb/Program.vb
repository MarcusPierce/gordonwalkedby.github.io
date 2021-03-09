
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
        Dim dc = New DirectoryInfo(Directory.GetCurrentDirectory)
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
        Dim dc As New DirectoryInfo(Path.Combine(postsFolder.FullName, Now.ToString("yyyy/MM")))
        If dc.Exists = False Then
            dc.Create()
        End If
        Dim f As New FileInfo(Path.Combine(dc.FullName, t2))
        Dim sb As New StringBuilder
        sb.AppendLine("---")
        sb.AppendLine($"title: {title}")
        sb.AppendLine($"date: {Now:yyyy-MM-dd}")
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
        Dim regop As RegexOptions = RegexOptions.IgnoreCase + RegexOptions.Singleline
        Dim mds = postsFolder.GetFiles("*.md", SearchOption.AllDirectories)
        If Output Then Console.WriteLine($"Start reading *.md files. Count: {mds.Length}")
        Dim goods As Integer = 0
        Dim posts As New List(Of BlogPost)
        Dim usednames As New List(Of String)
        For Each f In mds
            Dim text As String = File.ReadAllText(f.FullName)
            If text.Length < 1 Then
                Throw New Exception($"empty markdown file: {f.FullName}")
            End If
            text = ResetCRLF(text, vbLf)
            Dim m = Regex.Match(text, "-{3,}\ntitle: (.+?)\ndate: ([0-9\-]+).*?\n-{3,}\n(.+)", regop)
            If Not m.Success Then
                Throw New Exception($"bad format markdown file: {f.FullName}")
            End If
            Dim dtstr = m.Result("$2")
            Dim dt As New Date(2100, 1, 1)
            If Date.TryParse(dtstr, dt) = False OrElse dt.Year > 2099 Then
                Throw New Exception($"Cant parse this time: {dtstr}  {f.FullName}")
            End If
            Dim tt As String = m.Result("$1").Trim
            Dim content = m.Result("$3")
            content = Markdown.ToHtml(content)
            Dim headcomments As String = $"'{HttpUtility.HtmlEncode(tt)}<br>'本文发布于 {dt:yyyy年 MM月 dd日}<br>'本网站所有文章，除非另外注明，否则皆采用 <a href='https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh' target='_blank'>CC BY-NC-SA 4.0</a> 进行许可。 "
            content = $"<span class='winformComment'>{headcomments}</span><br>" + content
            Dim p As New BlogPost With {.FileName = f.Name.Substring(0, f.Name.Length - f.Extension.Length).ToLower()}
            If usednames.Contains(p.FileName) Then
                Throw New Exception($"This posts file name has been used. {f.FullName}")
            End If
            With p
                .Title = tt
                .Time = ToUNIXTime(dt)
                .privateTime = dt
                .Content = content.Trim
            End With
            posts.Add(p)
            usednames.Add(p.FileName)
            goods += 1
        Next
        Dim p2Folder As New DirectoryInfo(Path.Combine(destf.FullName, "posts"))
        If p2Folder.Exists = False Then
            p2Folder.Create()
        End If
        If Output Then Console.WriteLine($"Start writing *.json  posts files. Count: {posts.Count}")
        Dim sb As New StringBuilder()
        sb.AppendLine()
        sb.AppendLine("(function () { let  tt = 'error';")
        Dim lastmn As String = ""
        posts.Sort()
        Dim xw = Xml.XmlWriter.Create(Path.Combine(destf.FullName, "atom.xml"))
        Dim atom As New AtomFeedWriter(xw)
        Dim index As Integer = -1
        Dim smb As New SiteMapBuilder
        For Each i In posts
            index += 1
            Dim uu As New Uri("https://walkedby.com/?po=" + i.FileName)
            Dim mn As String = i.privateTime.ToString("yyyy年 MM月")
            If mn.Equals(lastmn) = False Then
                sb.AppendLine($"tt = {HttpUtility.JavaScriptStringEncode(mn, True)};vb6b.AddFolder(tt, true);")
                lastmn = mn
            End If
            sb.AppendLine($"vb6b.AddContent({HttpUtility.JavaScriptStringEncode(i.Title, True)}, tt,function (){{OpenPost({HttpUtility.JavaScriptStringEncode(i.FileName, True)});}});")
            Dim jj As String = i.ToJSON()
            File.WriteAllText(Path.Combine(p2Folder.FullName, i.FileName + ".json"), jj)
            ' File.WriteAllText(Path.Combine(p2Folder.FullName, mn + "_" + i.FileName + ".html"), i.Content)
            smb.AddURL(uu.ToString, i.privateTime)
            If index < 15 Then
                Dim rss As New SyndicationItem()
                With rss
                    .Id = uu.ToString
                    .LastUpdated = New DateTimeOffset(i.privateTime)
                    .Title = i.Title
                    .Published = .LastUpdated
                    .AddLink(New SyndicationLink(uu))
                    .AddContributor(New SyndicationPerson("戈登走過去", "w@w"))
                End With
                atom.Write(rss).Wait()
            End If
        Next
        xw.Close()
        sb.AppendLine("})();")
        smb.SaveToFile(Path.Combine(destf.FullName, "sitemaps.xml"))
        For Each i As String In {"index.html", "main.css", "main.js", "404.html", "max.html"}
            Dim f As New FileInfo(Path.Combine(baseTSFolder.FullName, i))
            If Not f.Exists Then
                Throw New Exception($"Important file missed: {f.FullName}")
            End If
            Dim copyto As New FileInfo(Path.Combine(destf.FullName, i))
            f.CopyTo(copyto.FullName, True)
            If i.Equals("main.js") Then
                Dim ct = File.ReadAllText(copyto.FullName)
                ct = ct.Replace("// 首页的JS添加在这里", sb.ToString)
                File.WriteAllText(copyto.FullName, ct)
            End If
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
