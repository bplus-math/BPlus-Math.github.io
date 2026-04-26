const BASE = "/BPlus-Math/";

const grid = document.getElementById("gameGrid");
const modal = document.getElementById("gameModal");
const frame = document.getElementById("gameFrame");
const title = document.getElementById("gameTitle");
const search = document.getElementById("search");

function resolvePath(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return BASE + path;
}

function loadGames(list = window.games) {
  grid.innerHTML = "";

  list.forEach(game => {
    const card = document.createElement("div");
    card.className = "game";

    card.innerHTML = `
      <img src="${game.icon}">
      <div>${game.name}</div>
    `;

    card.onclick = () => {
      title.textContent = game.name;
      frame.src = resolvePath(game.file);
      modal.classList.remove("hidden");
    };

    grid.appendChild(card);
  });
}

function closeGame() {
  modal.classList.add("hidden");
  frame.src = "about:blank";
}

search?.addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  loadGames(
    window.games.filter(g =>
      g.name.toLowerCase().includes(val)
    )
  );
});

window.addEventListener("DOMContentLoaded", () => {
  modal.classList.add("hidden");
  loadGames();

  document.getElementById("closeBtn")?.addEventListener("click", closeGame);
});
