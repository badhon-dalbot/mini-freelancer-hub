let categories = [
  {
    name: "Ads Campaign",
    icon: "�",
    listings: 2,
  },
  {
    name: "Content Creation",
    icon: "📝",
    listings: 3,
  },
  {
    name: "SEO Optimization",
    icon: "🔍",
  },
  {
    name: "Social Media Management",
    icon: "📱",
    listings: 4,
  },
  {
    name: "Video Editing",
    icon: "🎬",
    listings: 5,
  },
];

function renderCategories(data) {
  const container = document.getElementById("categories-card");
  container.innerHTML = "";

  document.getElementById("category-count").innerText = `${data.length}`;

  data.forEach((category) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
            <div class="card-image">${category.icon}</div>
          <div class="card-content">
            <div class="card-title">${category.name}</div>
            <div class="card-listings">${category.listings || 0} listings</div>
          </div>
        `;

    container.appendChild(card);
  });
}

renderCategories(categories);
