Imports System.Xml

Public Class SiteMapBuilder

    Const NameSp = "http://www.sitemaps.org/schemas/sitemap/0.9"
    Dim xs As New XmlDocument
    Dim root As XmlElement

    Public Sub New()
        root = xs.CreateElement("urlset", NameSp)
        xs.AppendChild(root)
    End Sub

    Public Sub AddURL(url As String, time As Date)
        Dim node As XmlNode = xs.CreateNode(XmlNodeType.Element, "url", NameSp)
        Dim loc = xs.CreateNode(XmlNodeType.Element, "loc", NameSp)
        loc.InnerText = url
        node.AppendChild(loc)
        Dim lastmod = xs.CreateNode(XmlNodeType.Element, "lastmod", NameSp)
        lastmod.InnerText = time.ToString("yyyy-MM-dd")
        node.AppendChild(lastmod)
        root.AppendChild(node)
    End Sub

    Public Sub SaveToFile(f As String)
        Using writer As XmlWriter = XmlWriter.Create(f)
            xs.WriteTo(writer)
        End Using
    End Sub

End Class
