# 📄 Product Requirement Document (PRD)

## Project Details
* **Project Title:** LogiCart: Real-Time Operations Dashboard
* **Client:** FreshCart Grocery Logistics
* **Architecture:** Pure Vanilla HTML5, CSS3, and ES6 JavaScript (OOP Modules)

---

## 1. Core Problem Statement

> **FreshCart Grocery Logistics** is a local grocery delivery service handling three distinct product types: fresh perishable items, packaged goods, and bulk produce (sold by weight). Because the business has scaled up quickly while relying on manual workflows (paper logs and chat groups), operations have completely broken down, causing three critical issues:
> 
> 1. **Inventory Chaos:** Perishable goods expire unnoticed on shelves, and bulk items are calculated poorly, causing stock totals to become highly inaccurate.
> 2. **Pricing Errors:** Revenue, bulk weight discounts, and delivery fees are calculated by hand, leading to constant invoicing mistakes.
> 3. **Logistics Bottlenecks:** Delivery dispatchers and drivers have no spatial or visual awareness of where active orders are located or if severe weather hazards will delay transport, slowing down the entire fulfillment chain.

### The Developer's Goal
Your goal is to eliminate these manual operational breakdowns by engineering **"LogiCart"**—a digital, single-page administrative dashboard built with pure HTML, CSS, and Vanilla JavaScript OOP. Your software must handle data through a **closed loop**: actions taken on the logistics tracking map must directly communicate with, update, and automate the warehouse inventory state in real-time.

---

## 2. System Architecture & Closed-Loop State Flow

Your data must flow in a reactive loop. Actions on the UI components must mutate your JavaScript Class instances, which then trigger updates back across the dashboard metrics.

+──────────────────────────┐     Updates Status    +────────────────────────┐
│   Leaflet.js Map Pin     ├──────────────────────►│      Order Instance    │
│  (Delivered / Cancelled) │                       │  (Getter: totalPrice)  │
+──────────────────────────┘                       +───────────┬────────────+
│
If Cancelled, Re-stocks │
▼
+──────────────────────────┐     Manages Subtypes  +────────────────────────┐
│  Dashboard Analytics KPI │◄──────────────────────┤    InventoryManager    │
│    & Real-Time Alerts    │   Pushes Fresh State  │(Product/Perishable/Bulk)
+──────────────────────────┘                       +────────────────────────+


---

## 3. Minimum Viable Product (MVP) Technical Specifications

### Part A: The JavaScript OOP Core (Data Layer)
Your application logic must be isolated within strict ES6 Classes. Do not store data in global, un-encapsulated arrays.

#### 1. Class: `Product` (Base Model)
* **Properties:** `id` (String), `name` (String), `priceCents` (Number), `quantity` (Number), `status` (String).
* **Methods:** `updateStock(amount)`: Adds or subtracts inventory totals safely.

#### 2. Class: `PerishableProduct` (Extends `Product`)
* **Properties:** All base properties + `expiryDate` (Date Object).
* **Methods:** `isExpired()`: Compares current system time with `expiryDate`. Returns `true`/`false`.

#### 3. Class: `BulkProduct` (Extends `Product`)
* **Properties:** All base properties + `weightPerUnit` (Number, representing kg per pack).
* **Methods:** Custom stock string representation or methods to aggregate mass calculations.

#### 4. Class: `Order`
* **Properties:** `orderId` (String), `items` (Array of objects containing product reference and selected quantity), `status` (String: `"Pending"`, `"Dispatched"`, `"Delivered"`, or `"Cancelled"`), `coordinates` (Object: `{lat, lng}`).
* **Methods:** `get totalPrice()`: Dynamic getter calculating combined base item prices + a flat weight-based shipping surcharge.

#### 5. Class: `InventoryManager`
* **Properties:** `products` (Array of instances).
* **Methods:** `addProduct(product)`, `getProduct(id)`, `removeStock(id, qty)`, `getLowStockAlerts()` (finds items with stock < 5).

---

## 4. Expected Features & UI Modules

### 📈 1. Main Analytics Dashboard (The KPI Bar)
A header interface showing live, reactive calculations aggregated directly from your Object States:
* **Total Enterprise Earnings:** Sum of `totalPrice` from all orders with `status === "Delivered"`.
* **Active Dispatches:** Active tally of orders currently marked `"Pending"` or `"Dispatched"`.
* **Low Stock Warning Tally:** Number of unique items currently displaying stock shortages or expiration warnings.

### 📦 2. Real-Time Inventory Table
* Displays all current items inside `InventoryManager`.
* **Polymorphic Badges:** * If quantity < 5, display a **Yellow "LOW STOCK"** badge.
  * If a `PerishableProduct` returns `isExpired() === true`, dim the row and display a **Red "EXPIRED"** badge.
  * Bulk products must dynamically format their numbers to display mass variables (e.g., `10.5 kg`).

### 🗺️ 3. Interactive Dispatch Map (Leaflet.js & API Integration)
* **Map Rendering:** Embed an open map container using Leaflet.js.
* **Marker Distribution:** Instantiating a new order places a coordinate marker onto the map.
* **The Closed-Loop Trigger:** Inside the map pin popup (or adjacent order card), provide state toggle buttons:
  * Clicking **`Delivered`** changes the marker color to Green and shifts the order's financial value into the main dashboard's Total Earnings KPI.
  * Clicking **`Cancelled`** triggers an automatic restock routine, executing `InventoryManager.updateStock()` to return those specific items back into warehouse inventory.
* **Asynchronous Integration:** Connect to an external API (e.g., a free Weather API) to render a dynamic warning alert (e.g., ⚠️ *Delivery Delay: Severe Storms Active*) inside the map UI if bad weather hits that location.

### 🔔 4. Operational Alerts Feed
A live text log module recording timeline operations dynamically:
* `[14:15] System: Order #1004 created successfully for FreshCart.`
* `[14:16] ⚠️ Warning: Stock for Item 'Whole Milk' dropped below 5 units.`
* `[14:18] 🔄 Restock: Order #1004 Cancelled. 2 units returned to inventory.`

---

## 5. Portfolio Presentation Guideline

To highlight this as a high-quality portfolio piece, structure your project files cleanly into modular ES6 files using JS modules:
* `index.html` (The layout canvas)
* `style.css` (The semantic layout rules using Plus Jakarta Sans and Roboto Mono)
* `/js/models.js` (The Object Blueprints)
* `/js/app.js` (The Event Controller connecting user actions to OOP calculations)