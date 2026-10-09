// carrito.js
// La página carrito.html era 100% estática (siempre mostraba "carrito vacío").
// Este script lee lo que se guardó desde la página de productos y lo renderiza.

document.addEventListener('DOMContentLoaded', () => {
    const CART_KEY = 'telas_carrito';

    const formatoPrecio = (valor) => '$' + valor.toLocaleString('es-CO');

    const leerCarrito = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            return [];
        }
    };

    const guardarCarrito = (carrito) => localStorage.setItem(CART_KEY, JSON.stringify(carrito));

    const seccionIzquierda = document.querySelector('.seccionizquierda');
    const carritoVacioEl = document.querySelector('.carritovacio');
    const subtotalValorEl = document.querySelector('.filaresumen span:last-child');
    const totalValorEl = document.querySelector('.filaresumentotal span:last-child');
    const btnPagar = document.querySelector('.botonpagar');

    const renderizar = () => {
        const carrito = leerCarrito();

        // Quita las filas de productos pintadas en el render anterior
        seccionIzquierda.querySelectorAll('.filaproducto').forEach((fila) => fila.remove());

        if (carrito.length === 0) {
            if (carritoVacioEl) carritoVacioEl.style.display = '';
        } else {
            if (carritoVacioEl) carritoVacioEl.style.display = 'none';

            carrito.forEach((item, index) => {
                const totalItem = item.precio * item.cantidad;
                const fila = document.createElement('div');
                fila.className = 'filaproducto';
                fila.style.display = 'grid';
                fila.style.gridTemplateColumns = '2fr 1fr 1fr';
                fila.style.alignItems = 'center';
                fila.style.padding = '0.8em 0';
                fila.style.borderBottom = '1px solid #C5D1D4';
                fila.innerHTML = `
                    <span>${item.nombre} <small>(${item.color})</small>
                        <button class="quitar-item" data-index="${index}" title="Quitar" style="margin-left:10px;border:none;background:none;color:#b91c1c;cursor:pointer;font-size:1em;">✕</button>
                    </span>
                    <span style="text-align:center;">${item.cantidad} m</span>
                    <span style="text-align:center;">${formatoPrecio(totalItem)}</span>
                `;
                seccionIzquierda.appendChild(fila);
            });
        }

        const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        if (subtotalValorEl) subtotalValorEl.textContent = formatoPrecio(subtotal);
        if (totalValorEl) totalValorEl.textContent = formatoPrecio(subtotal);

        seccionIzquierda.querySelectorAll('.quitar-item').forEach((btn) => {
            btn.addEventListener('click', () => {
                const carritoActual = leerCarrito();
                carritoActual.splice(parseInt(btn.dataset.index, 10), 1);
                guardarCarrito(carritoActual);
                renderizar();
            });
        });
    };

    btnPagar?.addEventListener('click', () => {
        const carrito = leerCarrito();
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }
        alert('¡Gracias por tu compra! (demo: no hay pasarela de pago conectada todavía)');
        guardarCarrito([]);
        renderizar();
    });

    renderizar();
});
