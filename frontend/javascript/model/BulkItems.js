import Items from './Items.js';

export default class BulkItems extends Items {
    constructor(name, priceCents, quantity, status, productType, weightPerUnit) {
        super(name, priceCents, quantity, status, productType);
        this.weightPerUnit = weightPerUnit;
    }

    getFormattedWeight() {
        return this.quantity * this.weightPerUnit;
    }   
}