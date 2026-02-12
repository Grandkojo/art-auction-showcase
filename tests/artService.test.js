import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addArt,
  getAllArts,
  saveArtForLater,
  getSavedWithinDays,
  removeSavedArt,
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
    expect(getAllArts()).toHaveLength(1);
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
});

