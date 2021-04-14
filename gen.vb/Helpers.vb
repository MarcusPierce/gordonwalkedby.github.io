
Public Module Helpers

    Public ReadOnly Property UTF8 As New UTF8Encoding(False)

    Public Function ResetLF(str As String, Optional replaceto As String = vbLf) As String
        If str Is Nothing OrElse str.Length < 1 Then Return ""
        If replaceto Is Nothing OrElse replaceto.Length < 1 Then
            str = str.Replace(vbCr, "").Replace(vbLf, "")
        Else
            str = str.Replace(vbCrLf, vbLf).Replace(vbCr, vbLf)
            If replaceto.Equals(vbLf) = False Then
                str = str.Replace(vbLf, replaceto)
            End If
        End If
        Return str
    End Function

    Public Sub CopyFolder(source As DirectoryInfo, dest As DirectoryInfo)
        If dest.Exists = False Then
            dest.Create()
        End If
        Dim files = source.GetFiles("*", SearchOption.AllDirectories)
        If files.Length < 1 Then
            Exit Sub
        End If
        For Each i In files
            Dim pp As String = i.DirectoryName.Replace(source.FullName, "").Trim("/", "\")
            Dim nn = dest
            If pp.Length > 0 Then
                nn = New DirectoryInfo(Path.Combine(dest.FullName, pp))
                If nn.Exists = False Then
                    nn.Create()
                End If
            End If
            i.CopyTo(Path.Combine(nn.FullName, i.Name), True)
        Next
    End Sub

    Public Sub SetConsoleEncoding()
        If Environment.OSVersion.Platform.Equals(PlatformID.Win32NT) Then
            Encoding.RegisterProvider(Text.CodePagesEncodingProvider.Instance)
            Console.OutputEncoding = Encoding.GetEncoding(936)
        Else
            Console.OutputEncoding = UTF8
        End If
        Console.WriteLine($"Console Encoding: {Console.OutputEncoding.EncodingName}")
    End Sub

End Module
