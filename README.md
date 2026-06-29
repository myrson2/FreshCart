# FreshCart - Warehouse & Logistics Control Center

FreshCart is a modern, responsive, and lightweight Operations Dashboard boilerplate designed for warehouse and cargo dispatch management. 

This project is built using a **pure HTML and CSS architecture**, featuring complex interactive behaviors (like view switching and dark mode toggling) entirely without JavaScript.

---

## 🚀 Key Features

- **CSS-Only View Navigation**: Toggle between the **Dashboard**, **Inventory**, and **Order Dispatch** screens instantly using CSS radio selectors.
- **CSS-Only Theme Toggling**: Switch between Light and Dark modes seamlessly via modern CSS `:has()` parent selectors.
- **Sleek Logistics Map View**: Interactive-looking routes, central Quezon City (QC) warehouse hub, and dispatch nodes rendered dynamically using responsive SVG paths and keyframe pulse animations.
- **Telemetry & Logs Console**: Standard mock logger mimicking live warehouse sync events and warnings.
- **Stock Warnings & Status Alerts**: Prominent indicators showcasing critical warnings (expired inventory, low supplies).
- **Responsive Layout**: Tailges stylesheets with media query breakpoints supporting desktops, tablets, and mobile devices.

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 structures.
- **Styling**: Vanilla CSS3 (Custom design system with CSS design tokens, HSL variables, transitions, and keyframe animations).
- **Icons**: [Bootstrap Icons](https://icons.getbootstrap.com/) (fully CSS-driven).
- **Visualization**: Embedded SVG graphics for maps and product categorizations.

---

## 📁 Repository Structure

```text
FreshCart/
├── .agents/
│   └── AGENTS.md        # Workspace rules for AI collaboration
├── .antigravity/
│   └── RULES.md         # Sprint development guidelines
├── frontend/
│   ├── index.html       # Automated redirect page to dashboard
│   ├── dashboard.html   # Main Dashboard content screen
│   ├── inventory.html   # Product Catalog & Add/Restock controls
│   ├── order.html       # Dispatch engine forms & dispatch queue stream
│   └── styles/
│       └── style.css    # Full application stylesheet & theme configurations
├── agents.md            # Mirror of agent-specific rules
├── RULES.md             # Developer rules checklist
└── README.md            # Project overview & documentation (this file)
```

---

## ⚙️ CSS-Only Interactive Mechanics

This boilerplate implements interactive components without client-side scripts:

### 1. View Switcher
Hidden radio inputs controls tab activation:
```html
<input type="radio" name="app-tab" id="tab-dashboard" checked style="display: none;">
<input type="radio" name="app-tab" id="tab-inventory" style="display: none;">
```
Using the sibling selector `~`, CSS displays only the selected section:
```css
#tab-dashboard:checked ~ .app-layout #view-dashboard {
  display: block;
}
```

### 2. Theme Toggler
A hidden checkbox input at the top of the body tracks dark mode state:
```html
<input type="checkbox" id="theme-toggle" style="display: none;">
```
Using the `:has()` pseudo-class, the stylesheet applies the dark-mode token variables:
```css
body:has(#theme-toggle:checked) {
  --canvas-bg: #090d16;
  --surface-bg: #111b2d;
  /* ... rest of dark mode variables ... */
}
```

---

## 💻 Running Locally

Since this dashboard does not require frameworks, databases, or build steps, you can open and run it directly in any modern browser:

1. Clone or download this repository.
2. Double-click or open [frontend/dashboard.html](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/dashboard.html) (or the redirecting [frontend/index.html](file:///C:/Users/JoseMyrsonOBeros/Documents/Javascript/Projects/FreshCart/frontend/index.html)) in your browser.
3. Switch views using the sidebar menu and toggle the light/dark themes using the sun icon in the top header.
