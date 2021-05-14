Module Program

    Sub Main(args As String())
        Console.WriteLine("welcome")
        SetConsoleEncoding()
        Console.WriteLine("���������������Ǹ�����^ȥ�Ĳ���������")
        If args.Length < 1 Then
            Console.WriteLine("û���κβ�����
���ò�����
new name - ����һƪ������
g - ����ϵ����ɽ���������µĵ� docs �ļ���
s - �������ط�����
")
            Environment.Exit(0)
        End If
        FindWorkFolder()
        Dim command As String = args(0)
        Select Case command
            Case "new"
                Dim name = args(1)
                CreateNewPost(name)
            Case "g"
                Generator.ReadLocalFiles()
                Generator.GenerateAll()
                Console.WriteLine("���ɽ�����")
            Case "s"
                Generator.ReadLocalFiles()
                Generator.StartTestServer()
            Case Else
                Throw New Exception("��ƥ���κο��ò���")
        End Select
    End Sub

    Sub FindWorkFolder()
        Dim needFolders As String() = {"source", "typescript", "html"}
        Dim dc As New DirectoryInfo(Directory.GetCurrentDirectory())
        For i As Integer = 0 To 9
            Dim topFolders = dc.GetDirectories("*", SearchOption.TopDirectoryOnly)
            Dim goods = 0
            For Each fd In topFolders
                If needFolders.Contains(fd.Name) Then
                    goods += 1
                    If goods >= needFolders.Length Then
                        Directory.SetCurrentDirectory(dc.FullName)
                        Console.WriteLine("�����ļ��ж�λ�ɹ���")
                        Console.WriteLine(dc.FullName)
                        Exit Sub
                    End If
                End If
            Next
            dc = dc.Parent
            If dc Is Nothing Then
                Exit For
            End If
        Next
        Throw New Exception("�޷���λ�����ʵĹ����ļ��У�")
    End Sub

    Function GetAllBlogPosts() As List(Of BlogPost)
        Dim postsFolder As New DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory, "source", "_posts"))
        Dim mds = postsFolder.GetFiles("*.md", SearchOption.AllDirectories)
        Dim goods As Integer = 0
        Dim posts As New List(Of BlogPost)
        Dim usednames As New List(Of String)
        For Each f In mds
            Dim p As New BlogPost(f)
            If usednames.Contains(p.FileName) Then
                Throw New Exception($"������µ��ļ����Ѿ���ʹ�ù��� �� {f.FullName}")
            End If
            posts.Add(p)
            usednames.Add(p.FileName)
            goods += 1
        Next
        posts.Sort()
        Return posts
    End Function

    Sub CreateNewPost(name As String)
        If String.IsNullOrWhiteSpace(name) Then
            Throw New Exception("�������ֲ���Ϊ�գ�")
        End If
        Dim posts = GetAllBlogPosts()
        name = name.ToLower.Trim
        For Each p In posts
            If p.FileName.Equals(name) Then
                Throw New Exception($"���ļ����Ѿ���ʹ�ù��ˣ� {name}")
            End If
        Next
        Dim dt = Now
        Dim dict = Path.Combine(Directory.GetCurrentDirectory, "source", "_posts", dt.Year.ToString, dt.Month.ToString.PadLeft(2, "0"c))
        Directory.CreateDirectory(dict)
        Dim pt = Path.Combine(dict, $"{name}.md")
        Using writer As New StreamWriter(File.Create(pt), UTF8)
            With writer
                .AutoFlush = True
                .WriteLine("---")
                .WriteLine($"title: {name}")
                .WriteLine($"date: {dt:yyyy-MM-dd HH:mm:ss}")
                .WriteLine($"tags: [��ǩ1,��ǩ2]")
                .WriteLine("---")
            End With
        End Using
        Console.WriteLine("�հ����´����ɹ���")
        Console.WriteLine(pt)
    End Sub

End Module
