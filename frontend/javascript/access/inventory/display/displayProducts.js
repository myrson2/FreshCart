import PerishableItems from "../../../model/PerishableItems.js";
import BulkItems from "../../../model/BulkItems.js";

//render all the products in the dashboard
const inventoryTableBody = document.getElementById("inventory-tbody-styled");

let current_category = [];
let flag_category = 'ALL';

//displaying products
export const displayAllProducts = (allProducts) => {
  current_category = allProducts; 
  flag_category = 'ALL'
  renderInventory(current_category);
}

export const displayPerishableProducts = (perishableItems) => {
  current_category = perishableItems;
  flag_category = 'PERISHABLE';
  renderInventory(current_category);
}

export const displayBulkProducts = (bulkItems) => {
    current_category = bulkItems;
    flag_category = 'BULK';
    renderInventory(current_category);
}

const renderInventory = (products) => {
  // Clear old rows safely
    inventoryTableBody.innerHTML = "";

    // If empty, render a clean empty-state layout row
    if (!products || products.length === 0) {
        inventoryTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No products found matching this criteria.</td></tr>`;
        return;
    }

    products.forEach(prd => {
      // 1. 🎯 Dynamic Variable Column: Handle only what makes them different
      let variantColumnHtml = "";

      if (prd instanceof PerishableItems) {
          // Safe check: If expiryDate is a string, wrap it into a Date object first before formatting
          const expiry = prd.expiryDate instanceof Date ? prd.expiryDate : new Date(prd.expiryDate);
          const formattedDate = !isNaN(expiry) ? expiry.toLocaleDateString() : "N/A";

          variantColumnHtml = `
              <div class="variant-info">
                <span class="variant-count">${formattedDate}</span>
                <span class="variant-subtitle">Varies on: Expiration</span>
              </div>
          `;
      } else if (prd instanceof BulkItems) {
          variantColumnHtml = `
              <div class="variant-info">
                <span class="variant-count">${prd.weightPerUnit} kg</span>
                <span class="variant-subtitle">Varies on: Weight</span>
              </div>
          `;
      } else {
          // Fallback catch-all case for base Items
          variantColumnHtml = `<span class="text-muted">—</span>`;
      }

      // 2. 🧱 Unified Structural Layout: Write this exactly ONCE
      const rowHTML = `
          <tr data-id="${prd.id}">
            <td><input type="checkbox" class="product-checkbox"></td>
            <td><span class="category-badge">${prd.id}</span></td>
            <td>
              <div class="product-info-cell">
                <span class="product-name-text">${prd.name}</span>
              </div>
            </td>
            <td class="text-mono product_type">${prd.productType}</td>
            
            <td>${variantColumnHtml}</td>
            
            <td class="text-mono price-cell">${(prd.priceCents / 100).toFixed(2)}</td>
            <td><span class="status-pill" data-status="${prd.status}">${prd.status}</span></td>
            <td data-quantity="${prd.quantity}">${prd.quantity}</td>
            <td class="action-cell">
              <div class="action-buttons-wrapper">
                <button class="btn-table-action btn-edit" title="Edit" data-product-id="${prd.id}"><i class="bi bi-pencil"></i></button>
                <button class="btn-table-action btn-delete" title="Delete"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>
      `;

      // 3. Render directly to the DOM interface container
      inventoryTableBody.insertAdjacentHTML("beforeend", rowHTML);
  });
}

export const filterStatus = (status) => {
  if(current_category === null) return;
  
  let filtered = status === 'ALL' 
  ? current_category 
  : current_category.filter(p => p.status === status);

  renderInventory(filtered);
}

export const searchEngineRender = (inputs) => {
  const filteredByInput = current_category.filter(products =>
  products.name.toLowerCase().includes(inputs.toLowerCase()));
  renderInventory(filteredByInput)
}
