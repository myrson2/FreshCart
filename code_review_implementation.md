# Plain English Implementation Guide: What Needs to be Fixed
This guide breaks down the issues in the codebase in simple terms, explaining **what** is broken, **why** it is happening, and **how** to think about fixing it.

---

## 💥 1. The Crashes (Things that stop the code from running)

### A. The "Missing Function" Crash
* **What is broken:** When you submit a form or try to delete an item, the page crashes with a message saying `displayProducts is not defined`.
* **Why it happens:** In [inventory.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/inventory.js), you call `displayProducts()`. However, at the top of the file, you only imported three specific functions: `displayAllProducts`, `displayPerishableProducts`, and `displayBulkProducts`. The browser cannot run a function that was never declared or imported.
* **How to think about the fix:** Instead of calling a non-existent `displayProducts()` function, you should decide which of the *actual* imported functions (like `displayAllProducts`) is the right one to call to refresh the table after a product is added or edited.

### B. The "Hidden Variable" Crash
* **What is broken:** As soon as the inventory page loads, the script crashes, saying `inventoryTableBody is not defined`.
* **Why it happens:** In JavaScript modules, files cannot see each other's variables by default. You created the variable `inventoryTableBody` inside [displayProducts.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/display/displayProducts.js) but did not export it. Because of this, [inventory.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/inventory.js) has no idea what `inventoryTableBody` is when it tries to attach a click listener to it.
* **How to think about the fix:** You have two options:
  1. Add `export` to `inventoryTableBody` in [displayProducts.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/display/displayProducts.js) and `import` it in [inventory.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/inventory.js).
  2. Simply recreate the reference in [inventory.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/inventory.js) by using `document.getElementById('inventory-tbody-styled')` inside that file.

---

## 🔍 2. The Logic Bugs (Things that run but behave incorrectly)

### A. The "Copycat Products" Bug
* **What is broken:** The app might load duplicate products when it first reads the catalog data.
* **Why it happens:** In [itemRepository.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/repository/itemRepository.js), you loop through the raw product catalog. If a product does not have `PERISHABLE` or `BULK` as its type (for example, if a product is clothing or has a typo), it skips your `if` blocks. But because you declared `let items = null` outside the loop, `items` still holds the product from the *previous* turn of the loop. That previous product gets pushed again!
* **How to think about the fix:** Declare the `items` variable *inside* the loop so it resets to `null` on every single turn. Then, check if `items` is not null before pushing it into your list.

### B. The "Text vs. Math" Bug
* **What is broken:** When you add a new bulk product, calculations like "quantity × weight" might fail or give weird results.
* **Why it happens:** In [inventory.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/access/inventory/inventory.js), when creating a new bulk item, you read the weight field directly from the screen. In web browsers, values read from HTML forms are always text (Strings), even if they look like numbers. Storing a text string (like `"1.5"`) inside your product data instead of a real number (like `1.5`) breaks math calculations.
* **How to think about the fix:** When retrieving the value of the weight input for a new product, wrap it in a function that converts text to numbers, such as `Number()`.

---

## 📐 3. The Architecture Gaps (Things that don't follow the plan)

### A. Bypassing the OOP Models
* **What is broken:** You built rich class blueprints (like `Items`, `BulkItems`, and `PerishableItems`) with specialized logic, but they are not actually being used to modify data.
* **Why it matters:** In [ItemManager.js](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/javascript/service/ItemManager.js), the code directly edits the raw values inside the arrays. This means the model classes are just used for drawing the table, while the actual data updates skip the class rules (like auto-updating status).
* **How to think about the fix:** Instead of updating the raw objects directly in the manager, the manager should fetch the rich OOP instances, call methods on those instances (like `productInstance.updateStock(amount)`), and then tell the repository to save the updated objects.

### B. The Static Orders and Map
* **What is broken:** The Order page, the KPIs on the Dashboard, and the Logistics Map look like they are working, but they are actually hardcoded HTML/CSS. If you add or change an order, nothing updates in the database.
* **Why it matters:** The PRD requires a "closed-loop" system where dispatching or cancelling orders directly alters the stock levels in the warehouse. 
* **How to think about the fix:** You need to implement the `Order` class (with properties like `orderId`, `items`, and a dynamic price calculation) and use it to manage orders in JavaScript, replacing the static mock script in [order.html](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/order.html).
