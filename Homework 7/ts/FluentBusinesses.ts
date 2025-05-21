import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }

  private helper1(key: keyof Business, func: (value: any) => boolean): FluentBusinesses {
    const filtered = this.data.filter(business => business[key] !== undefined && func(business[key]));
    return new FluentBusinesses(filtered);
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    return this.helper1("city", value => value === city).helper1("state", value => value === state);
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    return this.helper1("stars", value => value >= stars);
  }

  inCategory(category: string): FluentBusinesses {
    return this.helper1("categories", (value: any) => Array.isArray(value) && value.includes(category));
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    return days.length === 0
      ? this.helper1("hours", () => true)
      : this.helper1("hours", value => days.every(day => value[day] !== undefined));
  }

  hasAmbience(ambience: string): FluentBusinesses {
    return this.helper1("attributes", (value: any) => value?.Ambience?.[ambience] === true);
  }

  private helper2(key1: keyof Business, key2: keyof Business): Business | undefined {
    const b = this.data.filter(b => b[key1] !== undefined);
    if (b.length === 0) return undefined;
    return b.reduce((best, current) => {
      if (current[key1]! > best[key1]!) return current;
      if (current[key1] === best[key1]) {
        const curVal = current[key2] ?? -1;
        const bestVal = best[key2] ?? -1;
        if (curVal > bestVal) return current;
      }
      return best;
    });
  }

  bestPlace(): Business | undefined {
    return this.helper2("stars", "review_count");
  }

  mostReviews(): Business | undefined {
    return this.helper2("review_count", "stars");
  }
}
