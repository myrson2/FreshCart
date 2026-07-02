import Items from './Items.js';

export default class PerishableItems extends Items {
    constructor(id, image, name, priceCents, quantity, status, productType, expiryDate) {
        super(id, image, name, priceCents, quantity, status, productType);
        this.expiryDate = new Date(expiryDate);
    }

    isExpired() {
        const today = new Date();
        return today > this.expiryDate;
    }
}