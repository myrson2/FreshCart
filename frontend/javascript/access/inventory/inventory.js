import BulkItems from "../../model/BulkItems.js";
import PerishableItems from "../../model/PerishableItems.js";
import { displayAllProducts, displayBulkProducts, displayPerishableProducts, filterStatus, searchEngineRender } from "./display/displayProducts.js";

export function renderInventory(ItemManager) {
  const categoryFilter = document.getElementById('inventory-category-filter');
  const loadingOverlay = document.getElementById('table-loading-overlay');
  
  // Listener for Categories 
  displayAllProducts(ItemManager.getAllProducts());

  categoryFilter.addEventListener('change', (e) => {
    const category = e.target.value;
    console.log('Filtering by category...');
    setTimeout(() => {
      switch(category) {
        case 'PERISHABLE': displayPerishableProducts(ItemManager.getPerishableProducts()); break;
        case 'BULK': displayBulkProducts(ItemManager.getBulkProducts()); break;
        case 'ALL': displayAllProducts(ItemManager.getAllProducts()); break;
      }
      loadingOverlay.classList.add('hidden');
    }, 1500);
    loadingOverlay.classList.remove('hidden');
  });

  //Listener for Filter Status 
  const statusFilter = document.querySelector('.active-filters-row');

  statusFilter.addEventListener('change', (e) => {
    if (e.target.matches('.filter-radio-state')) {
        // Grab the ID of the newly selected filter option
        const activeFilterId = e.target;
        const status_val = activeFilterId.dataset.status;
        filterStatus(status_val);
    }
  });

  //Listener for Search Engine 
  document.querySelector('#inventory-search-styled').addEventListener('input', (e) => {
    const target = e.target.value;
    searchEngineRender(target);
  })

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

  function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color: var(--primary-emerald);"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    // Trigger slide-in transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Hide and remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3000);
  }

  document.querySelector("#stock-form").addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('commit-btn-stock');
    if (!submitBtn) return;
    
    const originalBtnHtml = submitBtn.innerHTML;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i> Committing...`;
    
    setTimeout(() => {
      try {
        const prodName = document.getElementById('prod-name').value;
        const prodPriceVal = document.getElementById('prod-price').value;
        const priceCents = Math.round(Number(prodPriceVal || 0) * 100);
        const qty = Number(document.getElementById('prod-qty').value || 0);
        const prodType = document.getElementById('prod-type').value.toUpperCase();
        
        let product = null;
        if (prodType === 'PERISHABLE') {
          product = new PerishableItems(
            null,
            prodName,
            priceCents,
            qty,
            prodType,
            document.getElementById('perishable-attribute').value
          );
        } else if (prodType === 'BULK') {
          product = new BulkItems(
            null,
            prodName,
            priceCents,
            qty,
            prodType,
            document.getElementById('bulk-attribute').value
          );
        }
        
        if (product) {
          console.log(product);
          ItemManager.addProduct(product);
          
          // Show toast notification
          showSuccessToast(`Stock committed successfully!`);
          
          // Re-render inventory immediately
          displayProducts();
          
          // Close the drawer overlay
          closeDrawer();
          
          // Reset form fields and validation requirements
          document.querySelector("#stock-form").reset();
          document.getElementById("perishable-fields").classList.add('hidden');
          document.getElementById("bulk-fields").classList.add('hidden');
          document.getElementById("perishable-attribute").required = false;
          document.getElementById("bulk-attribute").required = false;
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while saving the product.");
      } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }, 1500);
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
    
    const submitBtn = document.getElementById('edit-commit-btn-stock');
    if (!submitBtn) return;
    
    const originalBtnHtml = submitBtn.innerHTML;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i> Saving...`;
    
    setTimeout(() => {
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
          // Show toast notification
          showSuccessToast(`Product updated successfully!`);
          
          // Re-render inventory immediately
          displayProducts();
          
          // Close window
          closeEditModal();
        } else {
          alert("Failed to update product details.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while saving the product.");
      } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }, 1500);
  });

  // 
  
  
  // end of the function
}



