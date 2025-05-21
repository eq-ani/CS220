import { jest } from "@jest/globals";
import { fetchGeoCoord, locationImportantEnough } from "./fetchGeoCoord.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

describe("fetchGeoCoord", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("should return correct GeoCoord object for a valid query", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ lat: "5", lon: "10", importances: [0.2, 0.4, 0.6] }]));

    const result = await fetchGeoCoord("University of Massachusetts Amherst");
    expect(typeof result).toBe("object");
    expect(typeof result.lon).toBe("number");
    expect(typeof result.lat).toBe("number");
    expect(Array.isArray(result.importances)).toBe(true);
    expect(result.importances.length).toBe(3);
  });

  it("should reject if API response is not ok", async () => {
    fetchMock.mockResponseOnce("Internal Server Error", { status: 500, statusText: "Internal Server Error" });
    await expect(fetchGeoCoord("Bad Place")).rejects.toThrow("Internal Server Error");
  });

  it("should reject if API returns an empty array", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    await expect(fetchGeoCoord("Empty Place")).rejects.toThrow("No results found");
  });
});

describe("locationImportantEnough", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("should return true when max importance is greater than threshold", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ lat: "5", lon: "10", importances: [0.2, 0.6, 0.8] }]));
    const result = await locationImportantEnough("High Importance Place", 0.7);
    expect(result).toBe(true);
  });

  it("should return false when max importance is not greater than threshold", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ lat: "5", lon: "10", importances: [0.2, 0.4, 0.6] }]));
    const result = await locationImportantEnough("Low Importance Place", 0.8);
    expect(result).toBe(false);
  });

  it("should propagate error when fetchGeoCoord fails", async () => {
    fetchMock.mockResponseOnce("Server Error", { status: 500, statusText: "Server Error" });
    await expect(locationImportantEnough("Bad Place", 0.5)).rejects.toThrow("Server Error");
  });
});
