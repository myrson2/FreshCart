export default class OrderItems {
    constructor(Items, quantity) {
        this.id = Items.id;
        this.quantity = quantity;
        this.subtotal = this.calculateSubtotal(Items);
    }

    calculateSubtotal(Items) {
        return Items.priceCents * this.quantity;
    }
}