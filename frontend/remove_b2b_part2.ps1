$files = Get-ChildItem -Path .\views\*.ejs, .\public\*.html -Recurse -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Strip B2B wording from elements
    $content = $content -replace 'B2B', ''
    $content = $content -replace 'Muestras físicas', 'Servicios'
    $content = $content -replace 'muestras físicas', 'servicios'
    $content = $content -replace 'Muestrario Físico', 'Servicios'
    $content = $content -replace 'muestrario físico', 'servicios'
    $content = $content -replace 'Muestrario de Archivo', 'Archivo'

    # Remove the whole B2B accreditation tab button in login
    $content = $content -replace '(?s)<button[^>]*>.*?02 / Acreditar Nuevo Despacho \(B2B\).*?</button>', ''
    
    # Let's just blindly remove the word B2B everywhere as a start.
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
