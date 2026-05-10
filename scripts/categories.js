const categories = [
  {
    id: 1,
    name: "Digital Marketing",
    subCategories: [
      { name: "Ads Campaign", icon: "📢", listings: 2 },
      { name: "SEO Optimization", icon: "🔍", listings: 5 },
      { name: "Social Media Marketing", icon: "📱", listings: 8 },
      { name: "Email Marketing", icon: "📧", listings: 3 },
    ],
  },
  {
    id: 2,
    name: "Graphics & Design",
    subCategories: [
      { name: "Logo Design", icon: "🎨", listings: 12 },
      { name: "Brand Style Guide", icon: "✨", listings: 4 },
      { name: "UI/UX Design", icon: "💻", listings: 7 },
      { name: "Illustration", icon: "✍️", listings: 6 },
    ],
  },
  {
    id: 3,
    name: "Programming & Tech",
    subCategories: [
      { name: "Web Development", icon: "🌐", listings: 15 },
      { name: "Mobile Apps", icon: "📲", listings: 9 },
      { name: "AI & Machine Learning", icon: "🤖", listings: 4 },
      { name: "Cybersecurity", icon: "🛡️", listings: 2 },
    ],
  },
  {
    id: 4,
    name: "Writing & Translation",
    subCategories: [
      { name: "Articles & Blog Posts", icon: "✍️", listings: 10 },
      { name: "Proofreading & Editing", icon: "📝", listings: 5 },
      { name: "Translation", icon: "🌍", listings: 8 },
      { name: "Technical Writing", icon: "📄", listings: 3 },
    ],
  },
  {
    id: 5,
    name: "Music & Audio",
    subCategories: [
      { name: "Voice Over", icon: "🎙️", listings: 6 },
      { name: "Mixing & Mastering", icon: "🎚️", listings: 4 },
      { name: "Sound Design", icon: "🔊", listings: 3 },
      { name: "Podcast Production", icon: "🎧", listings: 5 },
    ],
  },
  {
    id: 6,
    name: "Video & Animation",
    subCategories: [
      { name: "Video Editing", icon: "🎬", listings: 11 },
      { name: "2D Animation", icon: "🎞️", listings: 4 },
      { name: "Motion Graphics", icon: "📺", listings: 6 },
      { name: "Short Video Ads", icon: "🎥", listings: 9 },
    ],
  },
  {
    id: 7,
    name: "Business & Virtual Assistant",
    subCategories: [
      { name: "Data Entry", icon: "⌨️", listings: 20 },
      { name: "Virtual Assistant", icon: "👔", listings: 14 },
      { name: "Market Research", icon: "📊", listings: 5 },
      { name: "Project Management", icon: "📅", listings: 3 },
    ],
  },
];

const categoryList = document.getElementById("category-list");
const subCategories = document.getElementById("categories-card");

categories.forEach((category, index) => {
  const listItem = document.createElement("li");
  listItem.innerHTML = `<a href="#" class="category-item ${index === 0 ? "active" : ""}" data-id="${category.id}">${category.name}</a>`;
  categoryList.appendChild(listItem);
});

subCategories.addEventListener("click", (event) => {
  const card = event.target.closest('[id^="category-"]');

  if (card) {
    const categorySlug = card.id.replace("category-", "");

    window.location.href = `../pages/explore-projects.html?category=${categorySlug}`;
  }
});

function renderCategories(data) {
  subCategories.innerHTML = "";

  document.getElementById("category-count").innerText = `${data.length}`;

  data.forEach((category) => {
    const card = document.createElement("div");
    const dynamicId = `category-${category.name.toLowerCase().replace(/\s+/g, "-")}`;
    card.className = "category-card";
    card.id = dynamicId;
    card.innerHTML = `
            <div class="card-image">${category.icon}</div>
          <div class="card-content">
            <div class="card-title">${category.name}</div>
            <div class="card-listings">${category.listings || 0} listings</div>
          </div>
        `;

    subCategories.appendChild(card);
  });
}

categoryList.addEventListener("click", (e) => {
  const clickedLink = e.target.closest(".category-item");
  if (!clickedLink) return;
  e.preventDefault();

  // Update active UI
  document
    .querySelectorAll(".category-item")
    .forEach((a) => a.classList.remove("active"));
  clickedLink.classList.add("active");

  // Find data and render
  const selectedId = parseInt(clickedLink.dataset.id);
  const selectedCategory = categories.find((cat) => cat.id === selectedId);

  if (selectedCategory) {
    renderCategories(selectedCategory.subCategories);
  }
});

subCategories.addEventListener("click", (event) => {
  const card = event.target.closest('[id^="category-"]');

  if (card) {
    const categorySlug = card.id.replace("category-", "");

    window.location.href = `../pages/explore-projects.html?category=${categorySlug}`;
  }
});

renderCategories(categories[0].subCategories);
