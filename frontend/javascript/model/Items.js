export default class Items {
    constructor(id, image, name, priceCents, quantity, status, productType) {
        this.id = id;
        this.image = image;
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
            return error;
       }
    }
}



