$content = Get-Content 'd:\Tracker\state.json' -Raw
$obj = $content | ConvertFrom-Json
$compact = $obj | ConvertTo-Json -Compress -Depth 20
$compact | Out-File 'd:\Tracker\_compact_state.txt' -Encoding UTF8 -NoNewline
Write-Host "Done. Length: $($compact.Length)"
