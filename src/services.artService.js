// Simple in-memory + localStorage art service used by the UI

const STORAGE_KEYS = {
  ARTS: "art_showcase_arts",
  SAVED: "art_showcase_saved",
  SALES: "art_showcase_sales",
};

function safeParse(defaultValue, raw) {
  try {
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function loadArts() {
  const raw = localStorage.getItem(STORAGE_KEYS.ARTS);
  return safeParse([], raw);
}

export function saveArts(arts) {
  localStorage.setItem(STORAGE_KEYS.ARTS, JSON.stringify(arts));
}

export function addArt({ title, imageUrl, price, stock }) {
  const arts = loadArts();
  const art = {
    id: crypto.randomUUID(),
    title,
    imageUrl,
    price,
    stock,
    createdAt: new Date().toISOString(),
  };
  arts.push(art);
  saveArts(arts);
  console.log("[ART] created", art);
  return art;
}

export function getAllArts() {
  return loadArts();
}

export function getArtById(id) {
  return loadArts().find((a) => a.id === id) || null;
}

export function loadSaved() {
  const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
  return safeParse([], raw);
}

export function saveSaved(saved) {
  localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(saved));
}

export function saveArtForLater(artId) {
  const saved = loadSaved();
  const now = new Date().toISOString();
  if (!saved.find((s) => s.artId === artId)) {
    saved.push({ artId, savedAt: now });
    saveSaved(saved);
    console.log("[SAVED] art saved", { artId, savedAt: now });
  }
}

export function removeSavedArt(artId) {
  const saved = loadSaved().filter((s) => s.artId !== artId);
  saveSaved(saved);
  console.log("[SAVED] art removed", { artId });
}

export function getSavedWithinDays(days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const arts = loadArts();
  return loadSaved()
    .filter((s) => new Date(s.savedAt).getTime() >= cutoff)
    .map((s) => {
      const art = arts.find((a) => a.id === s.artId);
      return art ? { ...art, savedAt: s.savedAt } : null;
    })
    .filter(Boolean);
}

