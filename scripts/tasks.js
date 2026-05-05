// ========== HEART BUTTON FUNCTIONALITY ========== 
document.querySelectorAll('.heart-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.toggle('liked');

        const icon = this.querySelector('i');
        if (this.classList.contains('liked')) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#ef4444';
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = '#4b5563';
        }
    });
});

// ========== DETAILS/ACCORDION TOGGLE ========== 
document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', function () {
        console.log('Details toggled:', this.open);
    });
});

// ========== FILTER FUNCTIONALITY ========== 
const filterButtons = document.querySelectorAll('aside button');
filterButtons.forEach(btn => {
    const btnText = btn.textContent.trim();
    if (btnText === 'Apply filters') {
        btn.addEventListener('click', function () {
            console.log('Filters applied');
            alert('Filters have been applied!');
        });
    } else if (btnText === 'Clear all filters') {
        btn.addEventListener('click', function () {
            // Clear all checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            // Clear search inputs
            document.querySelectorAll('input[type="text"]').forEach(input => {
                input.value = '';
            });
            // Clear price range
            const priceSlider = document.querySelector('input[type="range"]');
            if (priceSlider) priceSlider.value = 0;
            console.log('All filters cleared');
        });
    }
});

// ========== SEARCH FUNCTIONALITY ========== 
const sidebarButtons = document.querySelectorAll('aside button');
sidebarButtons.forEach(btn => {
    const icon = btn.querySelector('i.fa-magnifying-glass');
    if (icon) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const searchInput = this.previousElementSibling;
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                alert(`Searching for: ${searchTerm}`);
            } else {
                alert('Please enter a search term');
            }
        });
    }
});

// ========== PAGINATION CLICK HANDLERS ========== 
document.querySelectorAll('button:not(.heart-btn)').forEach(button => {
    if (button.textContent.match(/^\d+$/)) {
        button.addEventListener('click', function () {
            // Remove active state from all pagination buttons
            document.querySelectorAll('button:not(.heart-btn)').forEach(btn => {
                if (btn.textContent.match(/^\d+$/)) {
                    btn.classList.remove('bg-green-500', 'text-white');
                    btn.classList.add('border', 'border-gray-200', 'text-gray-700');
                }
            });
            // Add active state to clicked button
            this.classList.remove('border', 'border-gray-200', 'text-gray-700');
            this.classList.add('bg-green-500', 'text-white');
            console.log('Navigated to page:', this.textContent);
        });
    }
});

// ========== PRICE RANGE SLIDER ========== 
const priceSlider = document.querySelector('input[type="range"]');
if (priceSlider) {
    priceSlider.addEventListener('input', function () {
        const priceRange = document.querySelector('.flex.justify-between');
        if (priceRange) {
            const spans = priceRange.querySelectorAll('span');
            if (spans[1]) {
                spans[1].textContent = `$${this.value}`;
            }
        }
        console.log('Price range updated to:', this.value);
    });
}

// ========== SORT DROPDOWN ========== 
const mainSortButton = document.querySelector('div.flex.gap-2 button');
if (mainSortButton) {
    mainSortButton.addEventListener('click', function (e) {
        e.preventDefault();
        const options = ['Recent listing', 'Price (Low to High)', 'Price (High to Low)', 'Top Rated'];
        const choice = prompt('Sort by:\n1. Recent listing\n2. Price (Low to High)\n3. Price (High to Low)\n4. Top Rated\n\nEnter your choice (1-4):', '1');
        if (choice && options[choice - 1]) {
            mainSortButton.innerHTML = options[choice - 1] + ' <i class="fa-solid fa-chevron-down text-[10px]"></i>';
            console.log('Sorted by:', options[choice - 1]);
        }
    });
}

// ========== NAV DROPDOWNS ========== 
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.querySelector('i.fa-chevron-down')) {
            e.preventDefault();
            const linkText = this.textContent.trim().split('\n')[0];
            console.log('Nav dropdown clicked:', linkText);
            if (linkText === 'Explore') {
                const choice = prompt('Explore:\n1. Trending\n2. Most Popular\n3. New Freelancers\n4. Featured\n\nEnter your choice (1-4):', '1');
                const explores = ['Trending', 'Most Popular', 'New Freelancers', 'Featured'];
                if (choice && explores[choice - 1]) {
                    alert('Showing: ' + explores[choice - 1]);
                }
            } else if (linkText === 'Find by Categories') {
                const choice = prompt('Categories:\n1. Web Development\n2. Graphic Design\n3. Digital Marketing\n4. Writing\n5. Video Editing\n6. Music Production\n\nEnter your choice (1-6):', '1');
                const categories = ['Web Development', 'Graphic Design', 'Digital Marketing', 'Writing', 'Video Editing', 'Music Production'];
                if (choice && categories[choice - 1]) {
                    alert('Showing ' + categories[choice - 1] + ' freelancers');
                }
            }
        }
    });
});

// ========== CARD CLICK HANDLERS ========== 
document.querySelectorAll('article').forEach(card => {
    card.addEventListener('click', function (e) {
        // Don't navigate if clicking the heart button
        if (!e.target.closest('.heart-btn')) {
            console.log('Card clicked:', this.querySelector('h3').textContent);
            // Uncomment to navigate: window.location.href = '/freelancer-profile';
        }
    });
});

// ========== SIGN IN & REGISTER ========== 
const headerLinks = document.querySelectorAll('header a');
headerLinks.forEach(link => {
    const linkText = link.textContent.trim();
    if (linkText === 'Sign In') {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Sign In clicked');
            alert('Redirecting to Sign In page...');
        });
    } else if (linkText === 'Register') {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Register clicked');
            alert('Redirecting to Register page...');
        });
    }
});

// ========== FOOTER LINKS ========== 
document.querySelectorAll('footer a').forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            console.log('Footer link clicked:', this.textContent);
            alert('Footer link: ' + this.textContent.trim());
        }
    });
});

// ========== FREELANCER SEARCH DROPDOWN ========== 
const searchFilterDiv = document.querySelector('.flex.items-center.gap-1.px-3.py-1.5.border-l');
if (searchFilterDiv) {
    searchFilterDiv.addEventListener('click', function (e) {
        e.preventDefault();
        const choice = prompt('Search in:\n1. Freelancers\n2. Projects\n3. Agencies\n\nEnter your choice (1-3):', '1');
        const searchTypes = ['Freelancers', 'Projects', 'Agencies'];
        if (choice && searchTypes[choice - 1]) {
            searchFilterDiv.innerHTML = searchTypes[choice - 1] + ' <i class="fa-solid fa-chevron-down text-[9px]"></i>';
            console.log('Search type changed to:', searchTypes[choice - 1]);
        }
    });
}

// ========== IMAGE ERROR HANDLING ========== 
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
        this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
        console.log('Image failed to load, using placeholder');
    });
});

// ========== PAGINATION ARROWS ========== 
const paginationButtons = document.querySelectorAll('button');
paginationButtons.forEach(btn => {
    const chevronLeft = btn.querySelector('i.fa-chevron-left');
    const chevronRight = btn.querySelector('i.fa-chevron-right');

    if (chevronLeft) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Previous page');
            alert('Going to previous page');
        });
    }
    if (chevronRight) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Next page');
            alert('Going to next page');
        });
    }
});

// ========== GENERAL BUTTON CLICK HANDLER ========== 
document.querySelectorAll('button').forEach(button => {
    if (!button.hasAttribute('data-listener')) {
        button.setAttribute('data-listener', 'true');
        button.style.cursor = 'pointer';
    }
});

// ========== NAVBAR LOGO CLICK ========== 
document.querySelector('a.text-base.font-semibold')?.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Logo clicked');
    alert('Redirecting to homepage...');
});

// ========== INITIALIZATION ========== 
console.log('Mini Freelancer Hub initialized successfully!');

