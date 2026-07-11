export function renderOrderDashboard() {
    console.log('Render Ordering..');
        // Populate current local date on load
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('live-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);

    // Drawer opening and closing logic
    const openBtn = document.getElementById('btn-open-dispatch-form');
    const closeBtn = document.getElementById('btn-close-drawer');
    const overlay = document.getElementById('dispatch-drawer-overlay');
    const card = document.getElementById('dispatch-drawer-card');

    openBtn.addEventListener('click', () => {
      overlay.classList.add('open');
    });

    const closeDrawer = () => {
      overlay.classList.remove('open');
    };

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeDrawer();
      }
    });
}