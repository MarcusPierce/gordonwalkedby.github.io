Set-Location $PSScriptRoot
$docs = "./docs/"
if (Test-Path -Path $docs) {
    Remove-Item -Path $docs -Recurse -Force
}
dotnet "./generator/bin/Debug/net6.0/generator.dll" g
Set-Location $PSScriptRoot
$xml = Get-Item -Path ($docs + "atom.xml")
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
