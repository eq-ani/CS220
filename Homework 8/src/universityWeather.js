// Do not directly import these from your files. This allows the autograder to evaluate the functions in this
// file against the sample solution.
import { fetchCurrentTemperature, fetchGeoCoord, fetchUniversities } from "../include/exports.js";

export function fetchUniversityWeather(universityQuery, transformName) {
  return fetchUniversities(universityQuery).then(uni => {
    if (uni.length === 0) return Promise.reject(new Error("No universities found"));
    const f = uni.map(u => {
      const n = transformName ? transformName(u) : u;
      return fetchGeoCoord(n)
        .then(c => fetchCurrentTemperature(c))
        .then(t => {
          const a = t.temperature_2m.reduce((s, v) => s + v, 0) / t.temperature_2m.length;
          return { u, a };
        });
    });
    return Promise.all(f).then(res => {
      const out = { totalAverage: 0 };
      let sum = 0;
      res.forEach(r => {
        out[r.u] = r.a;
        sum += r.a;
      });
      out.totalAverage = sum / res.length;
      return out;
    });
  });
}

export function fetchUMassWeather() {
  return fetchUniversityWeather("University of Massachusetts", n => n.replace("at ", ""));
}

export function fetchUMichWeather() {
  return fetchUniversityWeather("University of Michigan");
}
