# 🗺️ Feature 1: Single-Page Architecture & OOP Core Models

Welcome to the first phase of building **LogiCart**! 

Before we write UI logic, we must establish a solid architectural foundation. This guide will help you build the single-page application structure and the core Object-Oriented Programming (OOP) data layer.

---

## 🔍 The Problem This Solves

1. **State Desynchronization across Page Reloads:** In the boilerplate, navigating between `dashboard.html`, `inventory.html`, and `order.html` reloads the page. This destroys all in-memory JavaScript variables. By consolidating these views into a Single-Page Application (SPA) controlled by CSS, we keep the JS execution context alive, letting our core data models act as the single source of truth.
2. **Pricing & Floating-Point Calculation Errors:** Standard float math in JavaScript (e.g., `0.1 + 0.2 === 0.30000000000000004`) causes critical billing discrepancies. By enforcing centavos-only (integer) calculations at the model layer, we eliminate rounding bugs before they touch the screen.
3. **Data Type Ambiguity:** Products have different behaviors (e.g., milk expires; potatoes are sold in bulk kg). Standard plain JSON objects don't know how to validate or format themselves. Polymorphic ES6 classes allow different product types to expose unique methods (like `isExpired()`) while sharing a common interface.

---

## 🛠️ Step 1: Consolidate the SPA Layout

Your first task is to merge the HTML views into a single file so that view navigation doesn't reload the page.

### 📝 Instructions
1. Open [frontend/index.html](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/index.html) (which is currently a redirect page) or create a consolidated copy.
2. Structure the body of your main unified file to contain all three section views within `.view-container`:
   - `#view-dashboard` (from `dashboard.html`)
   - `#view-inventory` (from `inventory.html`)
   - `#view-order` (from `order.html`)
3. Make sure the hidden radio buttons remain at the top of the body:
   ```html
   <input type="radio" name="app-tab" id="tab-dashboard" class="tab-radio-state" checked style="display: none;">
   <input type="radio" name="app-tab" id="tab-inventory" class="tab-radio-state" style="display: none;">
   <input type="radio" name="app-tab" id="tab-order" class="tab-radio-state" style="display: none;">
   ```
4. **The Navigation Switch:** In the sidebar navigation menu, replace the anchor links (`<a>`) with label elements pointing to the hidden inputs.
   - *Abstract Pattern:*
     ```html
     <!-- Instead of: <a href="dashboard.html"> -->
     <label for="tab-id" class="menu-item">
       <i class="bi bi-some-icon"></i>
       <span>View Name</span>
     </label>
     ```
5. Test clicking the sidebar navigation. Check if the views show and hide seamlessly. If style transitions fail, inspect the selector rules in `styles/style.css` matching `#tab-dashboard:checked ~ .app-layout ...`.

---

## 📦 Step 2: Develop the ES6 OOP Models & Casing

Instead of putting all classes in one file, construct modular ES6 classes inside separate files under `frontend/javascript/model/`:
* `Items.js` (Base class)
* `PerishableItems.js` (Extends `Items`)
* `BulkItems.js` (Extends `Items`)

### 📐 Class Blueprints to Design

#### 1. Base Class: `Items` (in `model/Items.js`)
Stores general metadata for warehouse catalog items.
- **Properties (Constructor):**
  - `id` (String)
  - `image` (String)
  - `name` (String)
  - `priceCents` (Number - integer representation of money in centavos)
  - `quantity` (Number)
  - `status` (String)
  - `productType` (String - `"STANDARD"`, `"PERISHABLE"`, or `"BULK"`)
- **Methods:**
  - `updateStock(amount)`: Mutates `quantity` by adding/subtracting the amount. Ensure it doesn't drop below zero.

#### 2. Subclass: `PerishableItems` (in `model/PerishableItems.js`)
Introduces shelf-life logic for fresh stock.
- **Properties:**
  - Inherited base properties.
  - `expiryDate` (Date Object - parsed from an ISO string).
- **Methods:**
  - `isExpired()`: Compares current system date/time with the `expiryDate`. Returns a boolean.

#### 3. Subclass: `BulkItems` (in `model/BulkItems.js`)
Optimized for weight-based produce (packaged by weight, price per pack/unit).
- **Properties:**
  - Inherited base properties.
  - `weightPerUnit` (Number - representing kilograms per unit).
- **Methods:**
  - Create a custom getter or display method to output stock formatted in kilograms (e.g., quantity * weightPerUnit + " kg").

---

## 🗄️ Step 3: Implement the Repository and Service Layers

To organize state and support local persistence, establish a clean separation of concerns:

### 1. Data Repository Layer (`frontend/javascript/repository/itemRepository.js`)
Handles raw data access and browser persistence via `localStorage`.
- **Responsibilities:**
  - Initialize the repository: Load existing raw products from `localStorage`. If `localStorage` is empty, fetch the initial data from `./data/json/products.json`, save it to `localStorage`, and load it into memory.
  - Maintain an in-memory array of raw product records.
  - Expose accessors:
    - `getRawProducts()`: Returns the list of raw objects.
    - `saveRawProducts(products)`: Saves the updated array of raw objects back to `localStorage`.

### 2. Business Service Layer (`frontend/javascript/service/ItemManager.js`)
Orchestrates operations, converts raw objects into instances of our OOP models, and executes inventory actions.
- **Responsibilities:**
  - `getAllProducts()`: Calls the repository to get raw products and maps them into rich OOP instances (`Items`, `PerishableItems`, or `BulkItems`) depending on their type.
  - `getLowStockAlerts()`: Filters and returns OOP product instances where `quantity < 5`.
  - `addProduct(productData)`: Validates input, constructs a new raw object, adds it to the repository, and triggers a save.
  - `updateStock(id, amount)`: Modifies the stock level of a product (ensuring it doesn't fall below zero) and saves.
  - `deleteProduct(id)`: Removes a product from the collection and saves.

---

## 🧪 Step 4: Hydrate & Verify (Console Check)

Before building any HTML UI templates, verify that your Repository and Service layers work together in memory.

1. Ensure your access entry script (e.g., `frontend/javascript/access/dashboard.js` or `frontend/javascript/app.js`) is imported as a module in HTML.
2. In your entry script, call your `ItemManager` methods to test:
   - Does it load initial products from `products.json` on first run?
   - If you add or modify a product, does it persist in `localStorage` across page refreshes?
   - Are the returned products correctly converted to `PerishableItems` or `BulkItems` instances so you can call their respective methods (like `isExpired()`)?

---

## 🙋 Socratic Prompts to Keep in Mind

As you write this code, ask yourself:
* **OOP Hydration:** When rebuilding class instances from raw local storage objects, how will you ensure that date strings are correctly converted back into JavaScript `Date` objects?
* **Single Source of Truth:** If multiple UI views display the same products, how will you ensure they all pull from a single instance of `ItemManager` rather than creating multiple separate catalogs?
* **Local Storage Safety:** How will your repository handle potential JSON parsing errors if the user's `localStorage` data becomes corrupted?
