// Initialize localStorage if empty
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}
if (!localStorage.getItem('wishlist')) {
    localStorage.setItem('wishlist', JSON.stringify([]));
}

// Product data - MUST match the IDs used in your HTML
const products = {
    'gt-2000-13': {
        id: 'gt-2000-13',
        name: 'GT-2000 13',
        price: 9490,
        image: 'GT-2000 13.png'
    },
    'gt-2000-13-tr': {
        id: 'gt-2000-13-tr',
        name: 'GT-2000 13 TR',
        price: 9490,
        image: 'GT-2000 13 TR.png'
    },
    'gel-cumulus-26': {
        id: 'gel-cumulus-26',
        name: 'GEL-CUMULUS 26 LITE-SHOW',
        price: 9490,
        image: 'GEL-CUMULUS 26 LITE-SHOW.png'
    },
    'gel-kayano-31': {
        id: 'gel-kayano-31',
        name: 'GEL-KAYANO 31 LITE-SHOW',
        price: 11490,
        image: 'GEL-KAYANO 31 LITE-SHOW.png'
    }
};

// Make products globally available
window.asicsProducts = products;

document.addEventListener('DOMContentLoaded', () => {
    // Clear potentially corrupted data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Filter out any invalid product IDs
    const validCart = cart.filter(id => products[id]);
    const validWishlist = wishlist.filter(id => products[id]);
    
    // Save back valid data
    localStorage.setItem('cart', JSON.stringify(validCart));
    localStorage.setItem('wishlist', JSON.stringify(validWishlist));
    
    updateCounts();
    setupEventListeners();
    
    // Run debug function
    debugEcommerce();
});

function updateCounts() {
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

function handleWishlistClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const productCard = event.target.closest('.product-card');
    if (!productCard) {
        console.error('Product card not found');
        return;
    }
    
    const productId = productCard.dataset.productId;
    if (!products[productId]) {
        console.error('Invalid product ID:', productId);
        return;
    }
    
    addToWishlist(productId);
}

function handleCartClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const productCard = event.target.closest('.product-card');
    if (!productCard) {
        console.error('Product card not found');
        return;
    }
    
    const productId = productCard.dataset.productId;
    if (!products[productId]) {
        console.error('Invalid product ID:', productId);
        return;
    }
    
    addToCart(productId);
}

function setupEventListeners() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', handleWishlistClick);
    });
    
    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', handleCartClick);
    });
}

function addToWishlist(productId) {
    if (!products[productId]) {
        console.error('Invalid product ID:', productId);
        return;
    }
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateCounts();
        alert('Product added to wishlist!');
    } else {
        alert('Product is already in your wishlist!');
    }
}

function addToCart(productId) {
    if (!products[productId]) {
        console.error('Invalid product ID:', productId);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCounts();
        alert('Product added to cart!');
    } else {
        alert('Product is already in your cart!');
    }
}

// Export functions
window.updateCounts = updateCounts;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;

