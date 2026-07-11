export default class Order {
    constructor(orderID, status) {
        this.orderID = orderID;
        this.status = status;
        this.orderItems = []; //Collection of OrderItems
        this.total = 0;
        this.timestamp = new Date();
    }

    calculateTotal() {
        let total = 0;
        for(const prices of this.orderItems) {
            total += prices.subtotal;
        }
        return total;
    }
}