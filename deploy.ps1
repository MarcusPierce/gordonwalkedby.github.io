Set-Location $PSScriptRoot
Set-Location "./base_vb/"
dotnet run g
git add -A 
git commit -m "ByScript"
git push gitee master -f 
git push github master -f 
git push gitlab master -f 
Set-Location $PSScriptRoot
