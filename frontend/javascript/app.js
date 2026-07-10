import { renderInventory } from "./access/inventory/inventory.js";
import ItemRepository from "./repository/itemRepository.js";
import ItemManager from "./service/ItemManager.js";

// 1. Create the dependency graph
const itemRepository = new ItemRepository("inventory");
const itemManager = new ItemManager(itemRepository);

// ==========================================
// 1. GLOBAL THEME PERSISTENCE & HANDLING
// ==========================================

function setupGlobalTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return; // Guard clause in case a page doesn't have the toggle

  // A. Apply the saved preference immediately on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    themeToggle.checked = true;
    document.body.classList.add("dark-mode");
  } else {
    themeToggle.checked = false;
    document.body.classList.remove("dark-mode");
  }

  // B. Listen for changes to save the preference
  themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark-mode");
    } else {
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark-mode");
    }
  });
}

// Execute the theme setup immediately on page boot
setupGlobalTheme();

// 2. Asynchronously data repository
async function database() {
  try {
    console.log("[Composition Root] Database application...");
    await itemRepository.init();
    console.log("[Composition Root] Database loaded successfully.");

    // Expose itemManager to window for global developer debugging & console checking
    // window.itemManager = itemManager;

    // Once other UI files (like inventory.js) are ready to support constructor injection:
    // import { initInventoryUI } from './access/inventory.js';
    // initInventoryUI(itemManager);
    if (window.location.pathname.includes("inventory.html")) {
      console.log("Entering renderInventory()");
      renderInventory(itemManager);
    }

    // // 2. Check if we are on the dashboard page
    // if (document.getElementById('dashboard-canvas')) {
    //     renderDashboard(itemManager);
    // }
  } catch (error) {
    console.error(
      "[Composition Root] Failed to bootstrap application dependencies:",
      error,
    );
  }
}

database();
export { itemRepository, itemManager };
