$files = Get-ChildItem -Path .\views\*.ejs, .\public\*.html -Recurse -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Remove Sidebar "Asesor Técnico" link
    $content = $content -replace '(?s)<a[^>]*data-path="contacto"[^>]*href="/contacto"[^>]*>.*?<span[^>]*>support_agent</span>Asesor Técnico</a>', ''
    
    # Remove footer "Asesoría Textil" (if they meant that too, but I'll stick strictly to "Asesor Técnico")
    # Actually "Asesor Técnico" is what the user asked to remove.
    # Let's remove the link from the sidebar in all files.
    
    # Also fix "Colecciones" links which currently point to "/catalogo"
    $content = $content -replace 'data-path="colecciones"\s*href="/catalogo"', 'data-path="colecciones" href="/colecciones"'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
