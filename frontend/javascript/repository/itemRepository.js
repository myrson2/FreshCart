import BulkItems from "../model/BulkItems.js";
import PerishableItems from "../model/PerishableItems.js";

export default class ItemRepository {
    constructor(storageKey = 'inventory', jsonUrl = './data/json/products.json') {
        this.storageKey = storageKey;
        this.jsonUrl = jsonUrl;
        this.products = [];
    }

    /**
     * Initializes the repository by loading from localStorage.
     * If localStorage is empty, fetches from products.json and populates localStorage.
     */
    async init() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                console.log('Entered in init()..')
                this.products = JSON.parse(stored);
                return;
            } catch (e) {
                console.error("Failed to parse stored inventory, refetching...", e);
            }
        }

        // Fetch initial data
        try {
            const response = await fetch(this.jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            let items = null;
            products.forEach(product => {
                if(product.productType === 'PERISHABLE') {
                    items = new PerishableItems(
                        product.name,
                        product.priceCents,
                        product.quantity,
                        product.status,
                        product.productType,
                        product.expirationDate
                    );
                } else if (product.productType === 'BULK') {
                    items = new BulkItems(
                        product.name,
                        product.priceCents,
                        product.quantity,
                        product.status,
                        product.productType,
                        product.weightPerUnit
                    );
                }
                this.saveRawProducts(items);
            });
        } catch (error) {
            console.error("Failed to fetch initial products:", error);
            this.products = [];
        }
    }

    getRawProducts() {
        return this.products;
    }

    saveRawProducts(products) {
        this.products.push(products);
        localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    }
}
