const cartData = localStorage.getItem('shiongmao_cart');
const summaryItems = document.getElementById('summary-items');
const summaryTotal = document.getElementById('summary-total');

if (cartData) {
  const cart = JSON.parse(cartData);
  let total = 0;

  if(cart.length === 0) window.location.href = 'menu.html'; 

  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center pb-3 border-b border-white/5 last:border-0';
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="bg-white/10 text-white w-6 h-6 flex items-center justify-center rounded text-xs">${item.qty}x</span>
        <span class="text-sm font-bold text-white/90">${item.name}</span>
      </div>
      <span class="text-gold font-bold text-sm" dir="ltr">$${(item.price * item.qty).toFixed(2)}</span>
    `;
    summaryItems.appendChild(div);
  });
  summaryTotal.innerText = `$${total.toFixed(2)}`;
} else {
  window.location.href = 'menu.html';
}

function toggleFormFields() {
  const isOnline = document.querySelector('input[name="order_type"][value="online"]').checked;
  document.getElementById('cash-fields').classList.toggle('hidden', isOnline);
  document.getElementById('online-fields').classList.toggle('hidden', !isOnline);
  
  document.getElementById('error-msg').classList.add('hidden');
}

function submitOrder(e) {
  e.preventDefault();
  
  const errorDiv = document.getElementById('error-msg');
  errorDiv.classList.add('hidden'); 

  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const isOnline = document.querySelector('input[name="order_type"][value="online"]').checked;
  
  const phoneRegex = /^01[0125][0-9]{8}$/;

  if (name.length < 3) {
    showError("يرجى إدخال الاسم بالكامل بشكل صحيح.");
    return;
  }

  if (!phoneRegex.test(phone)) {
    showError("يرجى إدخال رقم هاتف مصري صحيح (مثال: 01000000000).");
    return;
  }

  if (isOnline) {
    const address = document.getElementById('cust-address').value.trim();
    if (address.length < 5) {
      showError("يرجى إدخال عنوان التوصيل بالتفصيل.");
      return;
    }
  }

  const orderRef = "SW-" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('order-ref-number').innerText = "#" + orderRef;

  const modal = document.getElementById('success-modal');
  const modalContent = document.getElementById('success-modal-content');
  modal.classList.remove('hidden');
  
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  }, 10);
  
  localStorage.removeItem('shiongmao_cart');
}

function showError(msg) {
  const errorDiv = document.getElementById('error-msg');
  errorDiv.innerText = msg;
  errorDiv.classList.remove('hidden');
}

function closeSuccessAndRedirect() {
  window.location.href = 'index.html';
}