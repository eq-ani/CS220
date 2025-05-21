import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { fetchUMichWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";

const SECOND = 1000;
jest.setTimeout(40 * SECOND);

describe("fetchUMichWeather", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  test("returns average for University of Michigan", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "University of Michigan" }]));
    fetchMock.mockResponseOnce(JSON.stringify([{ lat: 42.28, lon: -83.74, importances: [1] }]));
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00", "2024-04-01T01:00"],
          temperature_2m: [50, 51],
        },
      })
    );

    const result = await fetchUMichWeather();
    expect(result).toEqual({
      totalAverage: 50.5,
      "University of Michigan": 50.5,
    });
  });
});

describe("fetchUMassWeather", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  test("returns averages for UMass system", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([{ name: "University of Massachusetts Amherst" }, { name: "University of Massachusetts Boston" }])
    );

    fetchMock.mockResponses(
      JSON.stringify([{ lat: 42.37, lon: -72.52, importances: [1] }]),
      JSON.stringify([{ lat: 42.31, lon: -71.03, importances: [1] }]),
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00", "2024-04-01T01:00"],
          temperature_2m: [42, 43],
        },
      }),
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00", "2024-04-01T01:00"],
          temperature_2m: [45, 46],
        },
      })
    );

    const result = await fetchUMassWeather();
    expect(result).toEqual({
      totalAverage: 44,
      "University of Massachusetts Amherst": 42.5,
      "University of Massachusetts Boston": 45.5,
    });
  });

  test("transforms 'at' in campus names", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "University of Massachusetts at Amherst" }]));

    fetchMock.mockResponseOnce(JSON.stringify([{ lat: 42, lon: -72, importances: [1] }]));

    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00"],
          temperature_2m: [42],
        },
      })
    );

    await fetchUMassWeather();
    expect(fetchMock.mock.calls[1][0]).toContain("search?q=University+of+Massachusetts+Amherst");
  });
});

describe("fetchUniversityWeather", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  test("rejects with error if no universities match query", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    await expect(fetchUniversityWeather("Nonexistent University")).rejects.toThrow("No universities found");
  });

  test("returns averages for matching universities", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "University One" }, { name: "University Two" }]));

    fetchMock.mockResponses(
      JSON.stringify([{ lat: 40, lon: -70, importances: [1] }]),
      JSON.stringify([{ lat: 42, lon: -72, importances: [1] }]),
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00", "2024-04-01T01:00"],
          temperature_2m: [60, 61],
        },
      }),
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00", "2024-04-01T01:00"],
          temperature_2m: [40, 41],
        },
      })
    );

    const result = await fetchUniversityWeather("University");
    expect(result).toEqual({
      totalAverage: 50.5,
      "University One": 60.5,
      "University Two": 40.5,
    });
  });

  test("applies transformName to university names", async () => {
    const transformName = name => name.replace(" at ", " ");

    fetchMock.mockResponseOnce(JSON.stringify([{ name: "University of Massachusetts at Amherst" }]));

    fetchMock.mockResponseOnce(JSON.stringify([{ lat: 42, lon: -72, importances: [1] }]));

    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00"],
          temperature_2m: [42],
        },
      })
    );

    const result = await fetchUniversityWeather("University of Massachusetts", transformName);
    expect(result["University of Massachusetts at Amherst"]).toBe(42);
  });

  test("handles single university case", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "Solo University" }]));
    fetchMock.mockResponseOnce(JSON.stringify([{ lat: 40, lon: -70, importances: [1] }]));
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hourly: {
          time: ["2024-04-01T00:00", "2024-04-01T01:00"],
          temperature_2m: [50, 51],
        },
      })
    );

    const result = await fetchUniversityWeather("Solo");
    expect(result).toEqual({
      totalAverage: 50.5,
      "Solo University": 50.5,
    });
  });

  test("handles failed geoCoord fetch", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "Unknown University" }]));
    fetchMock.mockRejectOnce(new Error("Geo API error"));

    await expect(fetchUniversityWeather("Unknown")).rejects.toThrow("Geo API error");
  });
});
