document.addEventListener("DOMContentLoaded", function () {
    // 1. Toggle Favorite Hearts
    const hearts = document.querySelectorAll(".heart");
    hearts.forEach(function (heart) {
        heart.addEventListener("click", function () {
            heart.classList.toggle("like");
        });
    });

    // 2. Search Autocomplete
    const input = document.getElementById("search");
    const suggestions = document.getElementById("suggestions");

    if (input && suggestions) {
        input.addEventListener("input", function () {
            const text = input.value.trim().toLowerCase();
            suggestions.innerHTML = "";

            if (text === "") return;

            const matchedProducts = products.filter(product =>
                product.title.toLowerCase().includes(text)
            );

            matchedProducts.forEach(function (product) {
                const div = document.createElement("div");
                div.textContent = product.title;
                div.addEventListener("click", function () {
                    input.value = product.title;
                    suggestions.innerHTML = "";
                    window.location.href = `search.html?q=${encodeURIComponent(product.title)}`;
                });
                suggestions.appendChild(div);
            });
        });

        // Redirect on Enter
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && input.value.trim() !== "") {
                window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener("click", function (e) {
            if (!input.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.innerHTML = "";
            }
        });
    }

    // 3. Wishlist System Initialization
    updateHeartIcons();
    
    if (document.getElementById('fav')) {
        renderWishlistItems();
    }

    // 4. Cart System Initialization for Cart Page
    if (document.getElementById('cart-container')) {
        renderCartItems();
    }
    
    // تحديث عداد السلة عند فتح الصفحة
    updateCartBadge();
});


// ==================== وظائف الـ Wishlist (المفضلة) ====================

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// الاستماع لضغطات القلوب (إضافة / حذف)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('heart')) {
        const heartBtn = e.target;
        const itemCard = heartBtn.closest('.item');
        
        if (!itemCard) return;

        const product = {
            title: itemCard.dataset.title,
            price: itemCard.dataset.price,
            desc: itemCard.dataset.desc,
            img: itemCard.dataset.img
        };

        let wishlist = getWishlist();
        const existingIndex = wishlist.findIndex(item => item.title === product.title && item.img === product.img);

        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            heartBtn.classList.remove('active');
            heartBtn.style.color = ''; 
        } else {
            wishlist.push(product);
            heartBtn.classList.add('active');
            heartBtn.style.color = 'red';
        }

        saveWishlist(wishlist);

        if (document.getElementById('fav')) {
            renderWishlistItems();
        }
    }
});

function updateHeartIcons() {
    const wishlist = getWishlist();
    const items = document.querySelectorAll('.item');

    items.forEach(itemCard => {
        const title = itemCard.dataset.title;
        const img = itemCard.dataset.img;
        const heartBtn = itemCard.querySelector('.heart');

        const isFav = wishlist.some(item => item.title === title && item.img === img);
        if (isFav && heartBtn) {
            heartBtn.classList.add('active');
            heartBtn.style.color = 'red';
        }
    });
}

function renderWishlistItems() {
    const favContainer = document.getElementById('fav');
    if (!favContainer) return;

    const wishlist = getWishlist();

    if (wishlist.length === 0) {
        favContainer.innerHTML = `<p style="text-align:center; padding: 40px; color: #888;">No items in your wishlist yet!</p>`;
        return;
    }

    favContainer.innerHTML = '';

    wishlist.forEach(product => {
        const itemHTML = `
            <div class="item" 
                data-title="${product.title}" 
                data-price="${product.price}" 
                data-desc="${product.desc}" 
                data-img="${product.img}">
                <i class="fa-solid fa-heart heart active" style="color: red;"></i>
                <img src="${product.img}" alt="${product.title}">
                <p>${product.title}</p>
                <div>
                    <p class="view">View More</p>
                    <p>${product.price}</p>
                </div>
            </div>
        `;
        favContainer.insertAdjacentHTML('beforeend', itemHTML);
    });
}


// ==================== وظائف الـ Cart (السلة والـ Popup) ====================

// ربط زرار الـ Add to Cart داخل الـ Popup مع علامة الصح الخضراء
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    if (!popup) return;

    const addToCartBtn = popup.querySelector('button:not(#minus):not(#plus)');
    const countSpan = document.getElementById('count');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const title = document.getElementById('popup-title').textContent;
            const priceText = document.getElementById('popup-price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            const img = document.getElementById('popup-img').src;
            const quantity = parseInt(countSpan.textContent) || 1;

            const cartItem = {
                title: title,
                price: price,
                img: img,
                quantity: quantity
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const existingIndex = cart.findIndex(item => item.title === title);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            // تحديث العداد
            updateCartBadge();

            // إظهار علامة صح خضراء بدل الـ Alert
            let checkIcon = addToCartBtn.parentElement.querySelector('.success-check');
            if (!checkIcon) {
                checkIcon = document.createElement('span');
                checkIcon.className = 'success-check';
                checkIcon.innerHTML = '<i class="fa-solid fa-check" style="color: #28a745; margin-left: 8px; font-size: 18px; vertical-align: middle;"></i>';
                addToCartBtn.after(checkIcon);
            }

            checkIcon.style.display = 'inline-block';

            setTimeout(() => {
                checkIcon.style.display = 'none';
            }, 1500);
        });
    }
});

// تحديث عداد السلة في الـ Footer
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartFooterIcon = document.querySelector('footer .fitem a[href="cart.html"]');
    if (cartFooterIcon) {
        let badge = cartFooterIcon.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.style.cssText = `
                position: absolute;
                top: 5px;
                right: 15px;
                background: red;
                color: white;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 50%;
                font-weight: bold;
            `;
            cartFooterIcon.style.position = 'relative';
            cartFooterIcon.appendChild(badge);
        }
        
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// عرض منتجات السلة داخل صفحة cart.html وحذفها
function renderCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceSpan = document.getElementById('total-price');
    if (!cartContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="text-align:center; padding: 40px; color: #888;">Your cart is empty! 🛍️</p>`;
        if (totalPriceSpan) totalPriceSpan.textContent = '0';
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((product, index) => {
        const itemTotal = product.price * product.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #fff;">
                <img src="${product.img}" alt="${product.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                <div style="flex-grow: 1; margin-left: 15px;">
                    <h4 style="margin: 0; font-size: 16px;">${product.title}</h4>
                    <p style="margin: 5px 0 0; color: #666;">${product.price} EGP × ${product.quantity} = <strong>${itemTotal} EGP</strong></p>
                </div>
                <button class="remove-from-cart" data-index="${index}" style="background: #ff4d6d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    if (totalPriceSpan) {
        totalPriceSpan.textContent = total.toFixed(2);
    }
}

// تفعيل زر الحذف داخل صفحة الـ Cart
document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-from-cart');
    if (removeBtn) {
        const index = removeBtn.dataset.index;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        renderCartItems();
        updateCartBadge();
    }
});