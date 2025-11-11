const eventsContainer = document.getElementById("eventsContainer");
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("button");
const noResults = document.getElementById("noResults");

const API_KEY = "9Km1A7nuikACiP5PAQTYb67WjeBF8riS"; // your Ticketmaster API key
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

let currentPage = 0;
let totalPages = 0;
let currentKeyword = "";

// Fetch events with pagination
async function loadEvents(keyword = "", page = 0) {
  eventsContainer.innerHTML = "<p>Loading events...</p>";

  // Build URL
  let url = `${BASE_URL}?apikey=${API_KEY}&size=9&page=${page}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // No events found
    if (!data._embedded || !data._embedded.events) {
      noResults.style.display = "block";
      eventsContainer.innerHTML = "";
      document.getElementById("pagination").style.display = "none";
      return;
    }

    noResults.style.display = "none";
    const events = data._embedded.events;
    totalPages = data.page.totalPages;
    currentPage = data.page.number;

    // Display events
    eventsContainer.innerHTML = events
      .map(
        (event) => `
        <div class="event">
          <img src="${event.images?.[0]?.url || 'images/placeholder.jpg'}" alt="${event.name}" />
          <h3>${event.name}</h3>
          <p><strong>Date:</strong> ${event.dates?.start?.localDate || "TBA"}</p>
          <p><strong>Venue:</strong> ${
            event._embedded?.venues?.[0]?.name || "Unknown Venue"
          }, ${event._embedded?.venues?.[0]?.city?.name || "Unknown City"}</p>
          <a href="${event.url}" target="_blank">View Details</a>
        </div>
      `
      )
      .join("");

    // Update pagination buttons
    updatePagination();
  } catch (error) {
    console.error("Error fetching events:", error);
    eventsContainer.innerHTML = "<p>Failed to load events. Try again later.</p>";
  }
}

// Update pagination buttons dynamically
function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.style.display = "flex";
  pagination.innerHTML = `
    <button id="prevPage" ${currentPage === 0 ? "disabled" : ""}>⬅ Previous</button>
    <span>Page ${currentPage + 1} of ${totalPages}</span>
    <button id="nextPage" ${currentPage >= totalPages - 1 ? "disabled" : ""}>Next ➡</button>
  `;

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 0) loadEvents(currentKeyword, currentPage - 1);
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages - 1) loadEvents(currentKeyword, currentPage + 1);
  });
}

// Search button listener
searchButton.addEventListener("click", () => {
  currentKeyword = searchBox.value.trim();
  loadEvents(currentKeyword, 0);
});

// Load first page by default
loadEvents();

// Add pagination container (if not already in HTML)
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("pagination")) {
    const paginationDiv = document.createElement("div");
    paginationDiv.id = "pagination";
    paginationDiv.style.display = "none";
    paginationDiv.style.justifyContent = "center";
    paginationDiv.style.alignItems = "center";
    paginationDiv.style.gap = "10px";
    paginationDiv.style.margin = "20px";
    document.querySelector("main").appendChild(paginationDiv);
  }
});
