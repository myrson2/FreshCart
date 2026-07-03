import BulkItems from "../model/BulkItems.js";
import PerishableItems from "../model/PerishableItems.js";

//render all the products in the dashboard
const inventoryTableBody = document.getElementById('inventory-tbody-styled');

export function renderInventory(ItemManager) {

  //displaying products
  function displayProducts() {
    try {
      if (!inventoryTableBody) throw new Error('No Table Body Found.');
      const products = ItemManager.getAllProducts();

      products.forEach(prd => {
        console.log(prd);
        let tableRows;
        if(prd instanceof PerishableItems) {
           tableRows = `
            <tr data-id="${prd.id}">
              <td><input type="checkbox" class="product-checkbox"></td>
              <td>
                <div class="product-info-cell">
                  <span class="product-name-text">${prd.name}</span>
                </div>
              </td>
              <td class="text-mono product_type">${prd.productType}</td>
              <td><span class="category-badge">${prd.SKU}</span></td>
              <td>
                <div class="variant-info">
                  <span class="variant-count">${prd.expiryDate}</span>
                  <span class="variant-subtitle">Varies on: Expiration</span>
                </div>
              </td>
              <td class="text-mono price-cell">${(prd.priceCents / 100).toFixed(2)}</td>
              <td><span class="status-pill" data-status="${prd.status}">${prd.status}</span></td>
              <td data-quantity="${prd.quantity}"> ${prd.quantity}</td>
              <td class="action-cell"><button class="btn-table-action"><i class="bi bi-three-dots"></i></button></td>
              </tr>
          `
        } else if (prd instanceof BulkItems){
           tableRows = `
            <tr data-id="${prd.id}">
              <td><input type="checkbox" class="product-checkbox"></td>
              <td>
                <div class="product-info-cell">
                  <span class="product-name-text">${prd.name}</span>
                </div>
              </td>
              <td class="text-mono product_type">${prd.productType}</td>
              <td><span class="category-badge">${prd.SKU}</span></td>
              <td>
                <div class="variant-info">
                  <span class="variant-count">${prd.weightPerUnit} kg</span>
                  <span class="variant-subtitle">Varies on: Weight</span>
                </div>
              </td>
              <td class="text-mono price-cell">${(prd.priceCents * .1).toFixed(2)}</td>
              <td><span class="status-pill" data-status="${prd.status}">${prd.status}</span></td>
              <td data-quantity="${prd.quantity}"> ${prd.quantity}</td>
              <td class="action-cell"><button class="btn-table-action"><i class="bi bi-three-dots"></i></button></td>
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
  const card = document.getElementById('product-drawer-card');

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

  document.querySelector("#commit-btn-stock").addEventListener('click', (e) => {
      if(prod_type.value === 'perishable'){
        const perishableItems = new PerishableItems();
      } else {

      }
  })
}

