const products = [
  {
    foto: "assets/indomie.jpeg",
    nama: "Indomie Goreng",
    harga: 3100
  },
  {
    foto: "assets/indomilk.jpeg",
    nama: "Indomilk Coklat",
    harga: 4400
  },
  {
    foto: "assets/teh-pucuk.jpeg",
    nama: "Teh Pucuk",
    harga: 6600
  },
  {
    foto: "assets/roti-tawar.jpeg",
    nama: "Roti Tawar",
    harga: 15000
  },
  {
    foto: "assets/sarden.jpeg",
    nama: "Sarden Asahi",
    harga: 9800
  },
  {
    foto: "assets/beras.jpeg",
    nama: "Beras Kristal",
    harga: 69500
  },
  {
    foto: "assets/abon.jpeg",
    nama: "Abon Sapi",
    harga: 12500
  },
  {
    foto: "assets/tango-drink.jpeg",
    nama: "Tango Drink",
    harga: 5000
  }

];

const productList = document.getElementById('productList');

products.forEach((product, index) => {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  
  productDiv.innerHTML = `
    <div class="product-item">
      <h3>${product.nama}</h3>
      <img class="product-img" src="${product.foto}" alt="${product.nama}">
      <p>Harga: Rp${product.harga}</p>
      <div class="button-qty">
        <button class="incrementProduct">+</button>
        <span class="productQuantity">0</span>
        <button class="decrementProduct">-</button>
      </div>
      <button class="addToCartButton">Tambah Barang</button>
    </div>
  `;
  
  productList.appendChild(productDiv);

  const incrementButtons = productDiv.querySelectorAll('.incrementProduct');
  const decrementButtons = productDiv.querySelectorAll('.decrementProduct');
  const quantitySpan = productDiv.querySelector('.productQuantity');
  
  let quantity = 0;

  incrementButtons.forEach(button => {
    button.addEventListener('click', () => {
      quantity++;
      quantitySpan.textContent = quantity;
    });
  });

  decrementButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity;
      }
    });
  });
  
  const addToCartButton = productDiv.querySelector('.addToCartButton');
  
  addToCartButton.addEventListener('click', () => {
    const selectedProduct = products[index];
    if (quantity > 0) {
      addToCart(selectedProduct, quantity);
      quantity = 0;
      quantitySpan.textContent = quantity;
    }
  });
});

const cartItemsList = document.getElementById('cartItems');
const clearCartButton = document.getElementById('clearCart');
const printReceiptButton = document.getElementById('printReceipt');
const totalPriceSpan = document.getElementById('totalPrice');
const taxSpan = document.getElementById('tax');
const totalPaymentSpan = document.getElementById('totalPayment');

const cart = [];

const addToCart = (product, quantity) => {
  const existingCartItem = cart.find(item => item.product === product);
  
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  updateCartUI();
  updateTotalPrice();
};

const updateCartUI = () => {
  cartItemsList.innerHTML = '';

  cart.forEach((cartItem) => {
    const listItem = document.createElement('li');
    const totalItemPrice = cartItem.product.harga * cartItem.quantity;
    listItem.innerHTML = `
      <div class="cart-item">
        <img class="cart-img" src="${cartItem.product.foto}" alt="${cartItem.product.nama}">
        <div class="cart-description">
          <h4>${cartItem.product.nama}</h4>
          <span>${cartItem.product.nama} x ${cartItem.quantity} = Rp${totalItemPrice}</span>
        </div>
      </div>
      
    `;
    cartItemsList.appendChild(listItem);
  });
};

const updateTotalPrice = () => {
  const subtotal = cart.reduce((accumulator, currentItem) => {
    return accumulator + (currentItem.product.harga * currentItem.quantity);
  }, 0);
  
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  totalPriceSpan.textContent = subtotal;
  taxSpan.textContent = tax;
  totalPaymentSpan.textContent = total;
};

clearCartButton.addEventListener('click', () => {
  cart.length = 0;
  updateCartUI();
  updateTotalPrice();
});

printReceiptButton.addEventListener('click', () => {
  printReceipt();
});

const printReceipt = () => {
  const receipt = cart.map(item => {
  const totalItemPrice = item.product.harga * item.quantity;
      return `${item.product.nama} x ${item.quantity} = Rp${totalItemPrice}`;
  });
  if(cart.length > 0) {
    receipt.push(
      `--------------------------------------------
Total Harga: Rp${totalPriceSpan.textContent}
Pajak 11%: Rp${taxSpan.textContent}
Total Pembayaran: Rp${totalPaymentSpan.textContent}`);
   alert(receipt.join('\n'));
  }

  cart.length = 0;
  updateCartUI();
  updateTotalPrice();
};