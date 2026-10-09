/**
 * TEXCOMERCE - Gestor de Carrito de Compras en LocalStorage
 */
(function() {
  const CART_KEY = 'texcomerce_cart';

  const TexcommerceCart = {
    // Obtener lista de items
    getCart() {
      try {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Error al leer el carrito de localStorage:', e);
        return [];
      }
    },

    // Guardar lista de items
    saveCart(cart) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.updateBadges();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
      } catch (e) {
        console.error('Error al guardar el carrito en localStorage:', e);
      }
    },

    // Añadir producto al carrito
    addToCart(item) {
      const cart = this.getCart();
      // Identificador único compuesto por código y color
      const itemKey = `${item.codigo || item.nombre}_${item.color || 'def'}`;
      const existingIndex = cart.findIndex(i => i.key === itemKey);

      const metersToAdd = Math.max(0.5, parseFloat(item.metros) || 1.0);
      const unitPrice = parseFloat(item.precio_metro) || 0;

      if (existingIndex > -1) {
        cart[existingIndex].metros = parseFloat((cart[existingIndex].metros + metersToAdd).toFixed(1));
        cart[existingIndex].subtotal = Math.round(cart[existingIndex].metros * unitPrice);
      } else {
        cart.push({
          key: itemKey,
          id_tela: item.id_tela || null,
          codigo: item.codigo || '#GEN-00',
          nombre: item.nombre || 'Tela de Alta Calidad',
          color: item.color || 'Crudo',
          colorHex: item.colorHex || '#EAE4D9',
          precio_metro: unitPrice,
          metros: metersToAdd,
          subtotal: Math.round(metersToAdd * unitPrice),
          imagen: item.imagen || '/telas/seda_natural.jpg',
          fibra: item.fibra || 'Fibra Natural',
          ancho_cm: item.ancho_cm || 150
        });
      }

      this.saveCart(cart);
      return cart;
    },

    // Actualizar metraje de una partida
    updateMeters(itemKey, meters) {
      let cart = this.getCart();
      const itemIndex = cart.findIndex(i => i.key === itemKey);
      if (itemIndex > -1) {
        const newMeters = parseFloat(meters);
        if (newMeters <= 0) {
          cart.splice(itemIndex, 1);
        } else {
          cart[itemIndex].metros = parseFloat(newMeters.toFixed(1));
          cart[itemIndex].subtotal = Math.round(cart[itemIndex].metros * cart[itemIndex].precio_metro);
        }
        this.saveCart(cart);
      }
      return cart;
    },

    // Incrementar o decrementar metraje
    adjustMeters(itemKey, delta) {
      const cart = this.getCart();
      const item = cart.find(i => i.key === itemKey);
      if (item) {
        const nextMeters = Math.max(0.5, parseFloat((item.metros + delta).toFixed(1)));
        return this.updateMeters(itemKey, nextMeters);
      }
      return cart;
    },

    // Eliminar una partida del carrito
    removeItem(itemKey) {
      let cart = this.getCart();
      cart = cart.filter(i => i.key !== itemKey);
      this.saveCart(cart);
      return cart;
    },

    // Vaciar todo el carrito
    clearCart() {
      localStorage.removeItem(CART_KEY);
      this.updateBadges();
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
      return [];
    },

    // Calcular subtotales, IVA y total general
    getTotals() {
      const cart = this.getCart();
      const totalMetros = cart.reduce((acc, item) => acc + (parseFloat(item.metros) || 0), 0);
      const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
      const iva = Math.round(subtotal * 0.19); // IVA 19% Colombia
      const total = subtotal + iva;

      return {
        itemCount: cart.length,
        totalMetros: parseFloat(totalMetros.toFixed(1)),
        subtotal,
        iva,
        total
      };
    },

    // Formatear precio a moneda colombiana (COP)
    formatCOP(amount) {
      return '$' + Math.round(amount || 0).toLocaleString('es-CO');
    },

    // Actualizar contadores y badges visuales en la página
    updateBadges() {
      const totals = this.getTotals();
      const count = totals.itemCount;
      const badges = document.querySelectorAll('.cart-badge-count');
      badges.forEach(b => {
        if (b.dataset.format === 'raw') {
          b.innerText = count;
          if (count > 0) {
            b.classList.remove('hidden');
          } else {
            b.classList.add('hidden');
          }
        } else {
          // Formato estándar con paréntesis para el botón del header: (0), (1), (2)...
          b.innerText = `(${count})`;
          b.classList.remove('hidden');
        }
      });
    }
  };

  // Exponer globalmente
  window.TexcommerceCart = TexcommerceCart;

  // Actualizar badges al cargar el documento
  document.addEventListener('DOMContentLoaded', () => {
    TexcommerceCart.updateBadges();
  });

  // Sincronizar en tiempo real entre ventanas/pestañas
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) {
      TexcommerceCart.updateBadges();
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: TexcommerceCart.getCart() } }));
    }
  });
})();
