function debugEcommerce() {
    // Check localStorage data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    console.log('Cart Items:', cart);
    console.log('Wishlist Items:', wishlist);
    console.log('Available Products:', window.asicsProducts);
    
    // Check if DOM elements exist
    console.log('Cart Container:', document.getElementById('cart-items'));
    console.log('Wishlist Container:', document.getElementById('wishlist-items'));
}

// Add to window object
window.debugEcommerce = debugEcommerce;

