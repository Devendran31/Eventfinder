// categoryEvents.js
console.log("Category requested:", categoryName);
console.log("Events found:", allEvents ? allEvents[categoryName] : "❌ allEvents missing");

function loadCategoryEvents(categoryName) {
  const container = document.getElementById("eventsContainer");
  const events = allEvents[categoryName];

  // If category doesn't exist or has no events
  if (!events || events.length === 0) {
    container.innerHTML = "<p>No events found for this category.</p>";
    return;
  }

  // Generate event cards
  container.innerHTML = events
    .map((event) => {
      // Use fallback image if not provided
      const imageSrc = event.image && event.image.trim() !== "" 
        ? event.image 
        : "https://via.placeholder.com/400x250?text=No+Image";

      return `
        <div class="event">
          <img src="${imageSrc}" alt="${event.name}" />
          <h3>${event.name}</h3>
          <p><strong>Date:</strong> ${event.date || "TBA"}</p>
          <p><strong>Venue:</strong> ${event.venue || "Unknown"}, ${event.city || ""}</p>
          <a href="${event.url}" target="_blank">View Details</a>
        </div>
      `;
    })
    .join("");
}
