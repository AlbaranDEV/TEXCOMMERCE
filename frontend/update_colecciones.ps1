$newMain = @"
<main class="w-full pt-28 bg-background">
  <div class="max-w-[1440px] mx-auto px-margin md:px-margin-desktop py-12">
    <div class="text-center mb-16">
      <h1 class="font-headline-lg text-headline-lg text-primary tracking-tight">Colecciones de Autor</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl mx-auto">Explora nuestras curadurías textiles exclusivas. Fibras nobles y procesos artesanales pensados para los espacios más exigentes.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
      <div class="order-2 md:order-1">
        <h2 class="font-headline-md text-headline-md text-primary mb-4">Linos Europeos</h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">Cultivados en las regiones costeras de Europa y tejidos con técnicas milenarias. Nuestros linos ofrecen una caída excepcional y una textura que envejece con gracia, aportando una sofisticación natural a cualquier ambiente.</p>
        <a href="/catalogo" class="font-label-caps text-label-caps uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors">Ver Catálogo de Linos</a>
      </div>
      <div class="order-1 md:order-2 h-[400px] overflow-hidden bg-surface-container">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr5ban2I2BowVaXrzkeNss2j7awyTY8Jb58hqpxoBTpmxCjRSeKKakum5xUg0M07-jXcv0kev8_N9cbnAYNQafLD6Ym2KDdOqKTG4lbTb9Y7GDgem7_fHtYS2-R0_Bry6OnPPE8jsWO8w2SpGwdX4DgGeW6LsNJzmNMZ9POXtZ9GgQyAQ3zNxEJIBdTJcNcMqOXSldiK9p2y1600_RsA4_E5Hu9q2bUn2Y_g-Vp6vIbMyoWiTSzFQQag" alt="Linos Europeos" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
      <div class="h-[400px] overflow-hidden bg-surface-container">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYl67oaN927zQQ9gKEvj_EryEBrX-CiFP-ypUBBNKPz3xAH51dPeJDOD0k1w5Lzoowr8KdlTWCQr7MGDrORbOUrcUrYeHtR6pAxsNLf3r7wSuYeG-AHDr7lxqelcKpUMDaQbcHpEYOLGLLvAFYZLRKnhskcCMAXoalwsqLui64Y8WTc6q0SUEiF1InIPSwgnnOKpiXB0g216kRfhxsNnBVQF3nVyYREbJWmpVRorIOF98tNVTeMm7Yaw" alt="Sedas Salvajes" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
      </div>
      <div>
        <h2 class="font-headline-md text-headline-md text-primary mb-4">Sedas Salvajes</h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">Un reflejo del lujo indómito. La seda salvaje, con sus sutiles irregularidades y brillo orgánico, es perfecta para tapicerías decorativas y caídas monumentales en proyectos residenciales de alta gama.</p>
        <a href="/catalogo" class="font-label-caps text-label-caps uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors">Ver Catálogo de Sedas</a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
      <div class="order-2 md:order-1">
        <h2 class="font-headline-md text-headline-md text-primary mb-4">Lana Merino</h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">Proveniente de las hilaturas más nobles, la lana merino de nuestra colección garantiza un aislamiento acústico y térmico superior, con una mano increíblemente suave. Ideal para espacios de descanso y contract.</p>
        <a href="/catalogo" class="font-label-caps text-label-caps uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors">Ver Catálogo de Lanas</a>
      </div>
      <div class="order-1 md:order-2 h-[400px] overflow-hidden bg-surface-container">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr5ban2I2BowVaXrzkeNss2j7awyTY8Jb58hqpxoBTpmxCjRSeKKakum5xUg0M07-jXcv0kev8_N9cbnAYNQafLD6Ym2KDdOqKTG4lbTb9Y7GDgem7_fHtYS2-R0_Bry6OnPPE8jsWO8w2SpGwdX4DgGeW6LsNJzmNMZ9POXtZ9GgQyAQ3zNxEJIBdTJcNcMqOXSldiK9p2y1600_RsA4_E5Hu9q2bUn2Y_g-Vp6vIbMyoWiTSzFQQag" alt="Lana Merino" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale" />
      </div>
    </div>
  </div>
</main>
"@

$content = Get-Content .\views\colecciones.ejs -Raw
$content = $content -replace '(?s)<main class="w-full pt-28 bg-background">.*?</main>', $newMain
Set-Content .\views\colecciones.ejs -Value $content -Encoding UTF8
