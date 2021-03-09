Public Class BlogPost
    Implements IComparable

    Public Sub New()
    End Sub

    <JsonIgnore>
    Public Property FileName As String

    Public Property Title As String

    ''' <summary>
    ''' 单位是毫秒的UNIX时间
    ''' </summary>
    Public Property Time As Long

    <JsonIgnore>
    Public Property privateTime As Date

    Public Property Content As String

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
