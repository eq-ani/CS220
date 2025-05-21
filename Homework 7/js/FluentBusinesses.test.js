import assert from "assert";
import { FluentBusinesses } from "./FluentBusinesses";
const testData = [
    { business_id: "1", name: "Applebee's", city: "Charlotte", state: "NC", stars: 4, review_count: 6 },
    { business_id: "2", name: "China Garden", city: "Charlotte", state: "NC", stars: 4, review_count: 10 },
    { business_id: "3", name: "Beach Ventures Roofing", city: "Phoenix", state: "AZ", stars: 3, review_count: 30 },
    { business_id: "4", name: "Alpaul Automobile Wash", city: "Charlotte", state: "NC", stars: 3, review_count: 30 },
];
const categoryTestData = [
    { business_id: "5", name: "Restaurant A", categories: ["Restaurants", "Italian"] },
    { business_id: "6", name: "Restaurant B", categories: ["Restaurants"] },
    { business_id: "7", name: "Cafe A", categories: ["Cafes", "Coffee"] },
    { business_id: "8", name: "Bar A", categories: ["Bars", "Nightlife"] },
];
const hoursTestData = [
    {
        business_id: "9",
        name: "Business",
        hours: { Monday: "9:00-17:00", Tuesday: "9:00-17:00", Wednesday: "9:00-17:00" },
    },
    { business_id: "10", name: "Partial Hours Business", hours: { Monday: "9:00-17:00", Wednesday: "9:00-17:00" } },
    { business_id: "11", name: "No Hours Business" },
];
const ambienceTestData = [
    { business_id: "12", name: "Place A", attributes: { Ambience: { romantic: true, casual: false } } },
    { business_id: "13", name: "Place B", attributes: { Ambience: { romantic: false } } },
    { business_id: "14", name: "Place C" },
];
const mostReviewsTestData = [
    { business_id: "15", name: "Place A", review_count: 10, stars: 4.0 },
    { business_id: "16", name: "Place B", review_count: 10, stars: 3.5 },
    { business_id: "17", name: "Place C", review_count: 15, stars: 4.0 },
    { business_id: "18", name: "Place D", review_count: 15, stars: 3.0 },
];
describe("fromCityInState", () => {
    it("returns businesses in given city and state", () => {
        const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();
        assert.strictEqual(list.length, 3);
        assert.strictEqual(list[0].name, "Applebee's");
        assert.strictEqual(list[1].name, "China Garden");
        assert.strictEqual(list[2].name, "Alpaul Automobile Wash");
    });
    it("returns empty array when no businesses match", () => {
        const list = new FluentBusinesses(testData).fromCityInState("New London", "CT").getData();
        assert.deepStrictEqual(list, []);
    });
    it("ignores businesses missing city or state", () => {
        const data = [
            { business_id: "1", name: "No City", state: "NC", stars: 4, review_count: 5 },
            { business_id: "2", name: "No State", city: "Charlotte", stars: 4, review_count: 5 },
        ];
        const list = new FluentBusinesses(data).fromCityInState("Charlotte", "NC").getData();
        assert.strictEqual(list.length, 0);
    });
    it("fromCityInState does not modify original object", () => {
        const original = new FluentBusinesses(testData);
        const filtered = original.fromCityInState("Charlotte", "NC");
        assert.notStrictEqual(original, filtered);
        assert.deepStrictEqual(original.getData(), testData);
    });
    it("fromCityInState can be chained", () => {
        const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").hasStarsGeq(4).bestPlace();
        assert(list);
        assert.strictEqual(list.name, "China Garden");
    });
});
describe("hasStarsGeq", () => {
    it("returns businesses with stars >= threshold", () => {
        const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();
        assert.strictEqual(list.length, 2);
        assert.strictEqual(list[0].name, "Applebee's");
        assert.strictEqual(list[1].name, "China Garden");
    });
    it("returns empty array when no businesses match", () => {
        const list = new FluentBusinesses(testData).hasStarsGeq(5).getData();
        assert.deepStrictEqual(list, []);
    });
    it("includes stars equal to comparison", () => {
        const data = [
            { business_id: "1", name: "Exact Match", stars: 3.0 },
            { business_id: "2", name: "Too Low", stars: 2.9 },
        ];
        const list = new FluentBusinesses(data).hasStarsGeq(3.0).getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Exact Match");
    });
    it("ignores businesses missing stars", () => {
        const data = [
            { business_id: "1", name: "Missing Stars" },
            { business_id: "2", name: "Valid", stars: 4.0 },
        ];
        const list = new FluentBusinesses(data).hasStarsGeq(3.5).getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Valid");
    });
    it("hasStarsGeq does not modify original object", () => {
        const original = new FluentBusinesses(testData);
        const filtered = original.hasStarsGeq(4);
        assert.notStrictEqual(original, filtered);
        assert.deepStrictEqual(original.getData(), testData);
    });
    it("hasStarsGeq can be chained", () => {
        const list = new FluentBusinesses(testData).hasStarsGeq(3).fromCityInState("Charlotte", "NC").bestPlace();
        assert(list);
        assert.strictEqual(list.name, "China Garden");
    });
});
describe("inCategory", () => {
    it("returns businesses in given category", () => {
        const list = new FluentBusinesses(categoryTestData).inCategory("Restaurants").getData();
        assert.strictEqual(list.length, 2);
        assert.strictEqual(list[0].name, "Restaurant A");
        assert.strictEqual(list[1].name, "Restaurant B");
    });
    it("returns empty array when no match", () => {
        const list = new FluentBusinesses(categoryTestData).inCategory("Nonexistent").getData();
        assert.deepStrictEqual(list, []);
    });
    it("ignores businesses missing category field", () => {
        const data = [
            { business_id: "1", name: "Has Category", categories: ["Match"] },
            { business_id: "2", name: "Missing Category" },
        ];
        const list = new FluentBusinesses(data).inCategory("Match").getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Has Category");
    });
    it("ignores businesses with empty category array", () => {
        const data = [
            { business_id: "1", name: "Empty Category", categories: [] },
            { business_id: "2", name: "Has Category", categories: ["Restaurants"] },
        ];
        const list = new FluentBusinesses(data).inCategory("Restaurants").getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Has Category");
    });
    it("inCategory does not modify original object", () => {
        const original = new FluentBusinesses(categoryTestData);
        const filtered = original.inCategory("Restaurants");
        assert.notStrictEqual(original, filtered);
        assert.deepStrictEqual(original.getData(), categoryTestData);
    });
    it("inCategory can be chained", () => {
        const list = new FluentBusinesses(categoryTestData.concat({
            business_id: "99",
            name: "Chainable Restaurant",
            categories: ["Restaurants"],
            stars: 5,
            review_count: 10,
        }))
            .inCategory("Restaurants")
            .hasStarsGeq(4)
            .bestPlace();
        assert(list);
        assert.strictEqual(list.name, "Chainable Restaurant");
    });
});
describe("hasHoursOnDays", () => {
    it("returns businesses open on all specified days", () => {
        const list = new FluentBusinesses(hoursTestData).hasHoursOnDays(["Monday", "Tuesday"]).getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Business");
    });
    it("returns empty array when no match", () => {
        const list = new FluentBusinesses(hoursTestData).hasHoursOnDays(["Monday", "Tuesday", "Thursday"]).getData();
        assert.deepStrictEqual(list, []);
    });
    it("ignores businesses with empty or missing hours", () => {
        const data = [
            { business_id: "1", name: "Empty Hours", hours: {} },
            { business_id: "2", name: "Partial Hours", hours: { Monday: "8:00-16:00" } },
        ];
        const list = new FluentBusinesses(data).hasHoursOnDays(["Monday", "Tuesday"]).getData();
        assert.deepStrictEqual(list, []);
    });
    it("returns all businesses if no days specified", () => {
        const list = new FluentBusinesses(hoursTestData).hasHoursOnDays([]).getData();
        assert.strictEqual(list.length, 2);
    });
    it("hasHoursOnDays does not modify original object", () => {
        const original = new FluentBusinesses(hoursTestData);
        const filtered = original.hasHoursOnDays(["Monday", "Tuesday"]);
        assert.notStrictEqual(original, filtered);
        assert.deepStrictEqual(original.getData(), hoursTestData);
    });
    it("hasHoursOnDays can be chained", () => {
        const list = new FluentBusinesses(hoursTestData.concat({
            business_id: "88",
            name: "Open All Days",
            hours: { Monday: "9-5", Tuesday: "9-5" },
            stars: 4.5,
            review_count: 8,
        }))
            .hasHoursOnDays(["Monday", "Tuesday"])
            .bestPlace();
        assert(list);
        assert.strictEqual(list.name, "Open All Days");
    });
});
describe("hasAmbience", () => {
    it("returns businesses with ambience true", () => {
        const list = new FluentBusinesses(ambienceTestData).hasAmbience("romantic").getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Place A");
    });
    it("returns empty array when no match", () => {
        const list = new FluentBusinesses(ambienceTestData).hasAmbience("casual").getData();
        assert.deepStrictEqual(list, []);
    });
    it("ignores businesses missing attributes field", () => {
        const data = [
            { business_id: "1", name: "Has Ambience", attributes: { Ambience: { cozy: true } } },
            { business_id: "2", name: "No Ambience" },
        ];
        const list = new FluentBusinesses(data).hasAmbience("cozy").getData();
        assert.strictEqual(list.length, 1);
        assert.strictEqual(list[0].name, "Has Ambience");
    });
    it("hasAmbience does not modify original object", () => {
        const original = new FluentBusinesses(ambienceTestData);
        const filtered = original.hasAmbience("romantic");
        assert.notStrictEqual(original, filtered);
        assert.deepStrictEqual(original.getData(), ambienceTestData);
    });
    it("hasAmbience can be chained", () => {
        const list = new FluentBusinesses(ambienceTestData.concat({
            business_id: "77",
            name: "Romantic Spot",
            attributes: { Ambience: { romantic: true } },
            stars: 4.9,
            review_count: 20,
        }))
            .hasAmbience("romantic")
            .bestPlace();
        assert(list);
        assert.strictEqual(list.name, "Romantic Spot");
    });
});
describe("bestPlace", () => {
    it("returns best place by stars then reviews", () => {
        const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();
        assert(best);
        assert.strictEqual(best.name, "China Garden");
    });
    it("returns undefined if no businesses", () => {
        const best = new FluentBusinesses([]).bestPlace();
        assert.strictEqual(best, undefined);
    });
    it("breaks tie on stars using review_count", () => {
        const data = [
            { business_id: "1", name: "Fewer Reviews", stars: 5.0, review_count: 10 },
            { business_id: "2", name: "More Reviews", stars: 5.0, review_count: 20 },
        ];
        const best = new FluentBusinesses(data).bestPlace();
        assert(best);
        assert.strictEqual(best.name, "More Reviews");
    });
    it("treats missing review_count as less than any number during tie", () => {
        const data = [
            { business_id: "1", name: "Missing Reviews", stars: 5.0 },
            { business_id: "2", name: "Zero Reviews", stars: 5.0, review_count: 0 },
        ];
        const best = new FluentBusinesses(data).bestPlace();
        assert(best);
        assert.strictEqual(best.name, "Zero Reviews");
    });
    it("returns undefined if all businesses are missing required fields", () => {
        const data = [
            { business_id: "1", name: "Nothing" },
            { business_id: "2", name: "Nothing" },
        ];
        const best = new FluentBusinesses(data).bestPlace();
        assert.strictEqual(best, undefined);
    });
    it("bestPlace does not modify original object", () => {
        const original = new FluentBusinesses(testData);
        const best = original.bestPlace();
        assert.deepStrictEqual(original.getData(), testData);
    });
    it("bestPlace can be chained with other filters", () => {
        const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").hasStarsGeq(3).bestPlace();
        assert(list);
        assert.strictEqual(list.name, "China Garden");
    });
});
describe("mostReviews", () => {
    it("returns most reviewed business, breaks ties with stars", () => {
        const best = new FluentBusinesses(mostReviewsTestData).mostReviews();
        assert(best);
        assert.strictEqual(best.name, "Place C");
    });
    it("returns undefined if no businesses", () => {
        const best = new FluentBusinesses([]).mostReviews();
        assert.strictEqual(best, undefined);
    });
    it("breaks tie on reviews using stars", () => {
        const data = [
            { business_id: "1", name: "Lower Stars", review_count: 15, stars: 2.0 },
            { business_id: "2", name: "Higher Stars", review_count: 15, stars: 4.5 },
        ];
        const best = new FluentBusinesses(data).mostReviews();
        assert(best);
        assert.strictEqual(best.name, "Higher Stars");
    });
    it("treats missing stars as less than any number during tie", () => {
        const data = [
            { business_id: "1", name: "Zero Stars", review_count: 50, stars: 0.0 },
            { business_id: "2", name: "Missing Stars", review_count: 50 },
        ];
        const best = new FluentBusinesses(data).mostReviews();
        assert(best);
        assert.strictEqual(best.name, "Zero Stars");
    });
    it("returns undefined if all businesses are missing required fields", () => {
        const data = [
            { business_id: "1", name: "Nothing" },
            { business_id: "2", name: "Nothing" },
        ];
        const reviews = new FluentBusinesses(data).mostReviews();
        assert.strictEqual(reviews, undefined);
    });
    it("mostReviews does not modify original object", () => {
        const original = new FluentBusinesses(mostReviewsTestData);
        const best = original.mostReviews();
        assert.deepStrictEqual(original.getData(), mostReviewsTestData);
    });
    it("mostReviews can be chained with filters", () => {
        const list = new FluentBusinesses(mostReviewsTestData.concat({
            business_id: "100",
            name: "Super Reviewed",
            stars: 5,
            review_count: 100,
            categories: ["Restaurants"],
        }))
            .hasStarsGeq(4)
            .inCategory("Restaurants")
            .mostReviews();
        assert(list);
        assert.strictEqual(list.name, "Super Reviewed");
    });
});
//# sourceMappingURL=FluentBusinesses.test.js.map