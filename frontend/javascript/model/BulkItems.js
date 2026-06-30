import { Items } from './model/Items.js'
class BulkItems extends Items {
     constructor(id, image, name, priceCents, quantity, status, productType, weightPerUnit) {
        super(id, image, name, priceCents, quantity, status, productType);
        this.weightPerUnit = weightPerUnit;
     }

     totalWeight() {
         return this.weightPerUnit * quantity
     }
}