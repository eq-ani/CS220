// Working Example
// Program: Takes user input and returns a random cat fact and a list of meals based on input.

import readline from "readline";
import fetch from "node-fetch";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function fetchCatFact() {
  const u = new URL("https://220.maxkuechen.com/fetch/noCache/?url=https://catfact.ninja/fact");
  return fetch(u.toString()).then(v => (v.ok ? v.json() : Promise.reject(new Error(v.statusText))));
}

function fetchMeals(s) {
  const u = new URL("https://www.themealdb.com/api/json/v1/1/search.php");
  u.searchParams.append("s", s);
  return fetch(u.toString())
    .then(v => (v.ok ? v.json() : Promise.reject(new Error(v.statusText))))
    .then(d => (d.meals ? d.meals.map(m => m.strMeal) : ["No meals found for that search term."]));
}

rl.question("Enter a food to search for (example: pasta, chicken): ", t => {
  const s = t.trim();
  Promise.all([fetchCatFact(), fetchMeals(s)])
    .then(([c, m]) => {
      console.log(`\nRandom Cat Fact: ${c.fact}`);
      console.log("\nMeals Found:");
      m.forEach((meal, i) => console.log(`${i + 1}. ${meal}`));
      rl.close();
    })
    .catch(e => {
      console.error("Error:", e.message);
      rl.close();
    });
});
