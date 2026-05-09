const logIn = false;
const topHeader = document.getElementById("header");
const sidebar = document.getElementById("sidebar");
const searchBar = document.getElementById("search-bar");

if (logIn) {
  topHeader.style.display = "none";
} else {
  sidebar.style.display = "none";
  searchBar.style.display = "none";
}

// Simulated data
let jobs = [
  {
    id: "website-design-front-end-development",
    title: "Website Design and Front-End Development",
    description:
      "We are seeking a talented website designer and front-end developer to join our team. In this role, you will be responsible for creating visually appealing and user-friendly websites that align with our brand identity. The ideal candidate should have a strong portfolio showcasing their design skills and proficiency in front-end technologies such as HTML, CSS, and JavaScript. You will collaborate closely with our marketing and content teams to ensure that the website effectively communicates our message and engages our target audience.",
    price: "$1200-$1400",
    priceType: "Fixed price project",
    tags: ["App Design", "Content Writing", "SEO"],
    buyerName: "Mark Thompson",
    postDate: "January 5, 2024",
    isFavorite: true,
  },
  {
    id: "website-seo-audit-optimization",
    title: "Website SEO Audit and Optimization",
    description:
      "In this role, you will be responsible for conducting comprehensive SEO audits and implementing strategies to optimize websites for search engines. The ideal candidate should have a strong understanding of SEO best practices, keyword research, and on-page optimization techniques. You will analyze website performance, identify areas for improvement, and implement strategies to enhance search engine rankings and drive organic traffic.",
    price: "$1000-$1200",
    priceType: "Fixed price project",
    tags: ["SEO", "Marketing"],
    buyerName: "Jessica Carter",
    postDate: "February 10, 2024",
    isFavorite: false,
  },
  {
    id: "visual-branding-collateral-design",
    title: "Visual Branding and Collateral Design",
    description:
      "In this role, you will be responsible for creating visually appealing and cohensive brand identities and collateral materials. The ideal candidate should have a strong portfolio showcasing their design skills and proficiency in design tools such as Adobe Creative Suite. You will collaborate closely with our marketing team to ensure that the branding effectively communicates our message and resonates with our target audience.",
    price: "$2400",
    priceType: "Fixed price project",
    tags: ["Design", "Branding"],
    buyerName: "Daniel Gracia",
    postDate: "March 15, 2024",
    isFavorite: false,
  },
  {
    id: "ecommerce-platform-development",
    title: "E-commerce Platform Development",
    description:
      "We are seeking an experienced developer to build a scalable e-commerce plaform from scratch. You will work closely with our design team. The ideal candidate should have a strong background in web development, with expertise in technologies such as React, Node.js, and MongoDB. You will be responsible for developing a user-friendly and secure e-commerce platform that meets our business requirements and provides an exceptional shopping experience for our customers.",
    price: "$3000-$4500",
    priceType: "Fixed price project",
    tags: ["React", "Node.js"],
    buyerName: "Sarah Jenkins",
    postDate: "April 20, 2024",
    isFavorite: false,
  },
  {
    id: "mobile-app-uiux-redesign",
    title: "Mobile App UI/UX Redesign",
    description:
      "Looking for a creative UI/UX designer to revamp our existing mobile application. Your goal will be to improve user relation through intuitive design and seamless user experience. The ideal candidate should have a strong portfolio showcasing their design skills and proficiency in design tools such as Figma or Adobe XD. You will collaborate closely with our development team to ensure that the redesigned UI/UX is implemented effectively and enhances the overall user experience of our mobile application.",
    price: "$65/hr",
    priceType: "Hourly/price project",
    tags: ["UI Design", "Figma"],
    buyerName: "Alex Rivera",
    postDate: "May 5, 2024",
    isFavorite: false,
  },
];

// Render jobs
function renderJobs(data) {
  const container = document.getElementById("jobContainer");
  container.innerHTML = "";

  document.getElementById("resultCount").innerText = `${data.length}`;

  data.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <div class="card-top">
        <p class="post-date">${job.postDate}</p>
         <button class="favorite-btn ${job.isFavorite ? "active" : ""}"><svg class="icon-favorite" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.5 7.12508C1.50003 5.41654 2.55333 3.88485 4.14871 3.27338C5.74408 2.66192 7.55129 3.09724 8.69325 4.36809C8.77267 4.453 8.88373 4.5012 9 4.5012C9.11627 4.5012 9.22733 4.453 9.30675 4.36809C10.4453 3.08874 12.257 2.64776 13.8562 3.2607C15.4554 3.87363 16.5082 5.41247 16.5 7.12508C16.5 8.84258 15.375 10.1251 14.25 11.2501L10.131 15.2348C9.8483 15.5595 9.43972 15.7471 9.00922 15.7498C8.57871 15.7525 8.16779 15.5702 7.881 15.2491L3.75 11.2501C2.625 10.1251 1.5 8.85008 1.5 7.12508" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  <svg class="icon-default" width="18" height="18" viewBox="0 0 18 18">
    <path d="M9 16s-7-4.5-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.5-7 9-7 9z"
      fill="none" stroke="#9CA3AF" stroke-width="1.5"/>
  </svg></button>
      </div>
      <div class="job-title">${job.title}</div>
      <div class="job-price"><span>${job.priceType}</span><span>${job.price}</span></div>
      <div class="tags">
        ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <hr>
      <div class="job-bottom"><div class="buyer-info"><img src="../Assests/John Doe Icon.png" alt="Buyer Icon"> <span>${job.buyerName}</span></div>
      <button class="view-jobs-btn" type="button" data-job-id="${job.id}"> View Jobs</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function openJobDetails(jobId) {
  const selectedJob = jobs.find((job) => job.id === jobId) || jobs[0];

  if (!selectedJob) {
    return;
  }

  sessionStorage.setItem("selectedJob", JSON.stringify(selectedJob));
  window.location.href = `/pages/job-description.html?job=${encodeURIComponent(selectedJob.id)}`;
}

document.getElementById("jobContainer").addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(".favorite-btn");
  if (favoriteButton) {
    favoriteButton.classList.toggle("active");
    return;
  }

  const viewButton = event.target.closest(".view-jobs-btn");
  if (viewButton) {
    openJobDetails(viewButton.getAttribute("data-job-id"));
  }
});

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
