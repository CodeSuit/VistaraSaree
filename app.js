/**
 * VISTARA SILK & SAREES - Main Application Logic
 * State management, Cart, Wishlist, Quick View, Filtering, Currency, Booking
 */

// Application State
const VISTARA_STATE = {
  cart: JSON.parse(localStorage.getItem('vistara_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('vistara_wishlist')) || [],
  currency: localStorage.getItem('vistara_currency') || 'INR',
  discountPercent: 0,
  activeFilter: 'all',
  activeSort: 'featured',
  activeBlouseOption: 'unstitched', // 'unstitched' or 'stitched'
  stitchedBlousePriceINR: 2499
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initCurrencySelector();
  initMobileMenu();
  initDrawersAndModals();
  initProductCatalog();
  initSearch();
  initBookingModal();
  updateCartUI();
  updateWishlistUI();
});

/* ==========================================================================
   NAVIGATION & HEADER SCROLL
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  if (!mobileBtn || !mainNav) return;

  mobileBtn.addEventListener('click', () => {
    mainNav.classList.toggle('mobile-open');
    if (mainNav.classList.contains('mobile-open')) {
      mainNav.style.display = 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '100%';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.background = '#faf7f2';
      mainNav.style.padding = '24px';
      mainNav.style.borderBottom = '1px solid #c59b27';
      mainNav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    } else {
      mainNav.style.display = '';
    }
  });
}

/* ==========================================================================
   CURRENCY CONVERSION
   ========================================================================== */
function initCurrencySelector() {
  const selectors = document.querySelectorAll('.currency-select');
  selectors.forEach(sel => {
    sel.value = VISTARA_STATE.currency;
    sel.addEventListener('change', (e) => {
      VISTARA_STATE.currency = e.target.value;
      localStorage.setItem('vistara_currency', VISTARA_STATE.currency);
      selectors.forEach(s => s.value = VISTARA_STATE.currency);
      
      // Re-render components that have prices
      renderCatalogProducts();
      updateCartUI();
      updateWishlistUI();
      showToast(`Currency changed to ${VISTARA_STATE.currency}`);
    });
  });
}

/* ==========================================================================
   DRAWERS & MODALS INITIALIZATION
   ========================================================================== */
function initDrawersAndModals() {
  // Cart Drawer
  const cartTrigger = document.getElementById('cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close');
  const backdrop = document.getElementById('drawer-backdrop');

  if (cartTrigger && cartDrawer) {
    cartTrigger.addEventListener('click', () => openCartDrawer());
    if (cartClose) cartClose.addEventListener('click', () => closeDrawers());
  }

  // Wishlist Drawer
  const wishlistTrigger = document.getElementById('wishlist-trigger');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistClose = document.getElementById('wishlist-close');

  if (wishlistTrigger && wishlistDrawer) {
    wishlistTrigger.addEventListener('click', () => openWishlistDrawer());
    if (wishlistClose) wishlistClose.addEventListener('click', () => closeDrawers());
  }

  // Backdrop close
  if (backdrop) {
    backdrop.addEventListener('click', () => closeDrawers());
  }

  // Quick View Modal
  const modalBackdrop = document.getElementById('quickview-modal');
  const modalClose = document.getElementById('modal-close');
  if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }

  // Search Modal
  const searchTrigger = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  if (searchTrigger && searchModal) {
    searchTrigger.addEventListener('click', () => {
      searchModal.classList.add('open');
      const input = searchModal.querySelector('.search-input');
      if (input) input.focus();
    });
    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchModal.classList.remove('open');
      });
    }
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('open');
    });
  }
}

function openCartDrawer() {
  closeDrawers();
  const cartDrawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (cartDrawer && backdrop) {
    cartDrawer.classList.add('open');
    backdrop.classList.add('open');
    updateCartUI();
  }
}

function openWishlistDrawer() {
  closeDrawers();
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (wishlistDrawer && backdrop) {
    wishlistDrawer.classList.add('open');
    backdrop.classList.add('open');
    updateWishlistUI();
  }
}

function closeDrawers() {
  const cartDrawer = document.getElementById('cart-drawer');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (wishlistDrawer) wishlistDrawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
}

/* ==========================================================================
   PRODUCT CATALOG & FILTERING
   ========================================================================== */
function initProductCatalog() {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      VISTARA_STATE.activeFilter = btn.dataset.filter || 'all';
      renderCatalogProducts();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      VISTARA_STATE.activeSort = e.target.value;
      renderCatalogProducts();
    });
  }

  renderCatalogProducts();
}

function renderCatalogProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  let items = [...PRODUCTS];

  // Filter logic
  if (VISTARA_STATE.activeFilter !== 'all') {
    items = items.filter(p => 
      p.category === VISTARA_STATE.activeFilter || 
      p.occasion === VISTARA_STATE.activeFilter
    );
  }

  // Sort logic
  if (VISTARA_STATE.activeSort === 'price-low') {
    items.sort((a, b) => a.priceINR - b.priceINR);
  } else if (VISTARA_STATE.activeSort === 'price-high') {
    items.sort((a, b) => b.priceINR - a.priceINR);
  } else if (VISTARA_STATE.activeSort === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--color-text-muted);">
          No sarees found in this category. Explore our full Heirloom collection.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => {
    const isWishlisted = VISTARA_STATE.wishlist.includes(product.id);
    const formattedPrice = formatPrice(product.priceINR, VISTARA_STATE.currency);
    const formattedOrigPrice = formatPrice(product.originalPriceINR, VISTARA_STATE.currency);
    const discount = Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100);

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-media">
          <img class="card-img primary" src="${product.primaryImage}" alt="${product.name}" loading="lazy" />
          <img class="card-img secondary" src="${product.secondaryImage}" alt="${product.name} Pallu Detail" loading="lazy" />
          
          <div class="card-badges">
            <span class="card-badge badge-heirloom">${product.tag}</span>
          </div>

          ${product.silkMark ? `
            <div class="silk-mark-tag" title="Silk Mark Certified Pure Silk">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>Silk Mark</span>
            </div>
          ` : ''}

          <div class="card-hover-actions">
            <button class="btn-card-action" onclick="openQuickView('${product.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Quick View
            </button>
            <button class="btn-wishlist-toggle ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" title="Save to Wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="card-origin">${product.origin}</div>
          <h3 class="card-title" onclick="openQuickView('${product.id}')">${product.name}</h3>
          <p class="card-weave-sub">${product.weave}</p>
          
          <div class="card-pricing">
            <span class="current-price">${formattedPrice}</span>
            <span class="original-price">${formattedOrigPrice}</span>
            <span class="discount-badge">${discount}% OFF</span>
          </div>

          <button class="btn-primary" style="margin-top: 14px; width: 100%; padding: 10px; font-size: 0.74rem;" onclick="addToCart('${product.id}', 'unstitched')">
            Add to Bag
          </button>
        </div>
      </article>
    `;
  }).join('');
}

/* ==========================================================================
   PRODUCT QUICK VIEW MODAL
   ========================================================================== */
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const formattedPrice = formatPrice(product.priceINR, VISTARA_STATE.currency);
  const formattedOrigPrice = formatPrice(product.originalPriceINR, VISTARA_STATE.currency);
  const isWishlisted = VISTARA_STATE.wishlist.includes(product.id);
  const stitchedPriceFormatted = formatPrice(VISTARA_STATE.stitchedBlousePriceINR, VISTARA_STATE.currency);

  content.innerHTML = `
    <div class="modal-gallery">
      <img id="quickview-main-image" class="modal-main-img" src="${product.primaryImage}" alt="${product.name}" />
      <div class="modal-thumbnails">
        <img class="modal-thumb active" src="${product.primaryImage}" onclick="switchQuickViewImage('${product.primaryImage}', this)" />
        <img class="modal-thumb" src="${product.secondaryImage}" onclick="switchQuickViewImage('${product.secondaryImage}', this)" />
      </div>
    </div>

    <div class="modal-info">
      <div class="modal-origin-tag">${product.origin} &bull; ${product.tag}</div>
      <h2 class="modal-title">${product.name}</h2>
      
      <div class="modal-ratings">
        <span style="color: var(--color-gold); font-size: 1.1rem;">★★★★★</span>
        <span style="font-weight: 600;">${product.rating}</span>
        <span style="color: var(--color-text-muted);">(${product.reviewsCount} verified reviews)</span>
      </div>

      <div class="modal-pricing">
        <span class="modal-price">${formattedPrice}</span>
        <span class="original-price" style="font-size: 1rem;">${formattedOrigPrice}</span>
        <span class="discount-badge">Handloom Certified</span>
      </div>

      <p style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 20px;">
        ${product.description}
      </p>

      <div class="modal-specs-list">
        <div class="modal-spec-row">
          <strong>Fabric:</strong>
          <span>${product.fabric}</span>
        </div>
        <div class="modal-spec-row">
          <strong>Zari Detail:</strong>
          <span>${product.zari}</span>
        </div>
        <div class="modal-spec-row">
          <strong>Weaving Style:</strong>
          <span>${product.weave}</span>
        </div>
        <div class="modal-spec-row">
          <strong>Dimensions:</strong>
          <span>${product.length}</span>
        </div>
      </div>

      <div class="blouse-options">
        <label>Select Blouse Tailoring Service:</label>
        <div class="blouse-radios">
          <div class="blouse-radio-card active" id="opt-unstitched" onclick="selectBlouseOption('unstitched')">
            <span style="font-weight: 600; display: block;">Unstitched (Included)</span>
            <span style="font-size: 0.72rem; color: var(--color-text-muted);">Standard 0.8m running fabric</span>
          </div>
          <div class="blouse-radio-card" id="opt-stitched" onclick="selectBlouseOption('stitched')">
            <span style="font-weight: 600; display: block;">Custom Tailored (+${stitchedPriceFormatted})</span>
            <span style="font-size: 0.72rem; color: var(--color-text-muted);">Bespoke fit by master bridal tailors</span>
          </div>
        </div>
      </div>

      <div class="modal-cta-row">
        <button class="btn-primary" onclick="addQuickViewToCart('${product.id}')">
          Add To Shopping Bag
        </button>
        <button class="btn-secondary" onclick="toggleWishlist('${product.id}')">
          ${isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function switchQuickViewImage(src, thumbElement) {
  const main = document.getElementById('quickview-main-image');
  if (main) main.src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  if (thumbElement) thumbElement.classList.add('active');
}

function selectBlouseOption(option) {
  VISTARA_STATE.activeBlouseOption = option;
  document.querySelectorAll('.blouse-radio-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`opt-${option}`);
  if (card) card.classList.add('active');
}

function addQuickViewToCart(productId) {
  addToCart(productId, VISTARA_STATE.activeBlouseOption);
  const modal = document.getElementById('quickview-modal');
  if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   CART MANAGEMENT & LOGIC
   ========================================================================== */
function addToCart(productId, blouseOption = 'unstitched') {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = VISTARA_STATE.cart.findIndex(item => item.id === productId && item.blouseOption === blouseOption);

  if (existingIndex > -1) {
    VISTARA_STATE.cart[existingIndex].quantity += 1;
  } else {
    VISTARA_STATE.cart.push({
      id: product.id,
      name: product.name,
      priceINR: blouseOption === 'stitched' ? product.priceINR + VISTARA_STATE.stitchedBlousePriceINR : product.priceINR,
      image: product.primaryImage,
      origin: product.origin,
      blouseOption: blouseOption,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`"${product.name}" added to your bag.`);
  openCartDrawer();
}

function updateCartQuantity(index, change) {
  if (!VISTARA_STATE.cart[index]) return;
  VISTARA_STATE.cart[index].quantity += change;

  if (VISTARA_STATE.cart[index].quantity <= 0) {
    VISTARA_STATE.cart.splice(index, 1);
  }

  saveCart();
  updateCartUI();
}

function removeCartItem(index) {
  if (!VISTARA_STATE.cart[index]) return;
  const removedName = VISTARA_STATE.cart[index].name;
  VISTARA_STATE.cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast(`Removed "${removedName}" from bag.`);
}

function saveCart() {
  localStorage.setItem('vistara_cart', JSON.stringify(VISTARA_STATE.cart));
}

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'VISTARA10' || code === 'ROYALVISTARA') {
    VISTARA_STATE.discountPercent = 10;
    showToast('Royal Code Applied! 10% Discount unlocked.');
    updateCartUI();
  } else {
    showToast('Invalid promotional code. Try: VISTARA10');
  }
}

function updateCartUI() {
  // Update badge counters
  const totalCount = VISTARA_STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  const cartList = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountRow = document.getElementById('cart-discount-row');
  const cartDiscountAmount = document.getElementById('cart-discount-amount');
  const cartTotalEl = document.getElementById('cart-total');
  const freeShippingBar = document.getElementById('shipping-progress-fill');
  const freeShippingText = document.getElementById('shipping-progress-text');

  if (!cartList) return;

  if (VISTARA_STATE.cart.length === 0) {
    cartList.innerHTML = `
      <div class="drawer-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <p>Your shopping bag is currently empty.</p>
        <button class="btn-primary" onclick="closeDrawers()">Discover Sarees</button>
      </div>
    `;

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(0, VISTARA_STATE.currency);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(0, VISTARA_STATE.currency);
    if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    if (freeShippingBar) freeShippingBar.style.width = '0%';
    if (freeShippingText) freeShippingText.textContent = 'Add sarees to unlock complimentary shipping';
    return;
  }

  // Calculate totals
  const subtotalINR = VISTARA_STATE.cart.reduce((sum, item) => sum + (item.priceINR * item.quantity), 0);
  const discountINR = Math.round(subtotalINR * (VISTARA_STATE.discountPercent / 100));
  const finalTotalINR = subtotalINR - discountINR;

  // Free shipping progress (Threshold: ₹50,000)
  const freeShippingThreshold = 50000;
  const pct = Math.min(100, Math.round((subtotalINR / freeShippingThreshold) * 100));
  if (freeShippingBar) freeShippingBar.style.width = `${pct}%`;
  if (freeShippingText) {
    if (subtotalINR >= freeShippingThreshold) {
      freeShippingText.innerHTML = `<strong>Congratulations!</strong> You qualify for Complimentary Global Express Shipping.`;
    } else {
      const remaining = freeShippingThreshold - subtotalINR;
      freeShippingText.innerHTML = `Add <strong>${formatPrice(remaining, VISTARA_STATE.currency)}</strong> more for Complimentary Global Express Shipping`;
    }
  }

  // Render items
  cartList.innerHTML = `
    <div class="cart-items-list">
      ${VISTARA_STATE.cart.map((item, index) => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">
              ${item.origin} &bull; ${item.blouseOption === 'stitched' ? 'Bespoke Tailored Blouse' : 'Unstitched Blouse'}
            </div>
            <div class="cart-item-price">${formatPrice(item.priceINR, VISTARA_STATE.currency)}</div>
            <div class="cart-item-bottom">
              <div class="qty-stepper">
                <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
              </div>
              <span class="btn-remove-item" onclick="removeCartItem(${index})">Remove</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotalINR, VISTARA_STATE.currency);

  if (cartDiscountRow && cartDiscountAmount) {
    if (VISTARA_STATE.discountPercent > 0) {
      cartDiscountRow.style.display = 'flex';
      cartDiscountAmount.textContent = `-${formatPrice(discountINR, VISTARA_STATE.currency)}`;
    } else {
      cartDiscountRow.style.display = 'none';
    }
  }

  if (cartTotalEl) cartTotalEl.textContent = formatPrice(finalTotalINR, VISTARA_STATE.currency);
}

function proceedToCheckout() {
  if (VISTARA_STATE.cart.length === 0) {
    showToast('Your bag is empty.');
    return;
  }
  showCheckoutModal();
}

function showCheckoutModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop open';
  modal.style.zIndex = '3500';
  modal.innerHTML = `
    <div class="modal-box" style="max-width: 520px; padding: 36px 30px; text-align: center;">
      <div style="width: 56px; height: 56px; margin: 0 auto 16px auto; border-radius: 50%; background: #faf7f2; border: 2px solid var(--color-gold); display: flex; align-items: center; justify-content: center; color: var(--color-gold);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-primary); margin-bottom: 8px;">Order Placed with Vistara Concierge</h3>
      <p style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">
        Thank you for choosing heirloom craftsmanship. Our personal bridal stylist and weaving concierge will contact you via WhatsApp / Phone to confirm measurements and dispatch timeline.
      </p>
      <div style="background: var(--color-cream); padding: 16px; border-radius: 4px; margin-bottom: 24px; font-size: 0.85rem; text-align: left;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <strong>Order Reference:</strong>
          <span>VIS-${Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <strong>Silk Mark Verification:</strong>
          <span style="color: var(--color-emerald); font-weight: 600;">Authentic Certified</span>
        </div>
      </div>
      <button class="btn-primary" style="width: 100%;" onclick="this.closest('.modal-backdrop').remove(); clearCart(); closeDrawers();">
        Return to Boutique
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

function clearCart() {
  VISTARA_STATE.cart = [];
  saveCart();
  updateCartUI();
}

/* ==========================================================================
   WISHLIST MANAGEMENT
   ========================================================================== */
function toggleWishlist(productId) {
  const index = VISTARA_STATE.wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);

  if (index > -1) {
    VISTARA_STATE.wishlist.splice(index, 1);
    showToast(`Removed from Wishlist`);
  } else {
    VISTARA_STATE.wishlist.push(productId);
    showToast(`Saved "${product ? product.name : 'Saree'}" to your Wishlist`);
  }

  localStorage.setItem('vistara_wishlist', JSON.stringify(VISTARA_STATE.wishlist));
  updateWishlistUI();
  renderCatalogProducts();
}

function updateWishlistUI() {
  const count = VISTARA_STATE.wishlist.length;
  document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });

  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div class="drawer-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <p>No treasured weaves saved yet.</p>
        <button class="btn-primary" onclick="closeDrawers()">Browse Sarees</button>
      </div>
    `;
    return;
  }

  const wishlistedProducts = PRODUCTS.filter(p => VISTARA_STATE.wishlist.includes(p.id));

  container.innerHTML = `
    <div class="cart-items-list">
      ${wishlistedProducts.map(p => `
        <div class="cart-item">
          <img class="cart-item-img" src="${p.primaryImage}" alt="${p.name}" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${p.name}</h4>
            <div class="cart-item-meta">${p.origin} &bull; ${p.fabric}</div>
            <div class="cart-item-price">${formatPrice(p.priceINR, VISTARA_STATE.currency)}</div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button class="btn-primary" style="padding: 6px 12px; font-size: 0.7rem;" onclick="addToCart('${p.id}'); toggleWishlist('${p.id}');">
                Move To Bag
              </button>
              <button class="btn-remove-item" onclick="toggleWishlist('${p.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ==========================================================================
   PREDICTIVE SEARCH
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const dropdown = document.getElementById('search-results');
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      dropdown.classList.remove('has-results');
      dropdown.innerHTML = '';
      return;
    }

    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.fabric.toLowerCase().includes(query) ||
      p.origin.toLowerCase().includes(query) ||
      p.colorName.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      dropdown.classList.add('has-results');
      dropdown.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--color-text-muted); font-size: 0.88rem;">
          No drapes matching "${query}". Try searching "Kanjivaram", "Banarasi", or "Silk".
        </div>
      `;
      return;
    }

    dropdown.classList.add('has-results');
    dropdown.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="openQuickView('${p.id}'); document.getElementById('search-modal').classList.remove('open');">
        <img class="search-result-img" src="${p.primaryImage}" alt="${p.name}" />
        <div class="search-result-info">
          <h6>${p.name}</h6>
          <span>${p.origin} &bull; ${p.fabric} &bull; ${formatPrice(p.priceINR, VISTARA_STATE.currency)}</span>
        </div>
      </div>
    `).join('');
  });
}

/* ==========================================================================
   BRIDAL CONSULTATION BOOKING MODAL
   ========================================================================== */
function initBookingModal() {
  const bookBtns = document.querySelectorAll('.trigger-booking-modal');
  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });
}

function openBookingModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop open';
  modal.style.zIndex = '3200';
  modal.innerHTML = `
    <div class="modal-box" style="max-width: 600px; padding: 36px 32px;">
      <button class="modal-close-btn" onclick="this.closest('.modal-backdrop').remove()">✕</button>
      <div style="text-align: center; margin-bottom: 24px;">
        <span class="section-eyebrow">VIP Bespoke Service</span>
        <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-primary);">Book a Private Bridal Consultation</h3>
        <p style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-text-muted); margin-top: 6px;">
          Meet our senior master stylists either in-person at our flagship boutiques or via 1-on-1 private video shopping call.
        </p>
      </div>

      <form id="booking-form" onsubmit="handleBookingSubmit(event, this)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Full Name</label>
            <input required type="text" placeholder="e.g. Radhika Sharma" style="width: 100%; padding: 10px 14px; border: 1px solid var(--color-sand); border-radius: 2px; font-size: 0.9rem;" />
          </div>
          <div>
            <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">WhatsApp / Phone</label>
            <input required type="tel" placeholder="+91 98765 43210" style="width: 100%; padding: 10px 14px; border: 1px solid var(--color-sand); border-radius: 2px; font-size: 0.9rem;" />
          </div>
        </div>

        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Preferred Boutique / Experience</label>
          <select required style="width: 100%; padding: 10px 14px; border: 1px solid var(--color-sand); border-radius: 2px; font-size: 0.88rem; background: var(--color-white);">
            <option value="mumbai">Mumbai Flagship - Kala Ghoda Heritage Boutique</option>
            <option value="delhi">Delhi Flagship - The Mehrauli Courtyard</option>
            <option value="bangalore">Bangalore Salon - Indiranagar 100ft Rd</option>
            <option value="video">Global Video Shopping (HD 4K Loom Draping)</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
          <div>
            <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Preferred Date</label>
            <input required type="date" style="width: 100%; padding: 10px 14px; border: 1px solid var(--color-sand); border-radius: 2px; font-size: 0.88rem;" />
          </div>
          <div>
            <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Occasion / Trousseau</label>
            <select style="width: 100%; padding: 10px 14px; border: 1px solid var(--color-sand); border-radius: 2px; font-size: 0.88rem; background: var(--color-white);">
              <option>Bridal Muhurtham Saree</option>
              <option>Sangeet & Reception Drapes</option>
              <option>Family & Festive Trousseau</option>
              <option>Pure Heritage Handloom Collector</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; padding: 14px;">
          Confirm VIP Appointment
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function handleBookingSubmit(event, form) {
  event.preventDefault();
  const modal = form.closest('.modal-backdrop');
  if (modal) modal.remove();
  showToast('VIP Consultation booked! Our concierge will WhatsApp you the confirmation.');
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function handleNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  if (input) {
    input.value = '';
    showToast('Welcome to the Vistara Connoisseur Circle! ₹1,500 credit code sent to your email.');
  }
}
