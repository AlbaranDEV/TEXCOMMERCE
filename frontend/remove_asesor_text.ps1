$files = Get-ChildItem -Path .\views\*.ejs, .\public\*.html -Recurse -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    $content = $content -replace 'asesor técnico', 'asesor'
    $content = $content -replace 'Asesor Técnico Asignado', 'Soporte'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
