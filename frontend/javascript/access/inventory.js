import BulkItems from "../model/BulkItems.js";
import PerishableItems from "../model/PerishableItems.js";

//render all the products in the dashboard
const inventoryTableBody = document.getElementById('inventory-tbody-styled');

export function renderInventory(ItemManager) {

  //displaying products
  function displayProducts() {
    try {
      if (!inventoryTableBody) throw new Error('No Table Body Found.');
      inventoryTableBody.innerHTML = '';
      const products = ItemManager.getAllProducts();
      products.forEach(prd => {
        let tableRows;
        if (prd instanceof PerishableItems) {
          tableRows = `
            <tr data-id="${prd.id}">
              <td><input type="checkbox" class="product-checkbox"></td>
              <td><span class="category-badge">${prd.id}</span></td>
              <td>
                <div class="product-info-cell">
                  <span class="product-name-text">${prd.name}</span>
                </div>
              </td>
              <td class="text-mono product_type">${prd.productType}</td>
             
              <td>
                <div class="variant-info">
                  <span class="variant-count">${prd.expiryDate.toLocaleDateString()}</span>
                  <span class="variant-subtitle">Varies on: Expiration</span>
                </div>
              </td>
              <td class="text-mono price-cell">${(prd.priceCents / 100).toFixed(2)}</td>
              <td><span class="status-pill" data-status="${prd.status}">${prd.status}</span></td>
              <td data-quantity="${prd.quantity}"> ${prd.quantity}</td>
              <td class="action-cell">
                <div class="action-buttons-wrapper">
                  <button class="btn-table-action btn-edit" title="Edit" data-product-id="${prd.id}"><i class="bi bi-pencil"></i></button>
                  <button class="btn-table-action btn-delete" title="Delete"><i class="bi bi-trash"></i></button>
                </div>
              </td>
              </tr>
          `
        } else if (prd instanceof BulkItems) {
          tableRows = `
            <tr data-id="${prd.id}">
              <td><input type="checkbox" class="product-checkbox"></td>
              <td><span class="category-badge">${prd.id}</span></td>
              <td>
                <div class="product-info-cell">
                  <span class="product-name-text">${prd.name}</span>
                </div>
              </td>
              <td class="text-mono product_type">${prd.productType}</td>
              
              <td>
                <div class="variant-info">
                  <span class="variant-count">${prd.weightPerUnit} kg</span>
                  <span class="variant-subtitle">Varies on: Weight</span>
                </div>
              </td>
              <td class="text-mono price-cell">${(prd.priceCents * .1).toFixed(2)}</td>
              <td><span class="status-pill" data-status="${prd.status}">${prd.status}</span></td>
              <td data-quantity="${prd.quantity}"> ${prd.quantity}</td>
              <td class="action-cell">
                <div class="action-buttons-wrapper">
                  <button class="btn-table-action btn-edit" title="Edit" data-product-id="${prd.id}"><i class="bi bi-pencil"></i></button>
                  <button class="btn-table-action btn-delete" title="Delete"><i class="bi bi-trash"></i></button>
                </div>
              </td>
              </tr>
          `
        }
        inventoryTableBody.insertAdjacentHTML('beforeend', tableRows);
      })
    } catch (error) {
      console.error(error);
    }
  }

  displayProducts();

  // Drawer opening and closing logic
  const openBtn = document.getElementById('btn-open-add-form');
  const closeBtn = document.getElementById('btn-close-drawer');
  const overlay = document.getElementById('product-drawer-overlay');

  openBtn.addEventListener('click', () => {
    console.log("Open Drawer...");
    overlay.classList.add('open');
  });

  const closeDrawer = () => {
    console.log("Close Drawer...");
    overlay.classList.remove('open');
  };

  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDrawer();
    }
  });

  // Checkbox select all logic
  const checkAll = document.getElementById('check-all-products');
  const checkboxes = document.querySelectorAll('.product-checkbox');

  checkAll.addEventListener('change', (e) => {
    checkboxes.forEach((cb) => {
      cb.checked = e.target.checked;
    });
  });

  const prod_type = document.getElementById("prod-type");

  prod_type.addEventListener('change', (e) => {
    const selected_option = e.target.value;

    if (selected_option === 'perishable') {
      // Show Perishable, Hide Bulk
      document.getElementById("perishable-fields").classList.remove('hidden');
      document.getElementById("bulk-fields").classList.add('hidden');

      // ⚡ CRITICAL FIX: Make expiry required, turn off bulk requirement
      document.getElementById("perishable-attribute").required = true;
      document.getElementById("bulk-attribute").required = false;
      document.getElementById("bulk-attribute").value = ''; // Clean old entries out

    } else if (selected_option === 'bulk') {
      // Hide Perishable, Show Bulk
      document.getElementById("perishable-fields").classList.add('hidden');
      document.getElementById("bulk-fields").classList.remove('hidden');

      // ⚡ CRITICAL FIX: Make bulk required, turn off expiry requirement
      document.getElementById("perishable-attribute").required = false;
      document.getElementById("perishable-attribute").value = ''; // Clean old entries out
      document.getElementById("bulk-attribute").required = true;

    } else {
      // Reset everything if blank option selected
      document.getElementById("perishable-fields").classList.add('hidden');
      document.getElementById("bulk-fields").classList.add('hidden');
      document.getElementById("perishable-attribute").required = false;
      document.getElementById("bulk-attribute").required = false;
    }
  })

  document.querySelector("#stock-form").addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      let product = null;
      if (document.getElementById('prod-type').value.toUpperCase() === 'PERISHABLE') {
        product = new PerishableItems(
          document.getElementById('prod-name').value,
          document.getElementById('prod-price').value,
          Math.round(Number(document.getElementById('prod-price').value || 0) * 100),
          document.getElementById('prod-type').value.toUpperCase(),
          document.getElementById('perishable-attribute').value
        );
      }
      if (document.getElementById('prod-type').value.toUpperCase() === 'BULK') {
        product = new BulkItems(
          document.getElementById('prod-name').value,
          document.getElementById('prod-price').value,
          Math.round(Number(document.getElementById('prod-price').value || 0) * 100),
          document.getElementById('prod-type').value.toUpperCase(),
          document.getElementById('bulk-attribute').value
        );
      }
      console.log(product);
      ItemManager.addProduct(product);
    } catch (error) {
      console.error(error);
    }
  });

  // Edit modal DOM elements
  const editOverlay = document.getElementById('edit-modal-overlay');
  const closeEditModalBtn = document.getElementById('btn-close-edit-modal');
  const editForm = document.getElementById('edit-stock-form');

  // Close Edit modal functions
  const closeEditModal = () => {
    editOverlay.classList.remove('open');
  };

  closeEditModalBtn.addEventListener('click', closeEditModal);
  editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) {
      closeEditModal();
    }
  });

  // Table Body Event Delegation (for edit / delete buttons)
  inventoryTableBody.addEventListener('click', (e) => {
    // 1. Edit Button Handler
    const editButton = e.target.closest('.btn-edit');
    if (editButton) {
      const productId = editButton.dataset.productId;
      const products = ItemManager.getAllProducts();
      const product = products.find(p => p.id === productId);

      if (product) {
        // Populate fields
        document.getElementById('edit-prod-id').value = product.id;
        document.getElementById('edit-prod-name').value = product.name;
        document.getElementById('edit-prod-price').value = (product.priceCents / 100).toFixed(2);
        document.getElementById('edit-prod-qty').value = product.quantity;

        // Subtype-specific fields
        if (product.productType.toUpperCase() === 'PERISHABLE') {
          document.getElementById('edit-prod-type').value = 'perishable';
          document.getElementById('edit-perishable-fields').classList.remove('hidden');
          document.getElementById('edit-bulk-fields').classList.add('hidden');

          if (product.expiryDate) {
            const dateObj = product.expiryDate instanceof Date ? product.expiryDate : new Date(product.expiryDate);
            document.getElementById('edit-perishable-attribute').value = dateObj.toISOString().split('T')[0];
          } else {
            document.getElementById('edit-perishable-attribute').value = '';
          }
          document.getElementById('edit-perishable-attribute').required = true;
          document.getElementById('edit-bulk-attribute').required = false;
        } else if (product.productType.toUpperCase() === 'BULK') {
          document.getElementById('edit-prod-type').value = 'bulk';
          document.getElementById('edit-bulk-fields').classList.remove('hidden');
          document.getElementById('edit-perishable-fields').classList.add('hidden');
          document.getElementById('edit-bulk-attribute').value = product.weightPerUnit;

          document.getElementById('edit-bulk-attribute').required = true;
          document.getElementById('edit-perishable-attribute').required = false;
        }

        // Open modal
        editOverlay.classList.add('open');
      }
      return;
    }

    // 2. Delete Button Handler
    const deleteButton = e.target.closest('.btn-delete');
    if (deleteButton) {
      const row = deleteButton.closest('tr');
      const productId = row.dataset.id;
      const products = ItemManager.getAllProducts();
      const product = products.find(p => p.id === productId);

      // Defensive guard clause
      if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
      }

      if (product.status === 'EXPIRED' || product.status === 'OUT OF STOCK') {
        if (confirm("Are you sure you want to delete this product?")) {
          try {
            ItemManager.deleteProduct(productId);
            displayProducts(); // refresh table
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        alert('Product still have stock left.');
      }
      return;
    }
  });

  // Edit Form Submit Handler
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const id = document.getElementById('edit-prod-id').value;
      const name = document.getElementById('edit-prod-name').value;
      const priceVal = document.getElementById('edit-prod-price').value;
      const priceCents = Math.round(Number(priceVal || 0) * 100);
      const quantity = Number(document.getElementById('edit-prod-qty').value);
      const subtype = document.getElementById('edit-prod-type').value;

      const updatedData = {
        name,
        priceCents,
        quantity
      };

      if (subtype === 'perishable') {
        const expiryDate = document.getElementById('edit-perishable-attribute').value;
        updatedData.expiryDate = expiryDate;
      } else if (subtype === 'bulk') {
        const weightPerUnit = Number(document.getElementById('edit-bulk-attribute').value);
        updatedData.weightPerUnit = weightPerUnit;
      }

      const success = ItemManager.updateProduct(id, updatedData);
      if (success) {
        displayProducts(); // Refresh layout
        closeEditModal(); // Close window
      } else {
        alert("Failed to update product details.");
      }
    } catch (error) {
      console.error(error);
    }
  });
  // end of the function
}



