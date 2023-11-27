const cartContainer = document.querySelector(".cart-container");
const productList = document.querySelector(".product-list");
const cartList = document.querySelector(".cart-list");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCountInfo = document.getElementById("cart-count-info");
let cartItemID = 1;

eventListeners();
function eventListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    loadJSON();
    loadCart();
  });

  // document.querySelector(".navbar-toggler").addEventListener("click", () => {
  //   document.querySelector(".navbar-collapse").classList.toggle("show-navbar");
  // });

  document.getElementById("cart-btn").addEventListener("click", () => {
    cartContainer.classList.toggle("show-cart-container");
  });

  productList.addEventListener("click", purchaseProduct);

  cartList.addEventListener("click", deleteProduct);
}

function updateCartInfo() {
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}
function loadJSON() {
  fetch("items.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let html = "";
      data.forEach((product) => {
        console.log(product);
        html += `
              <div class = "product-item">
                  <div class = "product-img">
                      <img src = "${product.image}" alt = "product image">
                      <button type = "button" class = "add-to-cart-btn">
                          <i class = "fas fa-shopping-cart"></i>Add To Cart
                      </button>
                  </div>
                  <div class = "product-content">
                      <h3 class = "product-name">${product.title}</h3>
                      <span class = "product-category">${product.category}</span>
                      <p class = "product-price">$${product.price}</p>
                  </div>
              </div>
          `;
      });
      productList.innerHTML = html;
    })
    .catch((error) => {
      alert(`User live server or local server`);
    });
}

function purchaseProduct(e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}

function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    image: product.querySelector(".product-img img").src,
    title: product.querySelector(".product-name").textContent,
    category: product.querySelector(".product-category").textContent,
    price: product.querySelector(".product-price").textContent
  };
  cartItemID++;
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}
function addToCartList(product) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-id", `${product.id}`);
  cartItem.innerHTML = `
    <div class="cart-item-column">
      <img src="${product.image}" alt="product image">
    </div>
    <div class="cart-item-column">
      <div class="cart-item-info">
        <h3 class="cart-item-name">${product.title}</h3>
        <span class="cart-item-category">${product.category}</span>
        <span class="cart-item-price">${product.price}</span>
        <span class="cart-item-count">${product.quantity}</span>
      </div>
    </div>
    <div class="cart-item-column">
      <button type="button" class="cart-item-del-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  cartList.appendChild(cartItem);

  const deleteBtn = cartItem.querySelector(".cart-item-del-btn");
  deleteBtn.addEventListener("click", () => deleteCartItem(cartItem));

  updateCartInfo();
}

function updateCartItemQuantity(cartItem, quantity) {
  const countElement = cartItem.querySelector(".cart-item-count");
  if (countElement) {
    countElement.textContent = quantity;
  }
}

function increaseQuantity(cartItem) {
  let products = getProductFromStorage();
  let itemId = parseInt(cartItem.getAttribute("data-id"));

  let updatedProducts = products.map((product) => {
    if (product.id === itemId) {
      // Increase count (not quantity)
      product.quantity += 1;
    }
    return product;
  });

  localStorage.setItem("products", JSON.stringify(updatedProducts));
  updateCartInfo();
  updateCartItemQuantity(cartItem, updatedProducts.find((product) => product.id === itemId).quantity);
}

function decreaseQuantity(cartItem) {
  let products = getProductFromStorage();
  let itemId = parseInt(cartItem.getAttribute("data-id"));

  let updatedProducts = products.map((product) => {
    if (product.id === itemId && product.quantity > 1) {
      // Decrease count (not quantity) if greater than 1
      product.quantity -= 1;
    }
    return product;
  });

  localStorage.setItem("products", JSON.stringify(updatedProducts));
  updateCartInfo();
  updateCartItemQuantity(cartItem, updatedProducts.find((product) => product.id === itemId).quantity);
}

function updateCartItemQuantity(cartItem, quantity) {
  const quantityElement = cartItem.querySelector(".cart-item-quantity");
  if (quantityElement) {
    quantityElement.textContent = quantity;
  }
}

function deleteCartItem(cartItem) {
  let itemId = parseInt(cartItem.getAttribute("data-id"));
  let products = getProductFromStorage();

  let updatedProducts = products.filter((product) => {
    return product.id !== itemId;
  });

  localStorage.setItem("products", JSON.stringify(updatedProducts));
  cartItem.remove();
  updateCartInfo();
}


function updateCartInfo() {
  const cartCountInfo = document.getElementById('cart-count-info');
const cartTotalValue = document.getElementById('cart-total-value'); // Add this line if 'cart-total-value' is the correct ID
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}


function saveProductInStorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem("products", JSON.stringify(products));
  updateCartInfo();
}

function getProductFromStorage() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
}

function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemID = 1; 
  } else {
    cartItemID = products[products.length - 1].id;
    cartItemID++;
  }
  products.forEach((product) => addToCartList(product));

  updateCartInfo();
}
function findCartInfo() {
  let products = getProductFromStorage();
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price.substr(1)); 
    return (acc += price);
  }, 0); 

  return {
    total: total.toFixed(2),
    productCount: products.length
  };
}

function deleteProduct(e) {
  let cartItem;
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.parentElement;
    cartItem.remove(); 
  } else if (e.target.tagName === "I") {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove(); 
  }

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts)); 
  updateCartInfo();
}
