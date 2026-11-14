
const jobList = document.querySelector("#job-list");
const filterBar = document.querySelector("#filter-bar");
const activeFilters = document.querySelector("#active-filters");
const clearButton = document.querySelector("#clear-filters");

let jobs = [];
const selectedFilters = new Set();

// Get all job tags
function allTags(job) {
  return [
    job.role,
    job.level,
    ...job.languages,
    ...job.tools
  ];
}

// Create filter buttons
function createTag(label) {
  const button = document.createElement("button");

  button.className = "tag";
  button.type = "button";
  button.textContent = label;

  button.addEventListener("click", () => {
    selectedFilters.add(label);
    render();
  });

  return button;
}

// Create job cards
function createJobCard(job) {
  const card = document.createElement("article");

  card.className = `job-card${job.featured ? " featured" : ""}`;

  const main = document.createElement("div");
  main.className = "job-main";

  const logo = document.createElement("img");
  logo.className = "company-logo";
  logo.src = job.logo;
  logo.alt = job.company + " logo";

  const details = document.createElement("div");
  details.className = "details";

  const companyLine = document.createElement("div");
  companyLine.className = "company-line";

  const company = document.createElement("span");
  company.className = "company";
  company.textContent = job.company;

  companyLine.append(company);

  if (job.new) {
    const newBadge = document.createElement("span");
    newBadge.className = "pill";
    newBadge.textContent = "NEW!";
    companyLine.append(newBadge);
  }

  if (job.featured) {
    const featuredBadge = document.createElement("span");
    featuredBadge.className = "pill dark";
    featuredBadge.textContent = "FEATURED";
    companyLine.append(featuredBadge);
  }

  const position = document.createElement("a");
  position.className = "position";
  position.href = "#";
  position.textContent = job.position;

  position.addEventListener("click", event => {
    event.preventDefault();
  });

  const meta = document.createElement("div");
  meta.className = "meta";

  [
    job.postedAt,
    job.contract,
    job.location
  ].forEach((value, index) => {

    if (index > 0) {
      const dot = document.createElement("span");
      dot.className = "dot";
      meta.append(dot);
    }

    const item = document.createElement("span");
    item.textContent = value;
    meta.append(item);
  });

  details.append(companyLine, position, meta);
  main.append(logo, details);

  const tags = document.createElement("div");
  tags.className = "tags";

  allTags(job).forEach(tag => {
    tags.append(createTag(tag));
  });

  card.append(main, tags);

  return card;
}

// Display selected filters
function renderFilters() {
  activeFilters.replaceChildren();

  selectedFilters.forEach(filter => {

    const token = document.createElement("div");
    token.className = "filter-token";

    const label = document.createElement("span");
    label.textContent = filter;

    const remove = document.createElement("button");
    remove.className = "remove-filter";
    remove.type = "button";
    remove.textContent = "×";

    remove.addEventListener("click", () => {
      selectedFilters.delete(filter);
      render();
    });

    token.append(label, remove);
    activeFilters.append(token);
  });

  filterBar.hidden = selectedFilters.size === 0;
}

// Render job listings
function render() {
  renderFilters();

  const visibleJobs = jobs.filter(job =>
    [...selectedFilters].every(filter =>
      allTags(job).includes(filter)
    )
  );

  jobList.replaceChildren();

  if (visibleJobs.length === 0) {
    const empty = document.createElement("p");

    empty.className = "empty";
    empty.textContent =
      "No jobs match these filters. Try removing a filter.";

    jobList.append(empty);
    return;
  }

  visibleJobs.forEach(job => {
    jobList.append(createJobCard(job));
  });
}

// Clear all filters
clearButton.addEventListener("click", () => {
  selectedFilters.clear();
  render();
});

// Load JSON data
fetch("./data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Could not load job data.");
    }

    return response.json();
  })
  .then(data => {
    jobs = data;
    render();
  })
  .catch(error => {
    jobList.textContent =
      error.message + " Run this project using Live Server.";
  });
