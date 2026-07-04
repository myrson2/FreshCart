import Items from './Items.js';

export default class PerishableItems extends Items {
    constructor(name, priceCents, quantity, productType, expiryDate) {
        super(name, priceCents, quantity, productType);
        this.expiryDate = new Date(expiryDate);
    }

    isExpired() {
        const today = new Date();
        return today > this.expiryDate;
    }
}