// // const categories = [
// //   {
// //     id: 1,
// //     name: "Digital Marketing",
// //     subCategories: [
// //       { name: "Ads Campaign", icon: "📢", listings: 2 },
// //       { name: "SEO Optimization", icon: "🔍", listings: 5 },
// //       { name: "Social Media Marketing", icon: "📱", listings: 8 },
// //       { name: "Email Marketing", icon: "📧", listings: 3 },
// //     ],
// //   },
// //   {
// //     id: 2,
// //     name: "Graphics & Design",
// //     subCategories: [
// //       { name: "Logo Design", icon: "🎨", listings: 12 },
// //       { name: "Brand Style Guide", icon: "✨", listings: 4 },
// //       { name: "UI/UX Design", icon: "💻", listings: 7 },
// //       { name: "Illustration", icon: "✍️", listings: 6 },
// //     ],
// //   },
// //   {
// //     id: 3,
// //     name: "Programming & Tech",
// //     subCategories: [
// //       { name: "Web Development", icon: "🌐", listings: 15 },
// //       { name: "Mobile Apps", icon: "📲", listings: 9 },
// //       { name: "AI & Machine Learning", icon: "🤖", listings: 4 },
// //       { name: "Cybersecurity", icon: "🛡️", listings: 2 },
// //     ],
// //   },
// //   {
// //     id: 4,
// //     name: "Writing & Translation",
// //     subCategories: [
// //       { name: "Articles & Blog Posts", icon: "✍️", listings: 10 },
// //       { name: "Proofreading & Editing", icon: "📝", listings: 5 },
// //       { name: "Translation", icon: "🌍", listings: 8 },
// //       { name: "Technical Writing", icon: "📄", listings: 3 },
// //     ],
// //   },
// //   {
// //     id: 5,
// //     name: "Music & Audio",
// //     subCategories: [
// //       { name: "Voice Over", icon: "🎙️", listings: 6 },
// //       { name: "Mixing & Mastering", icon: "🎚️", listings: 4 },
// //       { name: "Sound Design", icon: "🔊", listings: 3 },
// //       { name: "Podcast Production", icon: "🎧", listings: 5 },
// //     ],
// //   },
// //   {
// //     id: 6,
// //     name: "Video & Animation",
// //     subCategories: [
// //       { name: "Video Editing", icon: "🎬", listings: 11 },
// //       { name: "2D Animation", icon: "🎞️", listings: 4 },
// //       { name: "Motion Graphics", icon: "📺", listings: 6 },
// //       { name: "Short Video Ads", icon: "🎥", listings: 9 },
// //     ],
// //   },
// //   {
// //     id: 7,
// //     name: "Business & Virtual Assistant",
// //     subCategories: [
// //       { name: "Data Entry", icon: "⌨️", listings: 20 },
// //       { name: "Virtual Assistant", icon: "👔", listings: 14 },
// //       { name: "Market Research", icon: "📊", listings: 5 },
// //       { name: "Project Management", icon: "📅", listings: 3 },
// //     ],
// //   },
// // ];

// const categoryList = document.getElementById("category-list");
// const subCategories = document.getElementById("categories-card");

// // categories.forEach((category, index) => {
// //   const listItem = document.createElement("li");
// //   listItem.innerHTML = `<a href="#" class="category-item ${index === 0 ? "active" : ""}" data-id="${category.id}">${category.name}</a>`;
// //   categoryList.appendChild(listItem);
// // });
// let categories = [];
// getData("/categories").then((data) => {
//   categories = data;
//   loadCategories();
// });
// async function loadCategories() {
//   try {
//     // Replace with your teammate's absolute URL if testing across different ports (e.g., http://localhost:5000/api/categories)

//     // Clear layout and render Parent Category list in the sidebar
//     categoryList.innerHTML = "";
//     categories.forEach((category, index) => {
//       const listItem = document.createElement("li");
//       listItem.innerHTML = `
//           <a href="#" class="category-item ${index === 0 ? "active" : ""}" data-id="${category.id}">
//             ${category.name}
//           </a>
//         `;
//       categoryList.appendChild(listItem);
//     });

//     // Default Initialization: Render subcategories for the very first parent item
//     if (categories.length > 0) {
//       renderCategories(categories[0].subCategories || []);
//     }
//   } catch (error) {
//     console.error("UI Initialization failed to fetch categories:", error);
//     categoryList.innerHTML = `<li style="color: #ff4d4d; padding: 10px;">Failed to load navigation menu.</li>`;
//     subCategories.innerHTML = `<div class="error-msg">Could not establish database connection stream.</div>`;
//   }
// }

// subCategories.addEventListener("click", (event) => {
//   const card = event.target.closest('[id^="category-"]');

//   if (card) {
//     const categorySlug = card.id.replace("category-", "");

//     window.location.href = `../pages/explore-projects.html?category=${categorySlug}`;
//   }
// });

// function renderCategories(data) {
//   subCategories.innerHTML = "";

//   document.getElementById("category-count").innerText = `${data.length}`;

//   data.forEach((category) => {
//     const card = document.createElement("div");
//     const dynamicId = `category-${category.name.toLowerCase().replace(/\s+/g, "-")}`;
//     card.className = "category-card";
//     card.id = dynamicId;
//     card.innerHTML = `
//             <div class="card-image">${category.icon}</div>
//           <div class="card-content">
//             <div class="card-title">${category.name}</div>
//             <div class="card-listings">${category.listings || 0} listings</div>
//           </div>
//         `;

//     subCategories.appendChild(card);
//   });
// }

// categoryList.addEventListener("click", (e) => {
//   const clickedLink = e.target.closest(".category-item");
//   if (!clickedLink) return;
//   e.preventDefault();

//   // Update active UI
//   document
//     .querySelectorAll(".category-item")
//     .forEach((a) => a.classList.remove("active"));
//   clickedLink.classList.add("active");

//   // Find data and render
//   const selectedId = parseInt(clickedLink.dataset.id);
//   const selectedCategory = categories.find((cat) => cat.id === selectedId);

//   if (selectedCategory) {
//     renderCategories(selectedCategory.subCategories);
//   }
// });

// subCategories.addEventListener("click", (event) => {
//   const card = event.target.closest('[id^="category-"]');

//   if (card) {
//     const categorySlug = card.id.replace("category-", "");

//     window.location.href = `../pages/explore-projects.html?category=${categorySlug}`;
//   }
// });

// renderCategories(categories[0]?.subCategories);

const categoryList = document.getElementById("category-list");
const subCategories = document.getElementById("categories-card");

let categories = [];

// Fetch the data from your teammate's updated endpoint
getData("/categories").then((data) => {
  categories = data;
  loadCategories();
});

async function loadCategories() {
  try {
    // Clear layout and render Category list in your sidebar
    categoryList.innerHTML = "";
    categories.forEach((category, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <a href="#" class="category-item ${index === 0 ? "active" : ""}" data-id="${category.id}">
            ${category.name}
          </a>
        `;
      categoryList.appendChild(listItem);
    });

    // Default Initialization: Since data is flat, pass the active category directly
    if (categories.length > 0) {
      renderSingleCategoryCard(categories[0]);
    }
  } catch (error) {
    console.error("UI Initialization failed to render categories:", error);
    categoryList.innerHTML = `<li style="color: #ff4d4d; padding: 10px;">Failed to load navigation menu.</li>`;
    subCategories.innerHTML = `<div class="error-msg">Could not display category streams.</div>`;
  }
}

// Rewritten to dynamically render the selected category card layout cleanly
function renderSingleCategoryCard(category) {
  subCategories.innerHTML = "";

  if (!category) {
    document.getElementById("category-count").innerText = "0";
    return;
  }

  // Reflect that 1 item is active/rendered in the panel view counter
  document.getElementById("category-count").innerText = "1";

  const card = document.createElement("div");
  const dynamicId = `category-${category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}`;

  card.className = "category-card";
  card.id = dynamicId;

  // Uses teammate's 'icon_url' parameter inside an <img> tag with fallback verification
  card.innerHTML = `
      <div class="card-image">
        <img src="${category.icon_url || ""}" alt="${category.name}" onerror="this.src='https://via.placeholder.com/40?text=🌐'"/>
      </div>
      <div class="card-content">
        <div class="card-title">${category.name}</div>
        <div class="card-listings">${category.listings || 0} listings</div>
      </div>
    `;

  subCategories.appendChild(card);
}

// Sidebar selection listener
categoryList.addEventListener("click", (e) => {
  const clickedLink = e.target.closest(".category-item");
  if (!clickedLink) return;
  e.preventDefault();

  // Update active navigation link styling class indicators
  document
    .querySelectorAll(".category-item")
    .forEach((a) => a.classList.remove("active"));
  clickedLink.classList.add("active");

  const selectedId = parseInt(clickedLink.dataset.id);
  const selectedCategory = categories.find((cat) => cat.id === selectedId);

  if (selectedCategory) {
    renderSingleCategoryCard(selectedCategory);
  }
});

// Single card event redirection delegate tracker
subCategories.addEventListener("click", (event) => {
  const card = event.target.closest('[id^="category-"]');
  if (card) {
    const categorySlug = card.id.replace("category-", "");
    window.location.href = `../pages/explore-projects.html?category=${categorySlug}`;
  }
});
