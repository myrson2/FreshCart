---
name: "ui-helper"
description: "Triggers exclusively when the user explicitly requests a UI layout, visual mock, frontend view, HTML structure, or CSS styling template."
---

# UI Generation Protocol & Architecture Guardrails

You must strictly adhere to the following rules whenever the user asks for a UI layout or frontend design.

## 1. Trigger Constraint
- **Do not generate UI layout code proactively.**
- Only generate the HTML and CSS layouts when the user explicitly requests a UI layout (e.g., "generate a layout for...", "make a UI for...", "design a view for...").

## 2. Technical Stack Boundaries
- **HTML & CSS Only:** You are strictly forbidden from generating functional JavaScript script blocks, external JS file links, or active state-management logic in the code blocks.
- **Styling:** Provide clean, responsive CSS (either embedded in a `<style>` tag or as a standalone component layout block) that perfectly matches modern, clean, containerized web layouts.

## 3. JavaScript Interface Contracts (Handoff Protocol)
If the requested UI component requires user interaction, dynamic calculation logic, event listeners, or rendering data loops:
- Do not write the actual JavaScript logic.
- Instead, place an explicit HTML comment block (`<!-- -->`) directly above or inside the relevant HTML element.
- The comment must outline:
  1. The specific type of event listener needed (e.g., `click`, `submit`, `change`).
  2. The exact function payload name or architectural target (e.g., `handleCommitStock()`, `renderInventory()`).
  3. A simple, basic script boilerplate structure at the bottom of the HTML file displaying where that custom script handler should link up.

### Component Handoff Example Template:
```html
<!--
  Event: click
  Handler: handleCommitStock()
  Target: #commit-stock-btn
-->
<button id="commit-stock-btn" type="submit" class="btn btn-primary">
  Commit Stock
</button>
```