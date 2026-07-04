import Items from './Items.js';

export default class BulkItems extends Items {
    constructor(name, priceCents, quantity, productType, weightPerUnit) {
        super(name, priceCents, quantity, productType);
        this.weightPerUnit = weightPerUnit;
    }

    getFormattedWeight() {
        return this.quantity * this.weightPerUnit;
    }   
}