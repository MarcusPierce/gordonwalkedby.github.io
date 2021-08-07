Set-Location $PSScriptRoot
dotnet "./generator/bin/Debug/netcoreapp3.1/generator.dll" g
Set-Location $PSScriptRoot
$xml = Get-Item -Path "./docs/atom.xml"
if ($xml.Exists -and $xml.Length -gt 2000 ) {
    git add -A 
    git commit -m "ByScript" -S
    Write-Host "starting push."
    git push origin master 
    Write-Host " push is over."
}
else {
    Write-Error "Cannot check atom.xml !!"
}
Set-Location $PSScriptRoot
