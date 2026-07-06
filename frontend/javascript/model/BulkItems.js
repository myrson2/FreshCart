import Items from './Items.js';

export default class BulkItems extends Items {
    constructor(id, name, priceCents, quantity, productType, weightPerUnit) {
        super(id, name, priceCents, quantity, productType);
        this.weightPerUnit = weightPerUnit;
        this.status = this.updateStatus();
    }

    getFormattedWeight() {
        return this.quantity * this.weightPerUnit;
    }   

    updateStatus() {
        if (this.quantity <= 5) {
            if (this.quantity === 0){
                return 'OUT OF STOCK';
            }
           return 'WARNING';
        } 
        return 'ACTIVE';
    }
}