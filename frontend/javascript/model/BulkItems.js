import Items from './Items.js';

export default class BulkItems extends Items {
    constructor(id, image, name, priceCents, quantity, status, productType, weightPerUnit) {
        super(id, image, name, priceCents, quantity, status, productType);
        this.weightPerUnit = weightPerUnit;
    }

    getFormattedWeight() {
        return `${this.quantity * this.weightPerUnit} kg`;
    }
}