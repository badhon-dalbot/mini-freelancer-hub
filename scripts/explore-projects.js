// Simulated data (later replace with API)
let jobs = [
  {
    title: "Website Design and Front-End Development",
    price: "$1200-$1400",
    tags: ["App Design", "Content Writing"],
  },
  {
    title: "Website SEO Audit and Optimization",
    price: "$1000-$1200",
    tags: ["SEO", "Marketing"],
  },
  {
    title: "Visual Branding and Collateral Design",
    price: "$2400",
    tags: ["Design", "Branding"],
  },
  {
    title: "E-commerce Platform Development",
    price: "$3000-$4500",
    tags: ["React", "Node.js"],
  },
  {
    title: "Mobile App UI/UX Redesign",
    price: "$65/hr",
    tags: ["UI Design", "Figma"],
  },
];

// Render jobs
function renderJobs(data) {
  const container = document.getElementById("jobContainer");
  container.innerHTML = "";

  document.getElementById("resultCount").innerText =
    `${data.length} search result(s) found`;

  data.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <div class="job-title">${job.title}</div>
      <div class="job-price">${job.price}</div>
      <div class="tags">
        ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;

    container.appendChild(card);
  });
}

// Search function
function searchJobs() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(query),
  );

  renderJobs(filtered);
}

// Initial load
renderJobs(jobs);
