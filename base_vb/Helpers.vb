Public Module Helpers

    ''' <summary>
    ''' 格式化 CRLF　到同一个字符串
    ''' </summary>
    ''' <returns></returns>
    Public Function ResetCRLF(str As String, replaceto As String) As String
        If str Is Nothing OrElse str.Length < 1 Then Return ""
        If replaceto Is Nothing OrElse replaceto.Length < 1 Then
            str = str.Replace(vbCr, "").Replace(vbLf, "")
        Else
            str = str.Replace(vbCrLf, vbLf).Replace(vbCr, vbLf).Replace(vbLf, replaceto)
        End If
        Return str
    End Function

    ''' <summary>
    ''' 把Date变成unix时间戳，单位是毫秒
    ''' </summary>
    ''' <returns></returns>
    Public Function ToUNIXTime(d As Date) As Long
        Dim f As New DateTimeOffset(d)
        Return f.ToUnixTimeMilliseconds()
    End Function

    ''' <summary>
    ''' 把source文件夹复制到目的地
    ''' </summary>
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

End Module
