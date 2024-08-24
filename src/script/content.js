console.log("Tokyo Data Catalog Extension Loaded");
// Example content script functionality
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('title');
    if (title) {
        console.log('Page Title:', title.innerText);
    }
});
