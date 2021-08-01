Module Helpers

    Public Function ReadFileAllText(filepath As String) As String
        Using reader As New StreamReader(File.Open(filepath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            Return reader.ReadToEnd()
        End Using
    End Function

    Public Function StringsContains(array As IEnumerable(Of String), finds As String, comp As StringComparison) As Boolean
        If finds Is Nothing OrElse array Is Nothing Then Return False
        For Each i In array
            If i Is Nothing Then
                Continue For
            End If
            If i.Equals(finds, comp) Then
                Return True
            End If
        Next
        Return False
    End Function

    Public Function GetChineseTimeFormat(dt As Date) As String
        Const weekdays As String = "日一二三四五六"
        Dim str As String = dt.ToString("yyyy 年 MM 月 dd 日") + " 星期" + weekdays(CInt(dt.DayOfWeek))
        Return str
    End Function

    Public Function GetISOTimeFormat(dt As Date) As String
        Return $"{dt:yyyy-MM-ddTHH:mm:ss}.000+0800"
    End Function

    Public Function GetRFCTimeFormat(dt As Date) As String
        Return $"{dt:yyyy-MM-ddTHH:mm:ss}.000-08:00"
    End Function

    Public Function GetMIMEType(fileExt As String) As String
        If String.IsNullOrWhiteSpace(fileExt) Then Return Nothing
        fileExt = fileExt.Trim("."c, " "c, "\"c, "/"c).ToLower
        If fileExt.Length < 1 Then Return Nothing
        Select Case fileExt
            Case "js"
                Return "application/javascript; charset=utf-8"
            Case "css"
                Return "text/css; charset=utf-8"
            Case "json"
                Return "application/json; charset=utf-8"
            Case "ico"
                Return "image/x-icon"
            Case "jpg", "jpeg"
                Return "image/jpeg"
            Case "png"
                Return "image/png"
            Case "woff2"
                Return "font/woff2"
            Case "webp"
                Return "image/webp"
            Case "xml"
                Return "application/xml"
            Case "html"
                Return "text/html; charset=utf-8"
        End Select
        Return Nothing
    End Function

    Public Function GetXMLInnerText(src As String) As String
        Static getInnerText As New Regex("<.+?>", RegexOptions.Compiled And RegexOptions.Singleline)
        If String.IsNullOrWhiteSpace(src) Then
            Return String.Empty
        End If
        Return WebUtility.HtmlDecode(getInnerText.Replace(src, String.Empty))
    End Function

End Module
