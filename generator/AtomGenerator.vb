Imports System.Xml

Public Class AtomGenerator

    Public Const namespaceURI = "http://www.w3.org/2005/Atom"
    Private ReadOnly authorName As String
    Private ReadOnly doc As New XmlDocument()
    Private ReadOnly root As XmlElement

    Public Sub New(title As String, indexUrl As String, selfURL As String, updated As Date, authorName As String)
        doc.AppendChild(doc.CreateXmlDeclaration("1.0", "utf-8", Nothing))
        root = doc.CreateElement("feed", namespaceURI)
        doc.AppendChild(root)
        Dim tt = doc.CreateElement("title", namespaceURI)
        tt.InnerText = title
        root.AppendChild(tt)
        Dim id = doc.CreateElement("id", namespaceURI)
        id.InnerText = indexUrl
        root.AppendChild(id)
        Dim time = doc.CreateElement("updated", namespaceURI)
        time.InnerText = GetRFCTimeFormat(updated)
        root.AppendChild(time)
        Me.authorName = authorName
        root.AppendChild(GetAuthorNode)
        Dim link = doc.CreateElement("link", namespaceURI)
        link.SetAttribute("rel", "self")
        link.SetAttribute("href", selfURL)
        root.AppendChild(link)
    End Sub

    Private Function GetAuthorNode() As XmlElement
        Dim a As XmlElement = doc.CreateElement("author", namespaceURI)
        Dim n = doc.CreateElement("name", namespaceURI)
        n.InnerText = authorName
        a.AppendChild(n)
        Return a
    End Function

    Public Sub AddEntry(title As String, fullURL As String, updated As Date, Optional content As String = Nothing, Optional contentType As String = Nothing)
        Dim e = doc.CreateElement("entry", namespaceURI)
        Dim id = doc.CreateElement("id", namespaceURI)
        id.InnerText = fullURL
        e.AppendChild(id)
        Dim tt = doc.CreateElement("title", namespaceURI)
        tt.InnerText = title
        e.AppendChild(tt)
        Dim time = doc.CreateElement("updated", namespaceURI)
        time.InnerText = GetRFCTimeFormat(updated)
        e.AppendChild(time)
        e.AppendChild(GetAuthorNode)
        If Not String.IsNullOrWhiteSpace(content) Then
            Dim ct = doc.CreateElement("content", namespaceURI)
            If Not String.IsNullOrWhiteSpace(contentType) Then
                ct.SetAttribute("type", contentType)
            End If
            ct.InnerText = content
            e.AppendChild(ct)
        End If
        root.AppendChild(e)
    End Sub

    Public Overrides Function ToString() As String
        Return doc.InnerXml
    End Function

End Class
