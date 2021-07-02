Imports Markdig

Public Class BlogPost
    Implements IComparable

    Public Sub New(f As FileInfo)
        Const regop As RegexOptions = RegexOptions.IgnoreCase + RegexOptions.Singleline
        Dim mdsource As String = File.ReadAllText(f.FullName)
        If mdsource.Length < 1 Then
            Throw New Exception($"空的 .md 文件: {f.FullName}")
        End If
        mdsource = ResetLF(mdsource, vbLf)
        Dim header = Regex.Match(mdsource, "-{3,}\ntitle: (.+?)\ndate: ([0-9\-\: ]+).*?\ntags: (.+?)\n-{3,}\n(.+)", regop)
        If Not header.Success Then
            Throw New Exception($"文章头部解析出错: {f.FullName}")
        End If
        Dim dtstr = header.Result("$2")
        Dim dt As New Date(2100, 1, 1)
        If Date.TryParse(dtstr, dt) = False OrElse dt.Year > 2099 Then
            Throw New Exception($"无法解析文章发布时间: {dtstr}  {f.FullName}")
        End If
        Dim tt As String = header.Result("$1").Trim
        Dim content = header.Result("$4")
        HTMLContent = Markdown.ToHtml(content)
        Dim tagstr = header.Result("$3").Trim.ToUpper
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
                Throw New Exception($"该文章有多个标签，必须使用 [] 把他们框起来  {f.FullName}")
            End If
        Else
            tagstr = tagstr.Trim("[", "]")
            tags.Add(tagstr)
        End If
        Me.Tags = tags.ToArray
        Me.FileName = f.Name.Substring(0, f.Name.Length - f.Extension.Length).ToLower()
        Me.MDContent = content.Trim
        Me.Time = dt
        Me.Title = tt
    End Sub

    Public ReadOnly Property FileName As String

    Public ReadOnly Property Title As String

    Public ReadOnly Property Time As Date

    Public ReadOnly Property MDContent As String

    Public ReadOnly Property HTMLContent As String

    Public ReadOnly Property Tags As String()

    Public Function ToArticle() As Article
        Dim a As New Article With {.FileName = FileName,
            .Title = Title,
            .Tags = Tags
        }
        Return a
    End Function

    Public Function CompareTo(obj As Object) As Integer Implements IComparable.CompareTo
        If obj.GetType.Equals(Me.GetType) Then
            Dim bp As BlogPost = obj
            Dim c = -Me.Time.CompareTo(bp.Time)
            If c = 0 Then
                c = Me.FileName.CompareTo(bp.FileName)
            End If
            Return c
        End If
        Return 0
    End Function

End Class
