Imports Markdig

Public Class Post
    Implements IComparable

    Protected Sub New(filename As String, title As String, releaseDate As Date, tags As String(), mdcontent As String)
        Me.FileName = Path.ChangeExtension(filename.ToLower, Nothing)
        Me.Title = title
        Me.ReleaseDate = releaseDate
        Me.ReleaseDateDisplayStr = GetChineseTimeFormat(releaseDate)
        Me.ReleaseDateISOStr = GetISOTimeFormat(releaseDate)
        If tags Is Nothing Then
            tags = Array.Empty(Of String)
        End If
        Me.Tags = tags
        Me.MDContent = mdcontent
        Me.HTMLContent = Markdown.ToHtml(mdcontent)
        If tags.Length > 0 Then
            Dim sb As New StringBuilder
            For Each i In tags
                sb.Append("<a>")
                sb.Append(WebUtility.HtmlEncode(i))
                sb.Append("</a>")
            Next
            Me.TagsHTML = sb.ToString
        Else
            Me.TagsHTML = String.Empty
        End If
    End Sub

    Public ReadOnly Property FileName As String
    Public ReadOnly Property Title As String
    Public ReadOnly Property ReleaseDateISOStr As String
    Public ReadOnly Property ReleaseDateDisplayStr As String
    <JsonIgnore>
    Public ReadOnly Property ReleaseDate As Date
    Public ReadOnly Property Tags As String()
    <JsonIgnore>
    Public ReadOnly Property TagsHTML As String
    <JsonIgnore>
    Public ReadOnly Property MDContent As String
    <JsonIgnore>
    Public ReadOnly Property HTMLContent As String

    Public Overrides Function ToString() As String
        Return $"[{FileName}]{Title} {ReleaseDate}"
    End Function

    Public Overrides Function Equals(obj As Object) As Boolean
        If obj IsNot Nothing AndAlso obj.GetType.Equals(GetType(Post)) Then
            Dim a As Post = CType(obj, Post)
            Return a.FileName.Equals(Me.FileName)
        End If
        Return False
    End Function

    Public Overrides Function GetHashCode() As Integer
        Return Me.FileName.GetHashCode
    End Function

    Public Function CompareTo(obj As Object) As Integer Implements IComparable.CompareTo
        If obj IsNot Nothing AndAlso obj.GetType.Equals(GetType(Post)) Then
            Dim a As Post = CType(obj, Post)
            Return -Me.ReleaseDate.CompareTo(a.ReleaseDate)
        End If
        Return 0
    End Function

    Public Shared Function CreateFromMDText(filename As String, md As String) As Post
        If String.IsNullOrWhiteSpace(filename) Then
            Throw New ArgumentNullException(NameOf(filename))
        End If
        If String.IsNullOrWhiteSpace(md) Then
            Throw New ArgumentNullException(NameOf(md))
        End If
        md = md.Trim
        Const headBlock = "---"
        Dim lineNum As Integer = 0
        Dim title As String = Nothing
        Dim releaseDate As Date = #1900-1-1#
        Dim tags As New List(Of String)
        Dim content As String = Nothing
        Dim headComplete As Boolean = False
        Using reader As New StringReader(md)
            Do While reader.Peek >= 0
                lineNum += 1
                Dim line = reader.ReadLine
                If lineNum < 2 Then
                    If line.StartsWith(headBlock) Then
                        Continue Do
                    Else
                        Throw New Exception("Content is not started with ---")
                    End If
                End If
                If line.StartsWith(headBlock) Then
                    If String.IsNullOrWhiteSpace(title) Then
                        Throw New Exception("Missing title.")
                    ElseIf releaseDate.Year <= 1900 Then
                        Throw New Exception("Missing date.")
                    End If
                    content = reader.ReadToEnd
                    headComplete = True
                    Exit Do
                End If
                Dim middlepos = line.IndexOf(": ")
                If middlepos < 2 Then
                    Continue Do
                End If
                Dim key = line.Substring(0, middlepos)
                If String.IsNullOrWhiteSpace(key) Then
                    Continue Do
                End If
                Dim value = line.Substring(middlepos + 2)
                If String.IsNullOrWhiteSpace(value) Then
                    Continue Do
                End If
                Select Case key
                    Case NameOf(title)
                        If title IsNot Nothing Then
                            Throw New Exception("More than one title exists.")
                        End If
                        title = value.Trim
                    Case "date"
                        If releaseDate.Year > 1900 Then
                            Throw New Exception("More than one date exists.")
                        End If
                        value = value.Trim
                        Dim ok = Date.TryParse(value, releaseDate)
                        If Not ok Then
                            Throw New Exception($"Cannot parse date: {value}")
                        End If
                        If releaseDate.Year <= 1900 Then
                            Throw New Exception("The date must be later than 1900-Jan.")
                        End If
                    Case NameOf(tags)
                        If tags.Count > 0 Then
                            Throw New Exception("Tags can only be in one line.")
                        End If
                        value = value.Trim(" "c, "["c, "]"c)
                        If value.Contains(","c) Then
                            Dim values = value.Split(","c, StringSplitOptions.RemoveEmptyEntries)
                            For Each i In values
                                i = i.Trim.ToLower
                                If Not tags.Contains(i) Then
                                    tags.Add(i)
                                End If
                            Next
                        Else
                            tags.Add(value.ToLower)
                        End If
                End Select
            Loop
        End Using
        If Not headComplete Then
            Throw New Exception("Head is not complete.")
        End If
        If String.IsNullOrWhiteSpace(content) Then
            Throw New Exception("Missing content.")
        End If
        Dim out As New Post(filename.Trim, title, releaseDate, tags.ToArray, content)
        Return out
    End Function

    Public Shared Function GetPostsJson(ps As IEnumerable(Of Post)) As String
        Dim ls As New List(Of Post)
        ls.AddRange(ps)
        ls.Sort()
        Dim array = ls.ToArray
        Dim j = JsonSerializer.Serialize(array)
        Return j
    End Function

End Class
