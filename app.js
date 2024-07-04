const filterContainer = document.getElementById("filter-container");
const filterDiv = document.getElementById("filter-item");
const clearBtn = document.getElementById("clear-btn");
const cardContainer = document.getElementById("card-container");

let cardData = [];
let originalData = [];
let appliedFilters = {
  level: null,
  languages: [],
  tools: [],
  role: null,
};

async function cardFetch() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    cardData = data.map((item) => ({
      company: item.company,
      logo: item.logo,
      newItem: item.new,
      featureItem: item.featured,
      position: item.position,
      role: item.role,
      level: item.level,
      postedAt: item.postedAt,
      contract: item.contract,
      location: item.location,
      languages: item.languages,
      tools: item.tools,
    }));

    originalData = [...cardData];
    generateCards();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function generateCards() {
  cardContainer.innerHTML = "";

  cardData.forEach((item) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add(
      "bg-white",
      "relative",
      "lg:flex",
      "md:items-center",
      "justify-between",
      "shadow-lg"
    );
    cardElement.innerHTML = `
      <img src="${item.logo}" alt="${
      item.company
    }" class="absolute -top-5 left-5 w-10 lg:static lg:w-16 lg:ms-5" />
      <div class="lg:flex-row lg:justify-between lg:w-full flex flex-col gap-5 p-5 mt-3 lg:mt-0">
        <div>
          <div class="flex gap-3 items-center">
            <h1 class="text-1Desaturated-Dark-Cyan text-xs font-semibold">${
              item.company
            }</h1>
            ${
              item.newItem
                ? `<button class="bg-1Desaturated-Dark-Cyan rounded-s-full rounded-e-full p-1 text-white text-xs">New!</button>`
                : ""
            }
            ${
              item.featureItem
                ? `<button class="bg-black rounded-s-full rounded-e-full text-white text-xs px-2 p-1">FEATURED</button>`
                : ""
            }
          </div>
          <h1 class="font-bold">${item.position}</h1>
          <div class="flex text-4Dark-Grayish-Cyan text-xs gap-3">
            <h2>${item.postedAt}</h2>
            <h2>${item.contract}</h2>
            <h2>${item.location}</h2>
          </div>
          <hr class="mx-auto w-60 md:hidden mt-5" />
        </div>
        <div class="lg:flex-row flex flex-col gap-3 text-xs lg:items-center lg:justify-center">
          <div class="flex gap-3 ">
            ${
              item.role
                ? `<button data-filter="role" class=" bg-3Light-Grayish-Cyan-Filter-Tablets text-1Desaturated-Dark-Cyan font-semibold rounded-md p-2">${item.role}</button>`
                : ""
            }
            ${
              item.level
                ? `<button data-filter="level" class="bg-3Light-Grayish-Cyan-Filter-Tablets text-1Desaturated-Dark-Cyan font-semibold rounded-md p-2">${item.level}</button>`
                : ""
            }
          </div>
          <div class="flex gap-3">
            <div class="space-x-3">
              ${item.languages
                .map(
                  (language) =>
                    `<button data-filter="languages" class="bg-3Light-Grayish-Cyan-Filter-Tablets text-1Desaturated-Dark-Cyan font-semibold rounded-md p-2">${language}</button>`
                )
                .join("")}
            </div>
            <div class="flex gap-3">
              ${item.tools
                .map(
                  (tool) =>
                    `<button data-filter="tools" class="bg-3Light-Grayish-Cyan-Filter-Tablets text-1Desaturated-Dark-Cyan font-semibold rounded-md p-2">${tool}</button>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
    cardContainer.appendChild(cardElement);
  });

  filterEventListeners();
}

function filterEventListeners() {
  const allFilters = document.querySelectorAll("[data-filter]");

  allFilters.forEach((filter) => {
    filter.addEventListener("click", (event) => {
      const filterType = event.target.getAttribute("data-filter");
      const filterValue = event.target.textContent.trim();

      // Check if the filter already exists before adding
      if (!isFilterApplied(filterType, filterValue)) {
        // Add filter to appliedFilters
        applyFilter(filterType, filterValue);
        // Update UI
        updateFilterUI();
        filterContainer.classList.remove("hidden");
      } else {
        // Remove filter if already applied
        removeFilter(filterType, filterValue);
        // Update UI
        updateFilterUI();
      }
    });
  });
}

function isFilterApplied(type, value) {
  if (type === "level" || type === "role") {
    return appliedFilters[type] === value;
  } else {
    return appliedFilters[type].includes(value);
  }
}

function updateFilterUI() {
  // Clear filter display area
  filterDiv.innerHTML = "";

  // Add filters to display area
  Object.entries(appliedFilters).forEach(([type, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          filterDiv.innerHTML += `
            <div class="filter-item ">
              <button class="filter-btn bg-3Light-Grayish-Cyan-Filter-Tablets text-1Desaturated-Dark-Cyan font-semibold rounded-md px-2 py-1 text-xs" data-filter="${type}" data-value="${item}">
                ${item}
                <button class="remove-btn bg-1Desaturated-Dark-Cyan text-white text-xs font-bold p-1 rounded-r-md">
                  X
                </button>
              </button>
            </div>`;
        });
      } else {
        filterDiv.innerHTML += `
          <div class="filter-item">
            <button class="filter-btn bg-3Light-Grayish-Cyan-Filter-Tablets text-1Desaturated-Dark-Cyan font-semibold rounded-md px-2 py-1 text-xs" data-filter="${type}" data-value="${value}">
              ${value}
              <button class="remove-btn bg-1Desaturated-Dark-Cyan text-white text-xs font-bold p-1 rounded-r-md">
                X
              </button>
            </button>
          </div>`;
      }
    }
  });

  addRemoveFilterListener();
}

function addRemoveFilterListener() {
  const removeButtons = document.querySelectorAll(".remove-btn");

  removeButtons.forEach((button) => {
    button.removeEventListener("click", removeFilterHandler);
    button.addEventListener("click", removeFilterHandler);
  });
}

function removeFilterHandler(event) {
  const filterType = event.target.parentElement.getAttribute("data-filter");
  const filterValue = event.target.parentElement.getAttribute("data-value");

  event.target.parentElement.parentElement.remove();

  removeFilter(filterType, filterValue);

  if (
    Object.values(appliedFilters).every(
      (value) => value === null || value.length === 0
    )
  ) {
    filterContainer.classList.add("hidden");
  }
}

function applyFilter(type, value) {
  if (type === "level" || type === "role") {
    appliedFilters[type] = value;
  } else {
    if (!appliedFilters[type].includes(value)) {
      appliedFilters[type].push(value);
    }
  }

  filterData();
}

function removeFilter(type, value) {
  if (type === "level" || type === "role") {
    appliedFilters[type] = null;
  } else {
    appliedFilters[type] = appliedFilters[type].filter(
      (item) => item !== value
    );
  }

  filterData();
}

function filterData() {
  let filteredData = originalData;

  if (appliedFilters.level) {
    filteredData = filteredData.filter(
      (item) => item.level === appliedFilters.level
    );
  }
  if (appliedFilters.role) {
    filteredData = filteredData.filter(
      (item) => item.role === appliedFilters.role
    );
  }
  if (appliedFilters.languages.length > 0) {
    filteredData = filteredData.filter((item) =>
      appliedFilters.languages.every((lang) => item.languages.includes(lang))
    );
  }
  if (appliedFilters.tools.length > 0) {
    filteredData = filteredData.filter((item) =>
      appliedFilters.tools.every((tool) => item.tools.includes(tool))
    );
  }

  cardData = filteredData;
  generateCards();
}

function clearFilters() {
  cardData = [...originalData];

  appliedFilters = {
    level: null,
    languages: [],
    tools: [],
    role: null,
  };

  generateCards();

  if (
    Object.values(appliedFilters).every(
      (value) => value === null || value.length === 0
    )
  ) {
    filterContainer.classList.add("hidden");
  }
}

clearBtn.addEventListener("click", clearFilters);

cardFetch();
