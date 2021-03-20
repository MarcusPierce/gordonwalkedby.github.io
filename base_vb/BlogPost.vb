Public Class BlogPost
    Implements IComparable

    Public Sub New()
    End Sub

    Public Sub New(f As FileInfo)
        Const regop As RegexOptions = RegexOptions.IgnoreCase + RegexOptions.Singleline
        Dim text As String = File.ReadAllText(f.FullName)
        If text.Length < 1 Then
            Throw New Exception($"empty markdown file: {f.FullName}")
        End If
        text = ResetCRLF(text, vbLf)
        Dim m = Regex.Match(text, "-{3,}\ntitle: (.+?)\ndate: ([0-9\-]+).*?\ntags: (.+?)\n-{3,}\n(.+)", regop)
        If Not m.Success Then
            Throw New Exception($"bad format markdown file: {f.FullName}")
        End If
        Dim dtstr = m.Result("$2")
        Dim dt As New Date(2100, 1, 1)
        If Date.TryParse(dtstr, dt) = False OrElse dt.Year > 2099 Then
            Throw New Exception($"Cant parse this time: {dtstr}  {f.FullName}")
        End If
        Dim tt As String = m.Result("$1").Trim
        Dim content = m.Result("$4")
        content = Markdown.ToHtml(content)
        Dim timestr = ""
        If dt.Year >= 2000 Then
            timestr = $"<br>'本文发布于 {dt:yyyy年 MM月 dd日}"
        End If
        Dim headcomments As String = $"'{HttpUtility.HtmlEncode(tt)}{timestr}<br>'本网站所有文章，除非另外注明，否则皆采用 <a href='https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh' target='_blank'>CC BY-NC-SA 4.0</a> 进行许可。 "
        content = $"<span class='winformComment'>{headcomments}</span><br>" + content
        Dim tagstr = m.Result("$3").Trim.ToLower
        Dim tags As New List(Of String)
        If tagstr.Contains(","c) Then
            If tagstr.StartsWith("[") AndAlso tagstr.EndsWith("]") Then
                tagstr = tagstr.Trim("[", "]")
                Dim words = tagstr.Split(","c)
                For Each i In words
                    i = i.Trim
                    If i.Length > 0 AndAlso tags.Contains(i) = False Then
                        tags.Add(i)
                    End If
                Next
            Else
                Throw New Exception($"You have tags more than one. You should use [].  {f.FullName}")
            End If
        Else
            tagstr = tagstr.Trim("[", "]")
            tags.Add(tagstr)
        End If
        Me.Tags = tags.ToArray
        Me.FileName = f.Name.Substring(0, f.Name.Length - f.Extension.Length).ToLower()
        Me.Content = content.Trim
        Me.Time = dt
        Me.Title = tt
    End Sub

    <JsonIgnore>
    Public Property FileName As String

    Public Property Title As String

    ''' <summary>
    ''' 文章发布时间
    ''' </summary>
    ''' <returns></returns>
    <JsonIgnore>
    Public ReadOnly Property Time As Date

    Public Property Content As String

    <JsonIgnore>
    Public Property Tags As String()

    Public Function ToJSON() As String
        Return JsonConvert.SerializeObject(Me)
    End Function

    Public Function CompareTo(obj As Object) As Integer Implements IComparable.CompareTo
        If obj.GetType.Equals(Me.GetType) Then
            Dim bp As BlogPost = obj
            Return -Me.Time.CompareTo(bp.Time)
        End If
        Return 0
    End Function

End Class
