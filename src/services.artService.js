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
    status: "pending",
    rejectionReason: null,
    violationCount: 0,
  };
  arts.push(art);
  saveArts(arts);
  console.log("[ART] created", art);
  return art;
}

export function getAllArts() {
  return loadArts();
}

export function getApprovedArts() {
  return loadArts().filter((a) => (a.status ?? "approved") === "approved");
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

// --- Sales & analytics ---

function loadSales() {
  const raw = localStorage.getItem(STORAGE_KEYS.SALES);
  return safeParse([], raw);
}

function saveSales(sales) {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
}

export function recordSale(artId) {
  const arts = loadArts();
  const art = arts.find((a) => a.id === artId);
  if (!art) return null;

  // Decrease stock if possible
  if (typeof art.stock === "number" && art.stock > 0) {
    art.stock -= 1;
  }
  saveArts(arts);

  const sale = {
    id: crypto.randomUUID(),
    artId,
    title: art.title,
    amount: art.price,
    soldAt: new Date().toISOString(),
  };
  const sales = loadSales();
  sales.push(sale);
  saveSales(sales);
  console.log("[SALE] recorded", sale);
  return sale;
}

export function getSales() {
  return loadSales();
}

export function getSalesSummary() {
  const sales = loadSales();
  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const totalCount = sales.length;

  const byDay = {};
  for (const sale of sales) {
    const day = sale.soldAt.slice(0, 10);
    if (!byDay[day]) {
      byDay[day] = { count: 0, revenue: 0 };
    }
    byDay[day].count += 1;
    byDay[day].revenue += sale.amount ?? 0;
  }

  return { totalRevenue, totalCount, byDay };
}

// --- Admin moderation ---

export function getPendingArts() {
  return loadArts().filter((a) => (a.status ?? "approved") === "pending");
}

export function approveArt(artId) {
  const arts = loadArts();
  const art = arts.find((a) => a.id === artId);
  if (!art) return null;
  art.status = "approved";
  art.rejectionReason = null;
  saveArts(arts);
  console.log("[ADMIN] art approved", { artId });
  return art;
}

export function rejectArt(artId, reason = "") {
  const arts = loadArts();
  const art = arts.find((a) => a.id === artId);
  if (!art) return null;
  art.status = "rejected";
  art.rejectionReason = reason || null;
  art.violationCount = (art.violationCount ?? 0) + 1;
  saveArts(arts);
  console.log("[ADMIN] art rejected", { artId, reason, violationCount: art.violationCount });
  return art;
}

