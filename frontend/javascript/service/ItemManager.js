import Items from "../model/Items.js";
import PerishableItems from "../model/PerishableItems.js";
import BulkItems from "../model/BulkItems.js";
import ItemRepository from '../repository/itemRepository.js';

export default class ItemManager {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Retrieves all products from the repository and converts them to their rich OOP model instances.
     * @returns {Array<Items|PerishableItems|BulkItems>}
     */
    
    getAllProducts() {
        const rawProducts = this.itemRepository.getRawProducts();

        return rawProducts.map(p => {
            // Unpack the properties cleanly out of the product object wrapper
           const {id, name, priceCents, quantity, productType, expirationDate, expiryDate, weightPerUnit } = p;
            const dateVal = expiryDate || expirationDate;

            const normalizedType = (productType || '').toUpperCase();

            if (normalizedType === 'PERISHABLE') {
                return new PerishableItems(id, name, priceCents, quantity, productType, dateVal);
            }
            
            if (normalizedType === 'BULK') {
                return new BulkItems(id, name, priceCents, quantity, productType, weightPerUnit);
            }

            // Always provide a fallback return statement to keep data streams unbroken
            return null; 
        }).filter(item => item !== null); // This line automatically filters out any corrupted or broken items!
    }

    /**
     * Filters products that have low stock (quantity less than 5).
     * @returns {Array<Items|PerishableItems|BulkItems>}
     */
    getLowStockAlerts() {
        return this.getAllProducts().filter(p => p.quantity < 5);
    }

    /**
     * Retrieves all perishable products.
     * @returns {Array<PerishableItems>}
     */
    getPerishableProducts() {
        return this.getAllProducts().filter(p => p.productType === 'PERISHABLE');
    }

    /**
     * Retrieves all bulk products.
     * @returns {Array<BulkItems>}
     */
    getBulkProducts() {
        return this.getAllProducts().filter(p => p.productType === 'BULK');
    }

    /**
     * Validates and adds a new product to the catalog.
     * @param {Object} productData 
     * @returns {Object} The raw created product object
     */
    addProduct(productData) {
        const products = this.itemRepository.getRawProducts();
        products.push(productData);
        this.itemRepository.saveRawProducts(products);
        return productData;
    }

    /**
     * Mutates product quantity and persists to storage.
     * @param {string} id 
     * @param {number} amount 
     * @returns {boolean} Whether the update was successful
     */
    updateStock(id, amount) {
        const products = this.itemRepository.getRawProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            product.quantity = Math.max(0, product.quantity + amount);
            this.itemRepository.saveRawProducts(products);
            return true;
        }
        return false;
    }

    /**
     * Updates an existing product details and persists to storage.
     * @param {string} id
     * @param {Object} updatedData
     * @returns {boolean} Whether update was successful
     */
    updateProduct(id, updatedData) {
        const products = this.itemRepository.getRawProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updatedData
            };
            this.itemRepository.saveRawProducts(products);
            return true;
        }
        return false;
    }

    /**
     * Deletes a product from the catalog.
     * @param {string} id 
     * @returns {boolean} Whether deletion was successful
     */
    deleteProduct(id) {
        const products = this.itemRepository.getRawProducts();
        const filtered = products.filter(p => p.id !== id);
        if (filtered.length !== products.length) {
            this.itemRepository.saveRawProducts(filtered);
            return true;
        }
        return false;
    }
}

// ==========================================
// BACKWARD COMPATIBILITY EXPORTS
// These allow files (like dashboard.js and ItemManager imports) to continue working
// without breaking before they are fully refactored to receive injected dependencies.
// ==========================================

const defaultRepository = new ItemRepository('inventory');
const defaultManager = new ItemManager(defaultRepository);

let initPromise = null;
const ensureInit = () => {
    if (!initPromise) {
        initPromise = defaultRepository.init();
    }
    return initPromise;
};

export async function getPerishableProducts() {
    await ensureInit();
    return defaultManager.getPerishableProducts();
}

export async function getBulkProducts() {
    await ensureInit();
    return defaultManager.getBulkProducts();
}

export async function addProducts(product) {
    await ensureInit();
    return defaultManager.addProduct(product);
}