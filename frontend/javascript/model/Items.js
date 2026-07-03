export default class Items {
    constructor(name, priceCents, quantity, status, productType) {
        this.id = crypto.randomUUID();
        this.SKU = `PRD-${Math.floor(100 + Math.random() * 900)}`;
        this.name = name;
        this.priceCents = priceCents;
        this.quantity = quantity;
        this.status = status;
        this.productType = productType;
    }

    updateStock(amount){
       try {
            if(amount === 0) throw new Error(`Amount cant be 0`);

            if(amount < 0) {
                return this.quantity -= Math.abs(amount);
            } else {
                return this.quantity += amount;
            }
       } catch (error) {
            return `[Error]: ${error}`;
       }
    }
}



