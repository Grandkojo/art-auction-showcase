import {
  addArt,
  getAllArts,
  getArtById,
  getSavedWithinDays,
  saveArtForLater,
  removeSavedArt,
} from "./services.artService.js";

const DAYS_WINDOW = 15;

function $(selector) {
  return document.querySelector(selector);
}

function createButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

function renderArtistCollection() {
  const container = $("#artist-collection");
  container.innerHTML = "";
  getAllArts().forEach((art) => {
    const li = document.createElement("li");
    li.className = "card";
    const main = document.createElement("div");
    main.className = "card-main";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = art.title;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = `Price: $${art.price} · Stock: ${art.stock}`;

    main.appendChild(title);
    main.appendChild(meta);
    li.appendChild(main);
    container.appendChild(li);
  });
}

function renderMarketplace() {
  const container = $("#marketplace-list");
  container.innerHTML = "";
  getAllArts().forEach((art) => {
    const li = document.createElement("li");
    li.className = "card";
    const main = document.createElement("div");
    main.className = "card-main";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = art.title;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = `Price: $${art.price} · Stock: ${art.stock}`;

    main.appendChild(title);
    main.appendChild(meta);

    const actions = document.createElement("div");
    actions.appendChild(
      createButton(
        "View",
        "btn",
        () => showSelectedArt(art.id),
      ),
    );

    li.appendChild(main);
    li.appendChild(actions);
    container.appendChild(li);
  });
}

function renderSaved() {
  const container = $("#saved-list");
  container.innerHTML = "";
  const saved = getSavedWithinDays(DAYS_WINDOW);
  saved.forEach((art) => {
    const li = document.createElement("li");
    li.className = "card";
    const main = document.createElement("div");
    main.className = "card-main";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = art.title;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = `Price: $${art.price} · Saved at: ${new Date(
      art.savedAt,
    ).toLocaleString()}`;

    main.appendChild(title);
    main.appendChild(meta);

    const actions = document.createElement("div");
    actions.appendChild(
      createButton("Buy", "btn primary", () => simulatePayment(art.id)),
    );
    actions.appendChild(
      createButton("Remove", "btn", () => {
        removeSavedArt(art.id);
        renderSaved();
      }),
    );

    li.appendChild(main);
    li.appendChild(actions);
    container.appendChild(li);
  });
}

function showSelectedArt(artId) {
  const art = getArtById(artId);
  const container = $("#selected-art");
  if (!art) {
    container.classList.add("hidden");
    return;
  }
  container.classList.remove("hidden");
  container.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = art.title;

  const img = document.createElement("img");
  img.src = art.imageUrl;
  img.alt = art.title;

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = `Price: $${art.price} · Stock: ${art.stock}`;

  const actions = document.createElement("div");
  actions.appendChild(
    createButton("Buy", "btn primary", () => simulatePayment(art.id)),
  );
  actions.appendChild(
    createButton("Save for later", "btn", () => {
      saveArtForLater(art.id);
      renderSaved();
    }),
  );

  container.appendChild(title);
  container.appendChild(img);
  container.appendChild(meta);
  container.appendChild(actions);
}

function simulatePayment(artId) {
  const art = getArtById(artId);
  if (!art) return;
  console.log("[PAYMENT] simulated payment for art", art);
  alert(`Payment simulated for "${art.title}"`);
}

function openModal() {
  $("#add-art-modal").classList.remove("hidden");
}

function closeModal() {
  $("#add-art-modal").classList.add("hidden");
  $("#add-art-form").reset();
}

function updateStatus(message) {
  $("#status-text").textContent = message;
}

function init() {
  $("#open-add-art-modal").addEventListener("click", openModal);
  $("#close-add-art-modal").addEventListener("click", closeModal);

  $("#add-art-form").addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const title = $("#art-title").value.trim();
      const imageUrl = $("#art-image").value.trim();
      const price = parseFloat($("#art-price").value);
      const stock = parseInt($("#art-stock").value, 10);
      addArt({ title, imageUrl, price, stock });
      renderArtistCollection();
      renderMarketplace();
      closeModal();
      updateStatus("Last action: art created successfully.");
    } catch (err) {
      console.error("[ERROR] failed to add art", err);
      updateStatus("Last action: failed to add art (see console).");
    }
  });

  renderArtistCollection();
  renderMarketplace();
  renderSaved();
}

document.addEventListener("DOMContentLoaded", init);

