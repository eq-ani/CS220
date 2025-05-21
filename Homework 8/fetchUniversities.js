export function fetchUniversities(query) {
  const searchURL = new URL("https://220.maxkuechen.com/universities/search");
  searchURL.searchParams.append("name", query);
  return fetch(searchURL.toString())
    .then(v => {
      return v.ok ? v.json() : Promise.reject(new Error(v.statusText));
    })
    .then(v => v.map(e => e.name));
}

export function universityNameLengthOrderAscending(queryName) {
  return fetchUniversities(queryName).then(v => {
    for (let i = 1; i < v.length; v++) {
      if (v[i - 1].length >= v[i].length) return Promise.resolve(false);
    }
    return Promise.resolve(true);
  });
}
