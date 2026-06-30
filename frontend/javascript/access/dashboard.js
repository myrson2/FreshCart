import { getPerishableProducts } from "../service/ItemManager.js";

 document.getElementById('theme-toggle').addEventListener('change', (e) => {
      if (e.target.checked) {
        localStorage.setItem('theme', 'dark');
        document.body.classList.add('dark-mode');
      } else {
        localStorage.setItem('theme', 'light');
        document.body.classList.remove('dark-mode');
      }
});

getPerishableProducts().then(res => console.log(res))
