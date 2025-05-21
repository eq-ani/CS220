export function fetchGeoCoord(query) {
  const url = new URL("https://220.maxkuechen.com/geoCoord/search");
  url.searchParams.append("q", query);
  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      }
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        return Promise.reject(new Error("No results found"));
      }
      const dat = data[0];
      return {
        lat: Number.parseFloat(dat.lat),
        lon: Number.parseFloat(dat.lon),
        importances: dat.importances,
      };
    });
}
export function locationImportantEnough(place, importanceThreshold) {
  return fetchGeoCoord(place).then(data => {
    const importance = Math.max(...data.importances);
    return importance > importanceThreshold;
  });
}
