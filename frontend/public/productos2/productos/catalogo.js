// catalogo.js
// Conecta los botones de cada producto (cantidad, color, agregar al carrito)
// que en el HTML original no tenían ningún JavaScript asociado.

document.addEventListener('DOMContentLoaded', () => {
    const CART_KEY = 'telas_carrito';

    const leerCarrito = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            return [];
        }
    };

    const guardarCarrito = (carrito) => {
        localStorage.setItem(CART_KEY, JSON.stringify(carrito));
    };

    const productos = document.querySelectorAll('.container-principal');

    productos.forEach((producto) => {
        // El nombre del producto vive en el bloque ".type" justo anterior
        const bloqueType = producto.previousElementSibling;
        const nombre = bloqueType?.querySelector('.title-1')?.textContent.trim() || 'Producto';

        // El precio viene como texto libre: "selecciona el color... metro: $7000"
        const textoPrecio = producto.querySelector('.letter')?.textContent || '';
        const matchPrecio = textoPrecio.match(/\$ ?([\d.,]+)/);
        const precio = matchPrecio ? parseInt(matchPrecio[1].replace(/[.,]/g, ''), 10) : 0;

        // --- Selector de color ---
        // Nota: cada círculo tiene 2 clases ("color" + el nombre del color, ej "color rojo")
        const colores = producto.querySelectorAll('.color');
        let colorSeleccionado = null;

        colores.forEach((circulo) => {
            circulo.addEventListener('click', () => {
                colores.forEach((otro) => otro.classList.remove('selected'));
                circulo.classList.add('selected');
                colorSeleccionado = [...circulo.classList].find((c) => c !== 'color') || 'sin nombre';
            });
        });

        // --- Selector de cantidad ---
        // Se busca con querySelector dentro del producto (NO con getElementById,
        // porque el id="cantidad" se repite en cada producto, lo cual es inválido
        // en HTML y haría que getElementById siempre devolviera el primer input).
        const input = producto.querySelector('.cantidad-control input[type="number"]');
        const btnMenos = producto.querySelector('.btn-menos');
        const btnMas = producto.querySelector('.btn-mas');

        const ajustarCantidad = (delta) => {
            if (!input) return;
            const min = parseInt(input.min, 10) || 1;
            const max = parseInt(input.max, 10) || 100;
            let valor = parseInt(input.value, 10) || min;
            valor = Math.min(max, Math.max(min, valor + delta));
            input.value = valor;
        };

        btnMenos?.addEventListener('click', () => ajustarCantidad(-1));
        btnMas?.addEventListener('click', () => ajustarCantidad(1));
        input?.addEventListener('change', () => ajustarCantidad(0));
        input?.addEventListener('blur', () => ajustarCantidad(0));

        // --- Agregar al carrito ---
        const btnCarrito = producto.querySelector('.btn-carrito');
        const btnComprar = producto.querySelector('.btn-comprar');

        const agregarAlCarrito = () => {
            const cantidad = parseInt(input?.value, 10) || 1;
            const carrito = leerCarrito();

            const item = {
                id: `${nombre}-${colorSeleccionado || 'sin-color'}`,
                nombre,
                color: colorSeleccionado || 'No seleccionado',
                precio,
                cantidad
            };

            const existente = carrito.find((p) => p.id === item.id);
            if (existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push(item);
            }

            guardarCarrito(carrito);
        };

        btnCarrito?.addEventListener('click', () => {
            agregarAlCarrito();
            const textoOriginal = btnCarrito.textContent;
            btnCarrito.textContent = '✓ Agregado';
            btnCarrito.disabled = true;
            setTimeout(() => {
                btnCarrito.textContent = textoOriginal;
                btnCarrito.disabled = false;
            }, 1200);
        });

        btnComprar?.addEventListener('click', () => {
            agregarAlCarrito();
            window.location.href = '/carrito';
        });
    });
});
