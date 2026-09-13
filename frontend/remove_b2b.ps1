$files = Get-ChildItem -Path .\views\*.ejs, .\public\*.html -Recurse -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Remove Sidebar "Muestrario Físico" link
    $content = $content -replace '(?s)<a[^>]*href="/contacto"[^>]*>.*?<span[^>]*>style</span>Muestrario Físico</a>', ''
    
    # Remove Header "Muestras Físicas" link
    $content = $content -replace '(?s)<a[^>]*data-path="muestras-fisicas"[^>]*href="/contacto"[^>]*>Muestras Físicas</a>', ''
    
    # Remove Footer "Muestrario Físico B2B"
    $content = $content -replace '(?s)<li[^>]*>\s*<a[^>]*data-path="muestras-fisicas"[^>]*>Muestrario Físico B2B</a>\s*</li>', ''
    
    # Remove Footer "Acceso Profesionales B2B"
    $content = $content -replace '(?s)<li[^>]*>\s*<a[^>]*data-path="dashboard"[^>]*>Acceso Profesionales B2B</a>\s*</li>', ''
    
    # Remove "Cuenta Contract B2B" from sidebar
    $content = $content -replace '<span[^>]*>Cuenta Contract B2B</span>', ''
    
    # Remove B2B text in sidebar profile (Estudio Sordo Madaleno / Usuario)
    # The user might just want the B2B mentions gone, but let's keep the profile clean if possible.
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
