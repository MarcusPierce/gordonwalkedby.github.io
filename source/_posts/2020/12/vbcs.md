---
title: VB.NET与C#的语法比较
date: 2020-12-09 20:19:25
tags: [.NET]
---

这是我自己整理的，环境是 .NET Framework 4.8+VS2019。  

[VB的关键词列表](https://docs.microsoft.com/zh-cn/dotnet/visual-basic/language-reference/keywords/)  
[C#的关键词列表](https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/)  
<table>
    <tbody>
        <tr>
            <td>
                VB.NET
            </td>
            <td>
                C#
            </td>
            <tr>
                <td>
                    Private Module Module1
                </td>
                <td>
                    internal sealed class Module1 （sealed就是不可继承）
                </td>
            </tr>
            <tr>
                <td>
                    Error 5
                </td>
                <td>
                    throw ProjectData.CreateProjectError(5);
                </td>
            </tr>
            <tr>
                <td>
                    Public Delegate Sub adelegate(ByRef m As Single)
                </td>
                <td>
                    public delegate void adelegate(ref float m);
                </td>
            </tr>
            <tr>
                <td>
                    <img src="https://s3.ax1x.com/2020/12/09/rPZPXQ.png">
                </td>
                <td>
                    <img src="https://s3.ax1x.com/2020/12/09/rPVvkt.png">
                </td>
            </tr>
            <tr>
                <td>
                    Public MustInherit Class MustInheritname
                </td>
                <td>
                    public abstract class MustInheritname
                </td>
            </tr>
            <tr>
                <td>
                    Public Event goevent(a As Integer, b As Integer)
                </td>
                <td>
                    private goeventEventHandler goeventEvent;<br> public delegate void goeventEventHandler(int a, int b);
                </td>
            </tr>
            <tr>
                <td>
                    RaiseEvent goevent(15, 35)
                </td>
                <td>
                    goeventEvent?.Invoke(15, 35);
                </td>
            </tr>
            <tr>
                <td>
                    Public Overridable Sub dsadsa(ParamArray objs() As Object)
                </td>
                <td>
                    public virtual void dsadsa(params object[] objs)
                </td>
            </tr>
            <tr>
                <td>
                    Public WriteOnly Property writeonlyone As Integer <br> Set(value As Integer)<br> End Set<br> End Property<br>
                </td>
                <td>
                    public int writeonlyone<br>{<br>set{}<br>}
                </td>
            </tr>
            <tr>
                <td>
                    Friend Const this As String
                </td>
                <td>
                    internal const string @this
                </td>
            </tr>
            <tr>
                <td>
                    Public NotInheritable Class publicname<br> Inherits MustInheritname<br> Implements IComparable<br> Public Sub New()
                </td>
                <td>
                    public sealed class publicname : MustInheritname, IComparable<br> public publicname()
                </td>
            </tr>
            <tr>
                <td>
                    Public MustOverride Property youmustoverridethis As Integer
                </td>
                <td>
                    public abstract int youmustoverridethis
                </td>
            </tr>
            <tr>
                <td>
                    <img src="https://s3.ax1x.com/2020/12/09/rPmQoR.png">
                </td>
                <td>
                    <img src="https://s3.ax1x.com/2020/12/09/rPmVzT.png">
                </td>
            </tr>
            <tr>
                <td>
                    <img src="https://s3.ax1x.com/2020/12/09/rPm6l8.png">
                </td>
                <td>
                    <img src="https://s3.ax1x.com/2020/12/09/rPmrfP.png">
                </td>
            </tr>
            <tr>
                <td>
                    ReDim Preserve m(16)
                </td>
                <td>
                    i = (int[])Utils.CopyArray(i, new int[17]);
                </td>
            </tr>
        </tr>
    </tbody>
</table>