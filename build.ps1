# data/*.json fayllarini data/bundle.js ga yig'adi (sayt shuni o'qiydi, serversiz ham ishlaydi)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
function J($p){ (Get-ChildItem $p | ForEach-Object { Get-Content -Raw -Encoding utf8 $_.FullName }) -join ",`n" }
# modda havolalarini yangilash (node kerak; data/anchors.json tayyor)
if (Get-Command node -ErrorAction SilentlyContinue) { node "$root\tools\links.js" }
$c = J "$root\data\countries\*.json"
$p = J "$root\data\procedure\*.json"
$s = Get-Content -Raw -Encoding utf8 "$root\data\scholarship.json"
$g = Get-Content -Raw -Encoding utf8 "$root\data\glossary.json"
$n = Get-Content -Raw -Encoding utf8 "$root\data\snapshot.json"
$js = "window.COUNTRIES = [`n$c`n];`nwindow.PROCEDURE = [`n$p`n];`nwindow.SCHOLARSHIP = $s;`nwindow.GLOSSARY = $g;`nwindow.SNAPSHOT = $n;"
[System.IO.File]::WriteAllText("$root\data\bundle.js", $js, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "bundle.js tayyor: $((Get-ChildItem "$root\data\countries\*.json").Count) davlat, $((Get-ChildItem "$root\data\procedure\*.json").Count) protsessual fayl"
