---
title: VB.NET实现的Steam各类用户ID转换
date: 2021-05-29 15:20:06
tags: [Steam]
---
以前傻乎乎地用 BitArray 来实现，今天终于学会玩位移了。   
这个戈登就是逊啦！   

V社官方开发者维基的关于 steamid 的解释： [点我](https://developer.valvesoftware.com/wiki/SteamID:zh-cn)  

GMod lua api 里面的 [Player:SteamID()](https://wiki.facepunch.com/gmod/Player:SteamID) 返回的id32的 universe 一律为0，可是按照理论应该是1才对。所以下面的代码里主要体现的是玩家id的转换，不包括其他id（比如群组）的转换。    

```vb
''' <summary>
''' 把 steamid32 转换为 id64，会忽视 id32 里的 universe，一律视为1
''' </summary>
Function GetSteamID64FromID32(id As String) As Long
    Dim m As Match = Regex.Match(id, "STEAM_([0-9]):([0-9]):([0-9]+)")
    If m.Success Then
        Dim lastBit As Byte = If(m.Result("$2").Equals("1"), 1, 0)
        Dim num As Integer = CInt(m.Result("$3"))
        num <<= 1
        Dim out As Long = 1
        out <<= 4
        out += 1
        out <<= 20
        out += 1
        out <<= 32
        out += num + lastBit
        Return out
    End If
    Throw New ArgumentException("This is not a steamid32.")
End Function

''' <summary>
''' 把 steamid3 转换为 id64，一律转换为 U:1
''' </summary>
Function GetSteamID64FromID3(id As String) As Long
    Dim m As Match = Regex.Match(id, "U:1:([0-9]+)")
    If m.Success Then
        Dim num = CLng(m.Result("$1"))
        Dim out As Long = 1
        out <<= 4
        out += 1
        out <<= 20
        out += 1
        out <<= 32
        out += num
        Return out
    End If
    Throw New ArgumentException("This is not a steamid3.")
End Function

''' <summary>
''' 把 steamid64 转换为 steamid32
''' </summary>
Function GetSteamID32FromID64(id As Long) As String
    Dim universe = id >> 56
    Dim uid As ULong = CULng(id)
    Dim lastBit = uid << 63 >> 63
    Dim num = id << 32 >> 33
    Dim str = $"STEAM_{universe}:{lastBit}:{num}"
    Return str
End Function

''' <summary>
''' 把 steamid64 转换为 steamid3，一律转换为 U:1
''' </summary>
Function GetSteamID3FromID64(id As Long) As String
    Dim num = id << 32 >> 32
    Dim str = $"[U:1:{num}]"
    Return str
End Function

```
