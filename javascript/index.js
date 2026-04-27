/* =========================
   PERFORMANCE + CLEANER RENDER SYSTEM
   (SAFE: no blocker / webgl changes touched)
   ========================= */

// cache DOM once (faster + cleaner)
const container = document.getElementById('container');
const zoneViewer = document.getElementById('zoneViewer');
const searchBar = document.getElementById('searchBar');
const sortOptions = document.getElementById('sortOptions');
const featuredContainer = document.getElementById('featuredZones');

// state
let zones = [];
let popularityData = {};

// urls
const zonesURL = "https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json?t=" + Date.now();
const coverURL = "https://cdn.jsdelivr.net/gh/freebuisness/covers@main";
const htmlURL = "https://cdn.jsdelivr.net/gh/freebuisness/html@main";

/* =========================
   SINGLE OBSERVER (IMPORTANT OPTIMIZATION)
   ========================= */

const imageObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy-zone-img");
        observer.unobserve(img);
    }
}, {
    rootMargin: "150px",
    threshold: 0.1
});

/* =========================
   IMAGE HELPER
   ========================= */

function createImage(file) {
    const img = document.createElement("img");
    img.dataset.src = file.cover
        .replace("{COVER_URL}", coverURL)
        .replace("{HTML_URL}", htmlURL);

    img.alt = file.name;
    img.loading = "lazy";
    img.className = "lazy-zone-img";

    imageObserver.observe(img);
    return img;
}

/* =========================
   CARD RENDERER (REUSED)
   ========================= */

function createZoneCard(file) {
    const url = getZoneURL(file);

    const card = document.createElement("a");
    card.className = "zone-item";
    card.href = url;
    card.target = "_blank";
    card.rel = "noopener";

    card.onclick = (e) => {
        e.preventDefault();
        openZone(file);
    };

    const img = createImage(file);
    const btn = document.createElement("button");
    btn.textContent = file.name;

    btn.onclick = (e) => {
        e.stopPropagation();
        openZone(file);
    };

    card.appendChild(img);
    card.appendChild(btn);

    return card;
}

/* =========================
   MAIN RENDER (FASTER + CLEANER)
   ========================= */

function displayZones(list) {
    container.innerHTML = "";

    if (!list.length) {
        container.textContent = "No zones found.";
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const file of list) {
        fragment.appendChild(createZoneCard(file));
    }

    container.appendChild(fragment);
    document.getElementById("allSummary").textContent =
        `All Zones (${zones.length})`;
}

/* =========================
   FEATURED (SIMPLIFIED)
   ========================= */

function displayFeaturedZones(list) {
    featuredContainer.innerHTML = "";

    if (!list.length) {
        featuredContainer.textContent = "No featured zones found.";
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const file of list) {
        fragment.appendChild(createZoneCard(file));
    }

    featuredContainer.appendChild(fragment);
    document.getElementById("allZonesSummary").textContent =
        `Featured Zones (${list.length})`;
}

/* =========================
   SORT (LIGHTER + CLEANER)
   ========================= */

function sortZones() {
    const mode = sortOptions.value;

    if (mode === "name") {
        zones.sort((a, b) => a.name.localeCompare(b.name));
    } else if (mode === "id") {
        zones.sort((a, b) => a.id - b.id);
    } else if (mode === "popular") {
        zones.sort((a, b) =>
            (popularityData[b.id] || 0) - (popularityData[a.id] || 0)
        );
    }

    // keep featured at top
    zones.sort((a, b) => (a.id === -1 ? -1 : b.id === -1 ? 1 : 0));

    const featured = zones.filter(z => z.featured);
    displayFeaturedZones(featured);
    displayZones(zones);
}

/* =========================
   SEARCH (FASTER + CLEAN UI BEHAVIOR)
   ========================= */

function filterZones() {
    const q = searchBar.value.toLowerCase();

    if (q.length > 0) {
        document.getElementById("featuredZonesWrapper")?.removeAttribute("open");
    }

    const filtered = zones.filter(z =>
        z.name.toLowerCase().includes(q)
    );

    displayZones(filtered);
}

/* =========================
   OPTIONAL UI BOOST: GRID BOOSTER (SAFE VISUAL ADD-ON)
   ========================= */

// this does NOT change logic — only improves layout consistency
document.addEventListener("DOMContentLoaded", () => {
    const grids = [container, featuredContainer];

    grids.forEach(g => {
        if (!g) return;
        g.style.display = "grid";
        g.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
        g.style.gap = "16px";
    });
});
