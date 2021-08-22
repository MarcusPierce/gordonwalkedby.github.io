Imports Markdig

Public Class Post
    Implements IComparable

    Private _tags As String() = Array.Empty(Of String)
    Private _tagshtml As String = String.Empty
    Private _releaseDate As Date
    Private _releaseDateISOStr As String
    Private _releaseDateDisplayStr As String

    Protected Sub New()
    End Sub

    Public Property FileName As String
    Public Property Title As String

    <JsonIgnore>
    Public Property ReleaseDate As Date
        Get
            Return _releaseDate
        End Get
        Set(value As Date)
            _releaseDate = value
            _releaseDateISOStr = GetISOTimeFormat(value)
            _releaseDateDisplayStr = GetChineseTimeFormat(value)
        End Set
    End Property

    Public ReadOnly Property ReleaseDateISOStr As String
        Get
            Return _releaseDateISOStr
        End Get
    End Property

    Public ReadOnly Property ReleaseDateDisplayStr As String
        Get
            Return _releaseDateDisplayStr
        End Get
    End Property

    Public Property Tags As String()
        Get
            Return _tags
        End Get
        Set(value As String())
            If value Is Nothing Then
                _tags = Array.Empty(Of String)
                _tagshtml = String.Empty
            Else
                _tags = value
                Dim sb As New StringBuilder
                For Each i In Tags
                    sb.Append("<a>")
                    sb.Append(WebUtility.HtmlEncode(i))
                    sb.Append("</a>")
                Next
                _tagshtml = sb.ToString
            End If
        End Set
    End Property

    <JsonIgnore>
    Public ReadOnly Property TagsHTML As String
        Get
            Return _tagshtml
        End Get
    End Property

    <JsonIgnore>
    Public Property SrcContent As String
    <JsonIgnore>
    Public Property HTMLContent As String
    <JsonIgnore>
    Public Property TextContent As String

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
            Dim cp = Me.ReleaseDate.CompareTo(a.ReleaseDate)
            If cp = 0 Then
                cp = Me.FileName.CompareTo(a.FileName)
            End If
            Return -cp
        End If
        Return 0
    End Function

    Public Shared Function Create(filename As String, src As String) As Post
        If String.IsNullOrWhiteSpace(filename) Then
            Throw New ArgumentNullException(NameOf(filename))
        End If
        If String.IsNullOrWhiteSpace(src) Then
            Throw New ArgumentNullException(NameOf(src))
        End If
        src = src.Trim
        Const mdBlock = "---"
        Const htmlBlock1 = "<!--"
        Const htmlBlock2 = "-->"
        Dim isHTML As Boolean = False
        Dim lineNum As Integer = 0
        Dim title As String = Nothing
        Dim releaseDate As Date = #1900-1-1#
        Dim tags As New List(Of String)
        Dim content As String = Nothing
        Dim headComplete As Boolean = False
        Using reader As New StringReader(src)
            Do While reader.Peek >= 0
                lineNum += 1
                Dim line = reader.ReadLine
                If lineNum < 2 Then
                    If line.StartsWith(mdBlock) Then
                        isHTML = False
                        Continue Do
                    ElseIf line.StartsWith(htmlBlock1) Then
                        isHTML = True
                        Continue Do
                    Else
                        Console.WriteLine($"Error: {filename}")
                        Throw New Exception("Content is not started with --- or <!--")
                    End If
                End If
                If (isHTML = False AndAlso line.StartsWith(mdBlock)) OrElse (isHTML AndAlso line.StartsWith(htmlBlock2)) Then
                    If String.IsNullOrWhiteSpace(title) Then
                        Console.WriteLine($"Error: {filename}")
                        Throw New Exception("Missing title.")
                    ElseIf releaseDate.Year <= 1900 Then
                        Console.WriteLine($"Error: {filename}")
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
                            Console.WriteLine($"Error: {filename}")
                            Throw New Exception("More than one title exists.")
                        End If
                        title = value.Trim
                    Case "date"
                        If releaseDate.Year > 1900 Then
                            Console.WriteLine($"Error: {filename}")
                            Throw New Exception("More than one date exists.")
                        End If
                        value = value.Trim
                        Dim ok = Date.TryParse(value, releaseDate)
                        If Not ok Then
                            Console.WriteLine($"Error: {filename}")
                            Throw New Exception($"Cannot parse date: {value}")
                        End If
                        If releaseDate.Year <= 1900 Then
                            Console.WriteLine($"Error: {filename}")
                            Throw New Exception("The date must be later than 1900-Jan.")
                        End If
                    Case NameOf(tags)
                        If tags.Count > 0 Then
                            Console.WriteLine($"Error: {filename}")
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
            Console.WriteLine($"Error: {filename}")
            Throw New Exception("Head is not complete.")
        End If
        If String.IsNullOrWhiteSpace(content) Then
            Console.WriteLine($"Error: {filename}")
            Throw New Exception("Missing content.")
        End If
        Dim out As New Post() With {
            .FileName = Path.ChangeExtension(filename.Trim.ToLower, Nothing),
            .Title = title,
            .ReleaseDate = releaseDate,
            .Tags = tags.ToArray,
            .SrcContent = content
        }
        If isHTML Then
            out.HTMLContent = content
            out.TextContent = GetXMLInnerText(content)
        Else
            out.HTMLContent = Markdown.ToHtml(content)
            out.TextContent = Markdown.ToPlainText(content)
        End If
        Static textFormatreg As New Regex("( |\r|\n|\t)+", RegexOptions.Compiled And RegexOptions.Singleline)
        If Not String.IsNullOrEmpty(out.TextContent) Then
            out.TextContent = textFormatreg.Replace(out.TextContent, " ").Trim()
        End If
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
