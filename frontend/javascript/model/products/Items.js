export default class Items {
    constructor(id, name, priceCents, quantity, productType) {
        this.id = id ? id : `PRD-${Math.floor(1000 + Math.random() * 9000)}`;
        this.name = name;
        this.priceCents = priceCents;
        this.quantity = quantity;
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



