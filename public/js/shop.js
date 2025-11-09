let products = [];
let cart = [];

// Load products
async function loadProducts() {
  try {
    const res = await fetch("/products");
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
}

// Initial load
loadProducts();

const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

// Render Products
function renderProducts(filtered) {
  container.innerHTML = "";
  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      // <div class="rating">⭐ ${p.rating}</div>
      <img src="${p.file}" alt="${p.name}" width="150">
      <h3>${p.name}</h3>
      <p>Category: ${p.category}</p>
      <p class="price">₹${p.price}</p>
      <p>Stock: ${p.quantity}</p>
      <p>${p.description}</p>
      <label>Quantity: 
        <select id="qty-${p._id}">
          ${[...Array(10).keys()]
            .map((i) => `<option value="${i + 1}">${i + 1}</option>`)
            .join("")}
        </select>
      </label>
      <div>
        <a href="#" class="btn btn-primary btn-buy" onclick="buyNow('${p._id}')">Buy Now</a>
        <a href="#" class="btn btn-warning btn-cart" onclick="addToCart('${p._id}')">Add to Cart</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Initial render
renderProducts(products);

// Filters
searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm) &&
      (categorySelect.value === "" || p.category === categorySelect.value)
  );
  renderProducts(filtered);
}

// Actions
function buyNow(id) {
  document.getElementById("buyProductId").value = id;
  const modal = new bootstrap.Modal(document.getElementById("buyModal"));
  modal.show();
}

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const product = products.find((p) => p._id === id);
  cart.push({ ...product, qty });
  document.getElementById("cartCount").innerText = cart.length;

  showToast(`${qty} x ${product.name} added to cart`);
}

function openCart() {
  const cartContainer = document.getElementById("cartItems");
  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
  } else {
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.className =
        "border rounded p-2 mb-2 d-flex justify-content-between align-items-center";
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong> (x${item.qty}) - ₹${
        item.price * item.qty
      }
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart('${
          item._id
        }')">Remove</button>
      `;
      cartContainer.appendChild(div);
    });
  }
  const modal = new bootstrap.Modal(document.getElementById("cartModal"));
  modal.show();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item._id !== id);
  document.getElementById("cartCount").innerText = cart.length;
  openCart();
}

function checkout() {
  if (cart.length === 0) return showToast("Your cart is empty");

  const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
  modal.show();
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("checkoutName").value;
    const email = document.getElementById("checkoutEmail").value;
    const phone = document.getElementById("checkoutPhone").value;
    const pincode = document.getElementById("checkoutPincode").value;
    const address = document.getElementById("checkoutAddress").value;

    const shippingDetails = { name, email, phone, pincode, address };

    fetch("/order-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, shippingDetails }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          cart = [];
          document.getElementById("cartCount").innerText = 0;

          bootstrap.Modal.getInstance(
            document.getElementById("checkoutModal")
          ).hide();
          bootstrap.Modal.getInstance(
            document.getElementById("cartModal")
          ).hide();

          showSuccess("Your order has been placed successfully!");
        } else {
          showToast(data.error || "Something went wrong");
        }
      })
      .catch((err) => console.error(err));
  });

document
  .getElementById("buyForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const productId = document.getElementById("buyProductId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const pincode = document.getElementById("pincode").value;
    const address = document.getElementById("address").value;

    const quantity = 1;

    fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity,
        name,
        email,
        phone,
        pincode,
        address,
      }),
    })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.success) {
          bootstrap.Modal.getInstance(
            document.getElementById("buyModal")
          ).hide();
          showSuccess("Order placed successfully!");
        } else {
          showToast(data.error || "Something went wrong");
        }
      })
      .catch((err) => console.error(err));
  });

function showToast(message) {
  const toastEl = document.getElementById("liveToast");
  document.getElementById("toastBody").innerText = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function showSuccess(message) {
  document.getElementById("successMsg").innerText = message;
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal")
  );
  successModal.show();
}
