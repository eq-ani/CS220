export function fetchCurrentTemperature(coords) {
  // TODO
  return fetch(
    `https://220.maxkuechen.com/currentTemperature/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m&temperature_unit=fahrenheit`
  )
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      }
      return response.json();
    })
    .then(data => {
      if (!data.hourly || !data.hourly.time || !data.hourly.temperature_2m) {
        return Promise.reject(new Error("Invalid temperature format")); //checks if they exist
      }
      return {
        time: data.hourly.time,
        temperature_2m: data.hourly.temperature_2m,
      };
    });
}

export function tempAvgAboveAtCoords(coords, temp) {
  // TODO
  return fetchCurrentTemperature(coords)
    .then(Data => {
      if (Data.temperature_2m.length === 0) {
        return Promise.reject("No temperature data available");
      }

      const average = Data.temperature_2m.reduce((acc, curr) => acc + curr, 0) / Data.temperature_2m.length;
      return average > temp;
    })
    .catch(error => {
      return Promise.reject(error);
    });
}
