export class FluentBusinesses {
    data;
    constructor(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    helper1(key, func) {
        const filtered = this.data.filter(business => business[key] !== undefined && func(business[key]));
        return new FluentBusinesses(filtered);
    }
    fromCityInState(city, state) {
        return this.helper1("city", value => value === city).helper1("state", value => value === state);
    }
    hasStarsGeq(stars) {
        return this.helper1("stars", value => value >= stars);
    }
    inCategory(category) {
        return this.helper1("categories", (value) => Array.isArray(value) && value.includes(category));
    }
    hasHoursOnDays(days) {
        return days.length === 0
            ? this.helper1("hours", () => true)
            : this.helper1("hours", value => days.every(day => value[day] !== undefined));
    }
    hasAmbience(ambience) {
        return this.helper1("attributes", (value) => value?.Ambience?.[ambience] === true);
    }
    helper2(key1, key2) {
        const b = this.data.filter(b => b[key1] !== undefined);
        if (b.length === 0)
            return undefined;
        return b.reduce((best, current) => {
            if (current[key1] > best[key1])
                return current;
            if (current[key1] === best[key1]) {
                const curVal = current[key2] ?? -1;
                const bestVal = best[key2] ?? -1;
                if (curVal > bestVal)
                    return current;
            }
            return best;
        });
    }
    bestPlace() {
        return this.helper2("stars", "review_count");
    }
    mostReviews() {
        return this.helper2("review_count", "stars");
    }
}
//# sourceMappingURL=FluentBusinesses.js.map