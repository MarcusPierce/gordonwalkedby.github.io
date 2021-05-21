﻿Set-Location $PSScriptRoot
Remove-Item -Path "./docs/" -Recurse -Force
dotnet "./gen.vb/bin/Debug/netcoreapp3.1/gen.vb.dll" g
Set-Location $PSScriptRoot
$xml = Get-Item -Path "./docs/sitemaps.xml"
if ($xml.Exists -and $xml.Length -gt 2000 ) {
    git add -A 
    git commit -S -m "ByScript"
    Write-Host "开始 push 到 gitee"
    git push gitee master 
    Write-Host "开始 push 到 github"
    git push github master 
    Write-Host "开始 push 到 gitlab"
    git push gitlab master 
    Write-Host " push 完成"
}
else {
    Write-Error "生成信息很可能有误！请检查！！"
}
Set-Location $PSScriptRoot