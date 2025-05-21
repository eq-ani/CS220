import { jest } from "@jest/globals";
import { fetchUniversities, universityNameLengthOrderAscending } from "./fetchUniversities.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

describe("fetchUniversities", () => {
  it("returns an array of strings", async () => {
    const res = await fetchUniversities("University of Chicago");
    expect(Array.isArray(res)).toEqual(true);
    expect(typeof res[0]).toBe("string");
    const res2 = await fetchUniversities("not real");
    expect(Array.isArray(res2)).toEqual(true);
  });
  it("returns empty results", () => {
    return expect(fetchUniversities("not real")).resolves.toEqual([]);
  });
  it("returns an array containing the expected result", async () => {
    const res = await fetchUniversities("University of Massachusetts at Amherst");
    expect(res.some(v => v === "University of Massachusetts at Amherst")).toEqual(true);
    const res2 = await fetchUniversities("Cornell University");
    expect(res2.some(v => v === "Cornell University")).toEqual(true);
    const res3 = await fetchUniversities("Stanford University");
    expect(res3.some(v => v === "Stanford University")).toEqual(true);
  });
  it("throws the correct errors", async () => {
    fetchMock.enableMocks();
    fetchMock.mockRejectOnce(new Error("There was an error"));
    await expect(fetchUniversities("query")).rejects.toThrow("There was an error");
    fetchMock.mockResponse("cool beans", {
      status: 404,
      statusText: "Not Found",
    });
    await expect(fetchUniversities("query")).rejects.toThrow("Not Found");
  });
});

describe("universityNameLengthOrderAscending", () => {
  beforeEach(() => {
    fetchMock.enableMocks;
  });
  it("returns true in the correct situations", async () => {
    fetchMock.mockResponse(JSON.stringify([{ name: "1" }, { name: "22" }, { name: "333" }, { name: "4444" }]));
    const res = await universityNameLengthOrderAscending("weyfhujls");
    expect(res).toBe(true);
    fetchMock.mockResponse(
      JSON.stringify([
        { name: "short" },
        { name: "less short" },
        { name: "pretty damn long" },
        { name: "super duper crazy long" },
      ])
    );
    const res2 = await universityNameLengthOrderAscending("hjlb");
    expect(res2).toBe(true);
    fetchMock.mockResponse(
      JSON.stringify([
        { name: "Harvard University" },
        { name: "Stanford University" },
        { name: "University of Massachusetts at Amherst" },
        { name: "University of Massachusetts at Dartmouth" },
      ])
    );
    const res3 = await universityNameLengthOrderAscending("ashdjlfk");
    expect(res3).toBe(true);
  });
  it("returns false in the correct situations", async () => {
    fetchMock.mockResponse(JSON.stringify([{ name: "333" }, { name: "1" }, { name: "22" }, { name: "4444" }]));
    const res = await universityNameLengthOrderAscending("weyfhujls");
    expect(res).toBe(true);
    fetchMock.mockResponse(
      JSON.stringify([
        { name: "short" },
        { name: "much less short" },
        { name: "not that long" },
        { name: "super duper crazy long" },
      ])
    );
    const res2 = await universityNameLengthOrderAscending("hjlb");
    expect(res2).toBe(true);
    fetchMock.mockResponse(
      JSON.stringify([
        { name: "University of Massachusetts at Amherst" },
        { name: "Stanford University" },
        { name: "Harvard University" },
        { name: "University of Massachusetts at Dartmouth" },
      ])
    );
    const res3 = await universityNameLengthOrderAscending("ashdjlfk");
    expect(res3).toBe(true);
  });
  it("throws the correct errors", async () => {
    fetchMock.enableMocks();
    fetchMock.mockRejectOnce(new Error("There was an error"));
    await expect(universityNameLengthOrderAscending("query")).rejects.toThrow("There was an error");
    fetchMock.mockResponse("cool beans", {
      status: 404,
      statusText: "Not Found",
    });
    await expect(universityNameLengthOrderAscending("query")).rejects.toThrow("Not Found");
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
