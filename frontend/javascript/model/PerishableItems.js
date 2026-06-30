import { Items } from './model/Items.js'
class BulkItems extends Items {
     constructor(id, image, name, priceCents, quantity, status, productType, expirationDate) {
        super(id, image, name, priceCents, quantity, status, productType);
        this.expirationDate = expirationDate;
     }

     isExpired() {
         // Get the exact moment right now
         const today = new Date();

         // Clear hours, minutes, seconds, and ms to compare pure calendar dates
         today.setHours(0, 0, 0, 0);
         
         // Compare raw millisecond timestamps directly
         return today.getTime() > this.expirationDate;
      }
}