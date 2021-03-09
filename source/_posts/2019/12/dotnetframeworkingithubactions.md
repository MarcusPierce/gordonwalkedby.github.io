---
title: 使用 GitHub Actions 编译 .NET Framework 程序
date: 2019-12-14 13:30:46
tags: [研究笔记,.NET,Git]
---
非常有意思，GitHub Actions 里自带有 Windows Server 的镜像，还预装了 Visual Studio ，可谓很爽了。  
新建一个下面这样的 workflow 到你的项目即可在push的时候让 github 给你编译 .net framework 程序。  
我用 <> 框起来的文字，记得把 <> 这两个符号本身给去了。路径尽量修成使用/符的，而不是\符的。    
如果你不使用任何 nuget 包，要把关于 nuget 的那两个步骤去掉。  
```yml
name: CI

on: [push]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - name: checkout
        uses: actions/checkout@v1
      - name: setup nuget 
        uses: warrenbuckley/Setup-Nuget@v1
      - name: nuget restore 
        working-directory: <pjPath>  #这里写 .sln 的路径或者 packages.config 文件的路径
        run: nuget.exe restore 
      - name: msbuild
        working-directory: <pjPath> #这里写 .sln 的路径或者 .vbproj .csproj 文件的路径
        run: "& 'C:/Program Files (x86)/Microsoft Visual Studio/2019/Enterprise/MSBuild/Current/Bin/MSBuild.exe' <options>"
        #<options>写编译参数
      - name: upload
        uses: actions/upload-artifact@v1
        with:
          name: compiled_files
          path: <outputPath>  #这里写编译出来的文件夹的路径，一般是  ./xx/bin/Debug 这种
```


在 Windows 上运行的 steps 都是用 PowerShell 6 来运行的。  
如果你想使用绝对路径，Github 都是把咱们的项目放在 ```d:\a\XXX\XXX``` 文件夹里，XXX是你的项目名字，是的，文件夹有两层，不是分支名。  
不要试着用命令切换工作文件夹，因为工作机制的关系，工作文件夹永远都在项目根目录，应该在 step 内使用 working-directory 参数。  
![](https://s2.ax1x.com/2019/12/14/QRuhSe.png)  

一个现成的示例 https://github.com/gordonwalkedby/OnsetPackageJsonCreater/blob/master/.github/workflows/main.yml