import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { fetchCurrentTemperature, tempAvgAboveAtCoords } from "./fetchCurrentTemperature.js";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

describe("fetchCurrentTemperature", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  test("Should return correct time and temperature_2m", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2025-04-23T01:00", "2025-04-23T02:00"],
          temperature_2m: [55.1, 54.1],
        },
      })
    );
    const res = await fetchCurrentTemperature({ lat: 40, lon: 40 });
    expect(res.time).toStrictEqual(["2025-04-23T01:00", "2025-04-23T02:00"]);
    expect(res.temperature_2m).toStrictEqual([55.1, 54.1]);
  });

  test("rejects with exact statusText when response not ok", async () => {
    const testCases = [
      { status: 400, statusText: "Bad Request" },
      { status: 401, statusText: "Unauthorized" },
      { status: 404, statusText: "Not Found" },
      { status: 500, statusText: "Internal Server Error" },
    ];

    for (const { status, statusText } of testCases) {
      fetchMock.mockResponseOnce("", { status, statusText });
      await expect(fetchCurrentTemperature({ lat: 0, lon: 0 })).rejects.toThrow(new Error(statusText));
    }
  });

  test("Should throw error when response not ok", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));
    await expect(fetchCurrentTemperature({ lat: 40, lon: 40 })).rejects.toThrow("Network error");
  });

  test("Should throw error when data format is invalid", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({})); //no temp format
    await expect(fetchCurrentTemperature({ lat: 40, lon: 40 })).rejects.toThrow("Invalid temperature format");
  });

  test("Should throw an error when only time is there", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2025-04-23T01:00", "2025-04-23T02:00"],
        },
      })
    ); //no temperature_2 format
    await expect(fetchCurrentTemperature({ lat: 40, lon: 40 })).rejects.toThrow("Invalid temperature format");
  });

  test("Should throw an error when only temperature_2 is there", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          temperature_2m: [55.1, 54.1],
        },
      })
    ); //no temperature_2 format
    await expect(fetchCurrentTemperature({ lat: 40, lon: 40 })).rejects.toThrow("Invalid temperature format");
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("tempAvgAboveAtCoords", () => {
  // TODO
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  test("should return true if the average is greater than the temp", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2025-04-23T01:00", "2025-04-23T02:00"],
          temperature_2m: [55.1, 54.1],
        },
      })
    );
    const res = await tempAvgAboveAtCoords({ lat: 40, lon: 40 }, 30);
    expect(res).toBe(true);
  });

  test("should return false if the average is lower than the temp", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2025-04-23T01:00", "2025-04-23T02:00"],
          temperature_2m: [55.1, 54.1],
        },
      })
    );
    const res = await tempAvgAboveAtCoords({ lat: 40, lon: 40 }, 60);
    expect(res).toBe(false);
  });

  test("Should throw error when response not ok", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));
    await expect(tempAvgAboveAtCoords({ lat: 40, lon: 40 }, 60)).rejects.toThrow("Network error");
  });

  test("Should throw error when data format is invalid", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    await expect(tempAvgAboveAtCoords({ lat: 40, lon: 40 }, 60)).rejects.toThrow("Invalid temperature format");
  });

  test("Should throw an error when only time is there", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2025-04-23T01:00", "2025-04-23T02:00"],
        },
      })
    ); //no temperature_2 format
    await expect(tempAvgAboveAtCoords({ lat: 40, lon: 40 })).rejects.toThrow("Invalid temperature format");
  });

  test("Should throw an error when only temperature_2 is there", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          temperature_2m: [55.1, 54.1],
        },
      })
    ); //no temperature_2 format
    await expect(tempAvgAboveAtCoords({ lat: 40, lon: 40 })).rejects.toThrow("Invalid temperature format");
  });

  test("Should throw an error when only temperature_2 is there but as empty array", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2023-01-01T00:00"],
          temperature_2m: [],
        },
      })
    ); //no temperature_2 format
    await expect(tempAvgAboveAtCoords({ lat: 40, lon: 40 })).rejects.toMatch("No temperature data available");
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
