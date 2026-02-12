import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addArt,
  saveArtForLater,
  getSavedWithinDays,
  removeSavedArt,
  getApprovedArts,
  getPendingArts,
  approveArt,
  rejectArt,
  recordSale,
  getSales,
  getSalesSummary,
} from "../src/services.artService.js";

const mockStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => {
      store[k] = String(v);
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = mockStorage;
global.crypto = {
  randomUUID: () => "test-id",
};

describe("artService", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it("adds art and returns it", () => {
    const art = addArt({
      title: "Test Art",
      imageUrl: "http://example.com/img.jpg",
      price: 10,
      stock: 2,
    });
    expect(art.title).toBe("Test Art");
    expect(getPendingArts()).toHaveLength(1);
  });

  it("saves art and returns only items within last 15 days", () => {
    const art = addArt({
      title: "Recent Art",
      imageUrl: "http://example.com/img.jpg",
      price: 10,
      stock: 1,
    });
    saveArtForLater(art.id);
    const result = getSavedWithinDays(15);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Recent Art");
  });

  it("removes saved art", () => {
    const art = addArt({
      title: "To Remove",
      imageUrl: "http://example.com/img.jpg",
      price: 5,
      stock: 1,
    });
    saveArtForLater(art.id);
    expect(getSavedWithinDays(15)).toHaveLength(1);
    removeSavedArt(art.id);
    expect(getSavedWithinDays(15)).toHaveLength(0);
  });

  it("approves and rejects art correctly", () => {
    const art = addArt({
      title: "Moderate Me",
      imageUrl: "http://example.com/img.jpg",
      price: 20,
      stock: 1,
    });
    expect(getPendingArts()).toHaveLength(1);
    approveArt(art.id);
    expect(getPendingArts()).toHaveLength(0);
    expect(getApprovedArts()).toHaveLength(1);

    // Rejecting moves it out of approved
    rejectArt(art.id, "Not suitable");
    expect(getApprovedArts()).toHaveLength(0);
  });

  it("records sales and computes summary", () => {
    const art = addArt({
      title: "For Sale",
      imageUrl: "http://example.com/img.jpg",
      price: 50,
      stock: 2,
    });
    approveArt(art.id);

    recordSale(art.id);
    recordSale(art.id);

    const sales = getSales();
    expect(sales).toHaveLength(2);

    const summary = getSalesSummary();
    expect(summary.totalCount).toBe(2);
    expect(summary.totalRevenue).toBe(100);
  });
});

