---
title: 我的 VB 函数备份
date: 2021-11-09
tags: [.net]
---
# 把数据进行二维表分割
以tab为分隔符，以CR或者LF为换行符，第一行为表头，通常是处理excel复制出来的文本用的    
此处不支持单元格内的回车或tab符    
```vb
Public Function ParseDataAsLines(txt As String) As String()
    If String.IsNullOrWhiteSpace(txt) Then Return Nothing
    Dim lines = txt.Replace(vbCrLf, vbLf).Split({vbLf, vbCr}, StringSplitOptions.RemoveEmptyEntries)
    If lines.Length > 0 Then Return lines
    Return Nothing
End Function
Public Function ParseDataAsTable(txt As String) As List(Of Dictionary(Of String, String))
    Dim lines = ParseDataAsLines(txt)
    If lines Is Nothing Then Return Nothing
    Dim firstLine As Boolean = True
    Dim headers As New List(Of String)
    Dim out As New List(Of Dictionary(Of String, String))
    For Each i In lines
        If String.IsNullOrWhiteSpace(i) Then
            Continue For
        End If
        Dim values = i.Split({vbTab}, StringSplitOptions.None)
        Dim repeatId As Integer = 1
        Dim dc As New Dictionary(Of String, String)
        For index = 0 To values.Length - 1
            Dim v = values(index)
            If firstLine Then
                v = v.Trim
                If String.IsNullOrWhiteSpace(v) Then
                    v = "_"
                End If
                If headers.Contains(v) Then
                    v &= repeatId
                    repeatId += 1
                End If
                headers.Add(v)
            Else
                If index >= headers.Count Then
                    Exit For
                End If
                dc.Add(headers.Item(index), v)
            End If
        Next
        If dc.Count > 0 Then
            out.Add(dc)
        End If
        firstLine = False
    Next
    If out.Count > 0 Then
        Return out
    End If
    Return Nothing
End Function
```

# 一些常用的 Windows Forms native 操作
```vb
<DllImport("user32", EntryPoint:="FindWindowEx")>
Private Function WIN32FindWindow(parentWindow As IntPtr, searchAfter As IntPtr, lpClassName As String, lpWindowName As String) As IntPtr
End Function

<DllImport("user32", EntryPoint:="FindWindowEx")>
Private Function WIN32FindWindowByClass(parentWindow As IntPtr, searchAfter As IntPtr, lpClassName As String, zero As IntPtr) As IntPtr
End Function

<DllImport("user32", EntryPoint:="FindWindowEx")>
Private Function WIN32FindWindowByCaption(parentWindow As IntPtr, searchAfter As IntPtr, zero As IntPtr, lpWindowName As String) As IntPtr
End Function

Public Function FindWindowHwnd(ClassName As String, WindowTitle As String, Optional parentWindow As IntPtr = Nothing, Optional searchAfter As IntPtr = Nothing) As IntPtr
    Dim zero = IntPtr.Zero
    If ClassName Is Nothing Then
        If WindowTitle Is Nothing Then
            Return zero
        Else
            Return WIN32FindWindowByCaption(parentWindow, searchAfter, zero, WindowTitle)
        End If
    End If
    If WindowTitle Is Nothing Then
        If ClassName Is Nothing Then
            Return zero
        Else
            Return WIN32FindWindowByClass(parentWindow, searchAfter, ClassName, zero)
        End If
    End If
    Return WIN32FindWindow(parentWindow, searchAfter, ClassName, WindowTitle)
End Function

Public Delegate Sub EnumWindowsProc(targetHandle As IntPtr, ByRef lParam As Integer)
<DllImport("user32", EntryPoint:="EnumChildWindows", CharSet:=CharSet.Auto)>
Public Function WIN32EnumChildWindows(parentHandle As IntPtr, lpEnumFunc As EnumWindowsProc, ByRef lParam As Integer) As Boolean
End Function

Public Function GetAllChildWindowsHwnd(parentHandle As IntPtr) As List(Of IntPtr)
    Dim out As New List(Of IntPtr)
    Dim proc As New EnumWindowsProc(Sub(targetHandle As IntPtr, ByRef lParam As Integer)
                                        out.Add(targetHandle)
                                    End Sub)
    WIN32EnumChildWindows(parentHandle, proc, 0)
    If out.Count > 0 Then
        Return out
    End If
    Return Nothing
End Function

<DllImport("user32", EntryPoint:="GetClassName", CharSet:=CharSet.Auto)>
Private Function WIN32GetClassName(hWnd As IntPtr, lpClassName As StringBuilder, nMaxCount As Integer) As Integer
End Function

Public Function GetWindowClassName(targetHandle As IntPtr, Optional buffer As Integer = 256) As String
    Dim sb As New StringBuilder(String.Empty, buffer)
    WIN32GetClassName(targetHandle, sb, buffer)
    Dim a = sb.ToString.Trim
    Return a
End Function

<DllImport("user32", EntryPoint:="SendMessage")>
Private Function WIN32SendMessage(targetHandle As IntPtr, MsgID As Integer, wParam As Integer, lParam As Integer) As Integer
End Function

<DllImport("user32", EntryPoint:="SendMessage", CharSet:=CharSet.Unicode)>
Private Function WIN32SendMessage(targetHandle As IntPtr, MsgID As Integer, wParam As Integer, <MarshalAs(UnmanagedType.LPWStr)> lParam As String) As Integer
End Function

<DllImport("user32", EntryPoint:="SetWindowText")>
Public Function SetWindowTitle(targetHandle As IntPtr, lpString As String) As Boolean
End Function

Public Sub SetWindowText(targetHandle As IntPtr, text As String)
    Const WM_SETTEXT = &HC
    WIN32SendMessage(targetHandle, WM_SETTEXT, 0, text)
    SetWindowTitle(targetHandle, text)
End Sub

<DllImport("user32", EntryPoint:="GetWindowText")>
Private Function WIN32GetWindowText(targetHandle As IntPtr, lpString As StringBuilder, nMaxCount As Integer) As Integer
End Function

<DllImport("user32", EntryPoint:="GetWindowTextLength")>
Private Function WIN32GetWindowTextLength(targetHandle As IntPtr) As Integer
End Function

Public Function GetWindowTitle(targetHandle As IntPtr) As String
    Dim len = WIN32GetWindowTextLength(targetHandle)
    If len > 0 Then
        Dim sb As New StringBuilder(String.Empty, len)
        WIN32GetWindowText(targetHandle, sb, len + 1)
        Return sb.ToString.Trim
    End If
    Return String.Empty
End Function

<DllImport("user32", EntryPoint:="SendMessage")>
Private Function WIN32SendMessage(targetHandle As IntPtr, MsgID As Integer, wParam As Integer, lParam As StringBuilder) As Integer
End Function

Public Function GetControlText(targetHandle As IntPtr) As String
    Const WM_GETTEXTLENGTH = &HE
    Dim len = WIN32SendMessage(targetHandle, WM_GETTEXTLENGTH， 0， 0)
    If len < 1 Then Return String.Empty
    Const WM_GETTEXT = &HD
    Dim sb As New StringBuilder(String.Empty, len)
    WIN32SendMessage(targetHandle, WM_GETTEXT, len + 1, sb)
    Return sb.ToString.Trim
End Function

<DllImport("user32", EntryPoint:="GetWindowRect")>
Private Function WIN32GetWindowRect(targetHandle As IntPtr, ByRef lpRect As WIN32RECT) As Integer
End Function

<StructLayout(LayoutKind.Sequential)>
Public Structure WIN32RECT
    Public Left As Integer
    Public Top As Integer
    Public Right As Integer
    Public Bottom As Integer
End Structure

Public Function GetWindowRect(targetHandle As IntPtr) As System.Drawing.Rectangle
    Dim r As New WIN32RECT
    Dim v = WIN32GetWindowRect(targetHandle, r)
    If v = 0 Then
        Return Rectangle.Empty
    End If
    Dim w = r.Right - r.Left
    Dim h = r.Bottom - r.Top
    Return New Rectangle(r.Left, r.Top, w, h)
End Function

<DllImport("user32", EntryPoint:="SetWindowPos")>
Private Function WIN32SetWindowPos(targetHandle As IntPtr, hWndlnsertAfter As Integer, X As Integer, Y As Integer, width As Integer, height As Integer, uflags As Integer) As Integer
End Function

Public Function MakeWindowTopMost(targetHandle As IntPtr, X As Integer, Y As Integer, width As Integer, height As Integer) As Boolean
    Return WIN32SetWindowPos(targetHandle, -1, X, Y, width, height, &H40) <> 0
End Function
```

# 模拟鼠标点击
```vb
<DllImport("user32", EntryPoint:="mouse_event")>
Private Sub WIN32mouse_event(flag As Integer, x As Integer, y As Integer, data As Integer, info As Integer)
End Sub

Public Sub PerformMouseClick(x As Integer, y As Integer, Optional rightClick As Boolean = False, Optional holdTime As Integer = 100)
    Static w As Integer = 0, h As Integer = 0
    If w < 1 Then
        Dim pc As New Microsoft.VisualBasic.Devices.Computer
        Dim screenSize = pc.Screen.Bounds
        w = screenSize.Width
        h = screenSize.Height
    End If
    Const MOUSEEVENTF_MOVE = &H1
    Const MOUSEEVENTF_LEFTDOWN = &H2
    Const MOUSEEVENTF_LEFTUP = &H4
    Const MOUSEEVENTF_RIGHTDOWN = &H8
    Const MOUSEEVENTF_RIGHTUP = &H10
    Const MOUSEEVENTF_ABSOLUTE = &H8000
    Dim f1 = MOUSEEVENTF_LEFTDOWN
    Dim f2 = MOUSEEVENTF_LEFTUP
    If rightClick Then
        f1 = MOUSEEVENTF_RIGHTDOWN
        f2 = MOUSEEVENTF_RIGHTUP
    End If
    f1 = MOUSEEVENTF_MOVE Or MOUSEEVENTF_ABSOLUTE Or f1
    f2 = MOUSEEVENTF_MOVE Or MOUSEEVENTF_ABSOLUTE Or f2
    x = CInt(65535 * x / w)
    y = CInt(65535 * y / h)
    WIN32mouse_event(f1, x, y, 0, 0)
    Thread.Sleep(holdTime)
    WIN32mouse_event(f2, x, y, 0, 0)
End Sub
```
