Module Program

    Public WorkFolder As New DirectoryInfo(AppContext.BaseDirectory)
    Public HtmlFolder As DirectoryInfo = Nothing
    Public PostsFolder As DirectoryInfo = Nothing
    Public StaticsFolder As DirectoryInfo = Nothing
    Public DocsFolder As DirectoryInfo = Nothing

    Sub Main(args As String())
        Console.WriteLine("Welcome! This is made for walkedby.com")
        If args.Length < 1 Then
            Throw New Exception("I need command to work!")
        End If
        LocateWorkFolder()
        Dim command As String = args(0).ToLower
        Dim commandValue As String = Nothing
        If args.Length > 1 Then
            commandValue = args(1)
        End If
        RefreshHTMLFiles()
        RefreshPosts()
        Select Case command
            Case "new"
                CreateNewPost(commandValue)
            Case "newproject"
                CreateNewSubProject(commandValue)
            Case "s"
                If Posts.Count < 1 Then
                    Throw New Exception("I cannot found any post! You must add one first.")
                End If
                Dim port As Integer = 21081
                If Not String.IsNullOrWhiteSpace(commandValue) Then
                    Dim v = 0
                    If Integer.TryParse(commandValue, v) AndAlso v > 0 AndAlso v < UShort.MaxValue Then
                        port = v
                    End If
                End If
                HTMLGenerator.StartHTTPListener(port)
            Case "g"
                If Posts.Count < 1 Then
                    Throw New Exception("I cannot found any post! You must add one first.")
                End If
                HTMLGenerator.GenerateAllFiles()
            Case Else
                Throw New Exception($"Bad command: {command} {commandValue}")
        End Select
    End Sub

    Sub LocateWorkFolder()
        Console.WriteLine("try to locate work folder.")
        Dim needNames = {"html", "posts", "statics"}
        Dim ok = False
        For trys As Byte = 0 To 19
            Dim subfolders = WorkFolder.GetDirectories("*", SearchOption.TopDirectoryOnly)
            If subfolders IsNot Nothing AndAlso subfolders.Length > 0 Then
                Dim goods As Integer = 0
                For Each fd In subfolders
                    If StringsContains(needNames, fd.Name, StringComparison.OrdinalIgnoreCase) Then
                        goods += 1
                    End If
                Next
                If goods = needNames.Length Then
                    ok = True
                    Exit For
                End If
            End If
            Dim parent = WorkFolder.Parent
            If parent Is Nothing Then
                Throw New Exception($"top folder reached: {WorkFolder.FullName}")
            End If
            WorkFolder = parent
        Next
        If Not ok Then
            Throw New Exception($"Retry too many times, cannot found work folder.")
        End If
        Dim fullname = WorkFolder.FullName
        HtmlFolder = New DirectoryInfo(Path.Combine(fullname, "html"))
        PostsFolder = New DirectoryInfo(Path.Combine(fullname, "posts"))
        StaticsFolder = New DirectoryInfo(Path.Combine(fullname, "statics"))
        DocsFolder = New DirectoryInfo(Path.Combine(WorkFolder.FullName, "docs"))
        Console.WriteLine($"Found work folder: {fullname}")
    End Sub

    Sub CheckNewPostName(ByRef name As String)
        If String.IsNullOrWhiteSpace(name) Then
            Throw New Exception("You must give me a article file name.")
        End If
        name = name.ToLower
        If Not IsGoodFileName(name) Then
            Throw New Exception($"The name can only use English letters and numbers: {name}")
        End If
        If Posts.ContainsKey(name) Then
            Throw New Exception($"This name has been used: {name}")
        End If
    End Sub

    Sub CreateNewPost(name As String)
        CheckNewPostName(name)
        Dim time = Date.Now
        Dim dic = Path.Combine(PostsFolder.FullName, time.ToString("yyyy/MM"))
        If Directory.Exists(dic) = False Then
            Directory.CreateDirectory(dic)
        End If
        Dim f = Path.Combine(dic, $"{name}.md")
        File.WriteAllText(f, $"---
title: {name}
date: {time:yyyy-MM-dd}
tags: [标签1,标签2]
---
三天之内鲨了你")
        Console.WriteLine("You can edit it: ")
        Console.WriteLine(f)
    End Sub

    Sub CreateNewSubProject(name As String)
        CheckNewPostName(name)
        Dim time = Date.Now
        Dim dic = PostsFolder.CreateSubdirectory(name)
        Dim fullname = dic.FullName
        Dim f = Path.Combine(fullname, "index.html")
        File.WriteAllText(f, $"<!--
title: {name}
date: {time:yyyy-MM-dd}
tags: [标签1,标签2]
-->
<p>三天之内鲨了你 a~</p>
<script src=""/js/{name}.js""></script>")
        f = Path.Combine(fullname, "tsconfig.json")
        File.WriteAllText(f, My.Resources.defaultTSconfig.Replace("%名字%", name))
        Console.WriteLine("You can edit it:")
        Console.WriteLine(fullname)
    End Sub

End Module
