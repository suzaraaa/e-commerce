document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCounts();
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="index.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }
    
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }
    
    cart.forEach(productId => {
        const product = window.asicsProducts[productId];
        if (!product) return;
        
        subtotal += product.price;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.productId = productId;
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${product.name}</h3>
                <p class="cart-item-price">₱${product.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity('${productId}', -1)">-</button>
                    <input type="number" value="1" min="1" class="quantity-input" 
                           onchange="updateQuantity('${productId}', this.value)">
                    <button class="quantity-btn plus" onclick="updateQuantity('${productId}', 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${productId}')">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    updateCartTotals(subtotal);
}

function updateCartTotals(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
    }
    if (totalElement) {
        totalElement.textContent = `₱${subtotal.toFixed(2)}`;
    }
}

function updateQuantity(productId, change) {
    const item = document.querySelector(`[data-product-id="${productId}"]`);
    if (!item) return;
    
    const input = item.querySelector('.quantity-input');
    let newQuantity = parseInt(input.value);
    
    if (typeof change === 'string') {
        newQuantity = parseInt(change);
    } else {
        newQuantity += change;
    }
    
    if (newQuantity < 1) newQuantity = 1;
    input.value = newQuantity;
    
    updateCartTotals(calculateSubtotal());
}

function calculateSubtotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, productId) => {
        const product = window.asicsProducts[productId];
        if (!product) return total;
        
        const quantityInput = document.querySelector(`[data-product-id="${productId}"] .quantity-input`);
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        return total + (product.price * quantity);
    }, 0);
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart();
    updateCounts();
}

// Make sure updateCounts is available
if (typeof updateCounts !== 'function') {
    function updateCounts() {
        // Implementation from ecommerce.js
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        
        cartCountElements.forEach(element => {
            element.textContent = cart.length;
        });
        
        wishlistCountElements.forEach(element => {
            element.textContent = wishlist.length;
        });
    }
}

