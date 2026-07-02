//render all the products in the dashboard
const inventoryTableBody = document.getElementById('inventory-tbody-styled');

export function renderInventory(ItemManager) {

  //displaying products
  function displayProducts() {
    try {
      if (!inventoryTableBody) throw new Error('No Table Body Found.');
      const products = ItemManager.getItemRepository().getRawProducts();

      products.forEach(prd => {
        let tableRows;
        if(prd.productType.trim() === 'PERISHABLE') {
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
                  <span class="variant-count">${prd.expirationDate} kg</span>
                  <span class="variant-subtitle">Varies on: Expiration</span>
                </div>
              </td>
              <td class="text-mono price-cell">${(prd.priceCents * .1).toFixed(2)}</td>
              <td><span class="status-pill" data-status="${prd.status}">${prd.status}</span></td>
              <td data-quantity="${prd.quantity}"> ${prd.quantity}</td>
              <td class="action-cell"><button class="btn-table-action"><i class="bi bi-three-dots"></i></button></td>
              </tr>
          `
        } else {
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
    overlay.classList.add('open');
  });

  const closeDrawer = () => {
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

}

