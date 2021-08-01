Module Program

    Public WorkFolder As New DirectoryInfo(AppContext.BaseDirectory)
    Public HtmlFolder As DirectoryInfo = Nothing
    Public PostsFolder As DirectoryInfo = Nothing
    Public StaticsFolder As DirectoryInfo = Nothing

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
                If String.IsNullOrWhiteSpace(commandValue) Then
                    Throw New Exception("You must give me a article file name.")
                End If
            Case "s"
                Dim port As Integer = 21081
                If Not String.IsNullOrWhiteSpace(commandValue) Then
                    Dim v = 0
                    If Integer.TryParse(commandValue, v) AndAlso v > 0 AndAlso v < UShort.MaxValue Then
                        port = v
                    End If
                End If
                HTMLGenerator.StartHTTPListener(port)
            Case "g"
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
        Console.WriteLine($"Found work folder: {fullname}")
    End Sub

End Module
