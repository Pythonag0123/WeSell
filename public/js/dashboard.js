
async function loadProducts() {
    try {
        const res = await fetch("http://localhost:8080/products/mine");
        const products = await res.json();

        const tbody = document.getElementById("productsBody");
        tbody.innerHTML = ""; 

        products.forEach(p => {
            console.log(p.file)
            const row = `
          <tr id="row-${p._id}">
            <td><img src="${p.file}" width="50"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td>${p.quantity}</td>
            <td>
              <button class="btn btn-success btn-sm" onClick='editProduct(${JSON.stringify(p)})' >Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p._id}')">Delete</button>
            </td>
          </tr>
        `;
            tbody.insertAdjacentHTML("beforeend", row);
        });
    } catch (err) {
        console.error("Error loading products:", err);
    }
}

const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        const res = await fetch(`http://localhost:8080/delete-item/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (res.ok) {
            document.getElementById(`row-${id}`).remove();
            alert("Product deleted successfully");
        } else {
            const msg = await res.text();
            alert("Failed to delete product: " + msg);
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error while deleting product");
    }
};

function editProduct(product) {
    document.getElementById("editId").value = product._id;
    document.getElementById("editName").value = product.name;
    document.getElementById("editCategory").value = product.category;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editQuantity").value = product.quantity;
    document.getElementById("editDescription").value = product.description;
    document.getElementById("currentImage").src = "/" + product.file;
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;

  const formData = new FormData();
  formData.append("name", document.getElementById("editName").value);
  formData.append("category", document.getElementById("editCategory").value);
  formData.append("price", document.getElementById("editPrice").value);
  formData.append("quantity", document.getElementById("editQuantity").value);
  formData.append("description", document.getElementById("editDescription").value);

  const fileInput = document.getElementById("editFile");
  if (fileInput.files[0]) {
    formData.append("file", fileInput.files[0]);
  }

  try {
    const res = await fetch(`/products/edit/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include" 
    });

    if (res.ok) {
      alert("Product updated successfully");
      loadProducts(); 
      const modalEl = document.getElementById("editModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } else {
      const msg = await res.text();
      alert("Failed to update product: " + msg);
    }
  } catch (err) {
    console.error("Error updating product:", err);
    alert("Error updating product");
  }
});

async function loadOrders() {
  try {
    const res = await fetch("http://localhost:8080/orders/mine", {
      credentials: "include"
    });
    const orders = await res.json();

    const tbody = document.querySelector("#ordersTableBody");
    tbody.innerHTML = ""; 

    orders.forEach(o => {
      const row = `
        <tr id="order-${o._id}">
          <td>${o.buyer?.username || "Unknown"}</td>
          <td>${o.shippingDetails?.phone || "-"}</td>
          <td>${o.shippingDetails?.address || "-"}, ${o.shippingDetails?.pincode || ""}</td>
          <td>${o.product?.name || "Deleted Product"}</td>
          <td>${o.product?.category || "-"}</td>
          <td>${o.quantity}</td>
          <td>₹${o.totalPrice}</td>
          <td>
            <select class="form-select form-select-sm" 
              onchange="updateOrderStatus('${o._id}', this.value)">
              <option ${o.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
              <option ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
              <option ${o.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Error loading orders:", err);
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`http://localhost:8080/orders/update/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include"
    });

    if (res.ok) {
      alert("Order status updated ");
    } else {
      alert("Failed to update order status");
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
}

loadProducts();
loadOrders();


