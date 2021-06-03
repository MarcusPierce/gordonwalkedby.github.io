
Public Class InsideJSON

    Private _articles As New List(Of ArticleCollection)

    Public Sub New()
    End Sub

    Public ReadOnly Property Articles As ArticleCollection()
        Get
            Return _articles.ToArray
        End Get
    End Property

    Public Sub AddArticleCollection(name As String, articles As BlogPost())
        Dim c As New ArticleCollection With {.Name = name}
        Dim li As New List(Of Article)
        For Each p In articles
            li.Add(p.ToArticle)
        Next
        c.Articles = li.ToArray
        _articles.Add(c)
    End Sub

    Public Overrides Function ToString() As String
        Return Json.JsonSerializer.Serialize(Me)
    End Function

End Class

Public Class ArticleCollection

    Public Sub New()
    End Sub

    Public Property Name As String
    Public Property Articles As Article()

End Class

Public Class Article

    Public Sub New()
    End Sub

    Public Property Title As String
    Public Property FileName As String

End Class
