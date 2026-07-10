import PerishableItems from "../../../model/PerishableItems.js";
import BulkItems from "../../../model/BulkItems.js";

export const addProduct = (ItemManager) => {
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

        console.log(product);

        ItemManager.addProduct(product);
    } catch (error) {
        throw error;
    }
}

export const updateProduct = (ItemManager) => {
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

    return success;
}

// 

