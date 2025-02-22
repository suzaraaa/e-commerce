document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    updateCounts();
});

function renderWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistContainer = document.getElementById('wishlist-items');
    
    if (!wishlistContainer) return;
    
    wishlistContainer.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <p>Your wishlist is empty</p>
                <a href="ecommerce.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    wishlist.forEach(productId => {
        const product = window.asicsProducts[productId];
        if (!product) return;
        
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.dataset.productId = productId;
        wishlistItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <h3 class="wishlist-item-title">${product.name}</h3>
                <p class="wishlist-item-price">₱${product.price.toFixed(2)}</p>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary" onclick="moveToCart('${productId}')">Add to Cart</button>
                    <button class="btn btn-secondary" onclick="removeFromWishlist('${productId}')">Remove</button>
                </div>
            </div>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });
}

function moveToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        renderWishlist();
        updateCounts();
        alert('Product moved to cart!');
    } else {
        alert('Product is already in your cart!');
    }
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    renderWishlist();
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

