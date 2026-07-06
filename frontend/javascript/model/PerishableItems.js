import Items from './Items.js';

export default class PerishableItems extends Items {
    constructor(id, name, priceCents, quantity, productType, expiryDate) {
        super(id, name, priceCents, quantity, productType);
        this.expiryDate = new Date(expiryDate);
        this.status = this.updateStatus();
    }

    isExpired() {
        const today = new Date();
        return today > this.expiryDate;
    }
    
    updateStatus() {
        if(this.isExpired()) return 'EXPIRED';
        
        if (this.quantity <= 5) {
            if (this.quantity === 0){
                return 'OUT OF STOCK';
            }
           return 'WARNING';
        } 
        return 'ACTIVE';
    }
}