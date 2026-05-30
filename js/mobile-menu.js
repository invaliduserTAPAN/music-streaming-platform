// Mobile menu toggle functionality
// Add this to your existing JavaScript file or create a new one

document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger button if it doesn't exist
  // Add this to your main() function or wherever you handle the hamburger click

const hamburger = document.querySelector('.hamburger');
const leftSidebar = document.querySelector('.left');
const overlay = document.querySelector('.overlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active'); // ADD THIS LINE
    leftSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    hamburger.classList.toggle('active'); // ADD THIS LINE
    leftSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});
    
    // Re-create on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.hamburger')) {
                createHamburgerMenu();
            }
        } else {
            removeHamburgerMenu();
        }
    });
});

function createHamburgerMenu() {
    // Check if hamburger already exists
    if (document.querySelector('.hamburger')) return;
    
    // Create hamburger button
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Add to body
    document.body.appendChild(hamburger);
    document.body.appendChild(overlay);
    
    // Get left sidebar
    const leftSidebar = document.querySelector('.left');
    
    // Toggle menu
    hamburger.addEventListener('click', function() {
        leftSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        leftSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

function removeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.overlay');
    const leftSidebar = document.querySelector('.left');
    
    if (hamburger) hamburger.remove();
    if (overlay) overlay.remove();
    if (leftSidebar) {
        leftSidebar.classList.remove('active');
    }
}