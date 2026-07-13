const menuItems = [
  { id: 1, name: "سوشي دراجون رول", price: 15.00, category: "sushi", desc: "رول سوشي محشو بالجمبري المقرمش ومتاح للكل.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80" },
  { id: 2, name: "نودلز دجاج ووك", price: 12.50, category: "wok", desc: "وجبة ساخنة من النودلز.", image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&q=80" },
  { id: 3, name: "وجبة الكومبو العائلية", price: 35.00, category: "wok", desc: "حجم عائلي ضخم.", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&q=80" },
  { id: 4, name: "ديناميت شريمب", price: 9.00, category: "appetizers", desc: "جمبري مقلي بصوص الديناميت الحار.", image: "https://images.unsplash.com/photo-1559058789-672da06263d8?w=500&q=80" },
  { id: 5, name: "موهيتو فراولة", price: 4.50, category: "drinks", desc: "مشروب بارد ومنعش.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80" }
];

let currentCategory = 'all';
let cart = JSON.parse(localStorage.getItem('shiongmao_cart')) || [];

function saveCart() {
  localStorage.setItem('shiongmao_cart', JSON.stringify(cart));
}

window.renderMenuGrid = function(filterCategory = currentCategory) {
  currentCategory = filterCategory;
  const container = document.getElementById('menu-sections');
  container.innerHTML = '';

  const filteredItems = menuItems.filter(item => (currentCategory === 'all' || item.category === currentCategory));

  if (filteredItems.length === 0) {
    container.innerHTML = '<p class="text-center text-white/50 py-16 text-lg font-medium">عفواً، لا توجد أطباق متاحة في هذا القسم حالياً.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-ink-2 border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-gold/40 transition-all duration-300 shadow-md z-10 relative';
    card.innerHTML = `
      <div>
        <div class="w-full aspect-square rounded-lg overflow-hidden bg-black/30 mb-3 relative">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
        </div>
        <div class="flex justify-between items-start gap-2 mb-1.5">
          <h4 class="text-sm md:text-base font-bold text-white line-clamp-1">${item.name}</h4>
          <span class="text-gold text-sm font-bold shrink-0" dir="ltr">$${item.price.toFixed(2)}</span>
        </div>
        <p class="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">${item.desc}</p>
      </div>
      <button onclick="addToCart(${item.id})" class="w-full py-2 bg-white/5 hover:bg-gold hover:text-ink text-gold border border-gold/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5">
        <span>+ أضف للسلة</span>
      </button>
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('bg-crimson', 'text-white');
      b.classList.add('hover:border-white/30');
    });
    btn.classList.add('bg-crimson', 'text-white');
    btn.classList.remove('hover:border-white/30');
    renderMenuGrid(btn.getAttribute('data-tab'));
  });
});

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const cartConfirmBtn = document.getElementById('cart-confirm-btn');

window.openCart = function() {
  cartOverlay.classList.remove('hidden');
  cartDrawer.classList.remove('-translate-x-full');
  cartDrawer.classList.add('translate-x-0');
};

window.closeCart = function() {
  cartOverlay.classList.add('hidden');
  cartDrawer.classList.add('-translate-x-full');
  cartDrawer.classList.remove('translate-x-0');
};

let toastTimeout;
window.showToast = function(itemName) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  toastMsg.innerText = `تم إضافة "${itemName}" للسلة بنجاح!`;
  toast.classList.remove('opacity-0', 'translate-y-10');
  toast.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-10');
  }, 2500);
};

window.addToCart = function(id) {
  const product = menuItems.find(i => i.id === id);
  const existingItem = cart.find(i => i.id === id);
  if(existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(product.name);
};

window.changeQty = function(id, amount) {
  const item = cart.find(i => i.id === id);
  if(item) {
    item.qty += amount;
    if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI();
  }
};

window.clearCart = function() {
  cart = [];
  updateCartUI();
};

function updateCartUI() {
  saveCart(); 
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let count = 0;

  if(cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="text-center text-white/40 mt-10 text-sm">السلة فارغة حالياً</div>';
    cartConfirmBtn.classList.add('opacity-40', 'pointer-events-none');
  } else {
    cartConfirmBtn.classList.remove('opacity-40', 'pointer-events-none');
    cart.forEach(item => {
      total += (item.price * item.qty);
      count += item.qty;
      const itemEl = document.createElement('div');
      itemEl.className = 'flex items-center gap-4 py-3 border-b border-white/5';
      itemEl.innerHTML = `
        <img src="${item.image}" class="w-16 h-16 rounded object-cover border border-white/10" />
        <div class="flex-1">
          <h4 class="text-sm font-bold text-white">${item.name}</h4>
          <p class="text-gold text-sm font-bold" dir="ltr">$${(item.price * item.qty).toFixed(2)}</p>
          <div class="flex items-center gap-3 mt-2">
            <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 rounded bg-white/10 hover:bg-crimson flex items-center justify-center text-white transition">-</button>
            <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 rounded bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition">+</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  cartTotalEl.innerText = `$${total.toFixed(2)}`;
  cartCountEl.innerText = count;
  
  if(count > 0) {
    cartCountEl.classList.remove('scale-0');
    cartCountEl.classList.add('scale-100');
  } else {
    cartCountEl.classList.add('scale-0');
    cartCountEl.classList.remove('scale-100');
  }
}

window.goToCheckout = function() {
  if(cart.length > 0) {
    saveCart(); 
    window.location.href = 'checkout.html';
  }
};

renderMenuGrid();
updateCartUI();
